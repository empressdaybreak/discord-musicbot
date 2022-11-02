import {
    Client,
    DMChannel,
    NewsChannel,
    StreamDispatcher,
    TextChannel,
    VoiceChannel,
    VoiceConnection,
} from 'discord.js';
import ytdl from 'ytdl-core-discord';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';
import Timeout = NodeJS.Timeout;
import {findMapImage} from "./FunctionList/FFMap/FFMapFunc";
import {autoKuro} from "./FunctionList/FFKuro/FFKuroFunc";
import {randomParty} from "./FunctionList/FFRandomParty/FFRandomPartyFunc";
import {freeChannelNotice, musicChannelNotice, updateNotice} from "./FunctionList/FFBotTalk/FFBotTalkFunc";
import {autoSpoiler} from "./FunctionList/FFSpoiler/FFSpoilerFunc";
import {logsLoad} from "./FunctionList/FFLogs/FFLogsLoadFunc";

const client = new Client();


// 유튜브 노래 재생을 위한 변수
let voiceConnection: VoiceConnection | null = null;
let channel: TextChannel | DMChannel | NewsChannel | null = null;
let streamDispatcher: StreamDispatcher | null = null;
let isPlaying: boolean = false;

// setInterval 을 관리하기 위해 변수 선언
let intervalTimer: Timeout | null = null;

interface YoutubeVideo {
    link: string;
    title: string;
}

// 결과 값을 저장함
let musicList: YouTubeSearchResults[] = [];
let musicQueue: YoutubeVideo[] = [];

const opts = {
    maxResults: 5,
    key: 'AIzaSyBxTDqsANIh8m5jbVKT4oYx8lrvfL5GGzo',
}

/**
 * YouTube의 동영상 목록을 검색합니다.
 * @param term 키워드
 * @returns 검색 결과를 반환합니다.
 */
async function searchYouTube(term): Promise<YouTubeSearchResults[]> {
    try {
        const {results} = await youtubeSearch(term,opts);
        console.log(results);
        return results;
    } catch (e) {
        console.error(e);
    }

    return [];
}

// 재생하는 부분만 담겨져 있는 함수
const musicPlay = async () => {
    const video = musicQueue.shift();

    if (!video) {
        return;
    }

    isPlaying = true;

    await channel?.send(`"${video.title}" 노래를 재생 할께 쿠뽀!`);

    streamDispatcher = voiceConnection?.play(
        await ytdl(video.link, {filter: "audioonly"}),
        {
            type: 'opus',
            highWaterMark: 1<<32,
        }
    ) || null;

    streamDispatcher?.on("finish", () => {
        if (musicQueue.length !== 0) {
            musicPlay();
        } else {
            isPlaying = false;
            channel?.send("모든 노래가 재생됐어!");
        }
    });
};

// 채널에 사람이 있는지 없는지 상시 체크
const BotObserver = async (channel: VoiceChannel) => {
    if (channel.members.size - 1 === 0) {
        clearInterval(intervalTimer!!);
        setTimeout(() => { ChannelUserCheck(channel) }, 180000);
    }
}

// 봇이 나가기전에 채널에 유저가 있는지 한번 더 체크
const ChannelUserCheck = async (channel: VoiceChannel) => {
    if (channel.members.size - 1 === 0) {
        await BotDisconnect();
    } else {
        intervalTimer = setInterval(() => { BotObserver(channel) }, 1000);
    }
}

// 봇이 채널에서 떠날 때 사용
const BotDisconnect = async () => {
    isPlaying = false;
    musicQueue = [];
    channel?.send('이만 가볼께 쿠뽀!');
    voiceConnection?.disconnect();
}

// 봇이 켜지고 준비가 되면 실행
client.on('ready', () => {
    console.log(`${client.user!.tag}가 켜졌습니다!`);
    client.user?.setActivity('식빵 굽기', { type: 'PLAYING' });
});

// 새로운 멤버가 오면 환영메시지
client.on('guildMemberAdd', async member => {
    const channel = member.guild.channels.cache.find(ch => ch.id === '878109743665795072');
    await (channel as TextChannel)?.send(`식빵 굽는 ${member.displayName} 냥이가 왔어 쿠뽀! 환영해줘 쿠뽀!`);
});

client.on('message', async msg => {
    // 혹시나 모를 일을 위해 메시지 정보 수집
    console.log(`${msg.author.tag}: ${msg.content}`);

    // 업데이트 쿠뽀 레터 발행용 코드 (음악방 채널 764505214953979935 / 지도 채널 854251926316515358)
    await updateNotice(msg, client);
    await musicChannelNotice(msg, client);
    await freeChannelNotice(msg, client);

    // 특정 채널 자동 메시지 스포일러 기능
    await autoSpoiler(msg, client);

    // 원하는 인원수 만큼 랜덤으로 파티원을 묶어 파티를 만들어줌
    await randomParty(msg);

    // 쿠로 중복 단어 제거 하여 보여주는 기능
    await autoKuro(msg);

    // 지도 이미지를 바로 보여주는 기능
    await findMapImage(msg);

    await logsLoad(msg);

    // Bot 을 들어오게 함
    if (msg.content === ';;라리호' || msg.content === ';;join') {
        const channelIdNumber = msg.member?.voice.channelID;
        channel = msg.channel;

        if (!msg.member?.voice.channel) {
            await msg.channel.send('채널에는 먼저 들어와줘 쿠뽀!');
        } else if (channelIdNumber != '764505140639563799') {
            await msg.channel.send('음악방🎵 으로 이동해줘 쿠뽀!');
        } else {
            await msg.channel.send('무슨 노래를 재생해 쿠뽀?');
            voiceConnection = await msg.member?.voice.channel?.join();

            const channel = msg.member?.voice.channel;
            intervalTimer = setInterval(() => { BotObserver(channel) }, 1000);
        }
    }


    // 테스트 채널용 Bot 들어오게 함
    // if (msg.content === ';;채널') {
    //     const channelIdNumber = msg.member?.voice.channelID;
    //     channel = msg.channel;
    //
    //     if (!msg.member?.voice.channel) {
    //         await msg.channel.send('채널에는 먼저 들어와줘 쿠뽀!');
    //     } else if (channelIdNumber != '827415974386073650') {
    //         await msg.channel.send('음악방🎵 으로 이동해줘 쿠뽀!');
    //     } else {
    //         const musicPlayer = new MessageEmbed()
    //             .setColor('#0099ff')
    //             .setTitle('뮤직 플레이어')
    //             .setDescription('테스트 뮤직 플레이어')
    //
    //         await msg.channel.send(musicPlayer).then((msg) => {
    //             msg.react('⏩');
    //         });
    //         voiceConnection = await msg.member?.voice.channel?.join();
    //
    //         const channel = msg.member?.voice.channel;
    //         intervalTimer = setInterval(() => { BotObserver(channel) }, 1000);
    //     }
    // }


    // Bot 을 나가게 함
    if (msg.content === ';;나가줘' || msg.content === ';;leave') {
        await BotDisconnect();
    }

    // 음악 검색을 함
    if (msg.content.startsWith(';;f')) {
        if(!msg.member?.voice.channel) {
            await msg.channel.send('채널에는 먼저 들어와줘 쿠뽀!');
        } else if (!voiceConnection) {
            await msg.channel.send('채널에 먼저 들여보내줘 쿠뽀!');
        } else {
            const term = msg.content.replace(/^;;f\s*/, '');
            const searchResults = await searchYouTube(term);
            let message = '';

            // 검색 결과가 musicList 에 저장됨
            musicList = searchResults;

            searchResults.forEach((item, index) => {
                message += `${index + 1}번 ${item.title}\n`;
            })

            await msg.channel.send(`검색결과가 나왔어 쿠뽀!\n${message}`);

            console.log(client.user?.bot, '테스트');
        }
    }

    // 노래 재생 부분
    if (msg.content.startsWith(";;p")) {
        const numberTerm = parseInt(msg.content.replace(/^;;p\s*/, ''), 10) - 1;
        const wordTerm = msg.content.replace(/^;;p\s*/, '');

        if (!voiceConnection) {
            await msg.channel.send('채널에는 아무도 없는것 같다 쿠뽀!');
        } else if (wordTerm.startsWith('http')) {
            // 검색하지 않고 바로 링크를 입력했을 때 바로 재생 되도록 함
            if (wordTerm.includes('youtube') === false) {
                await msg.channel.send('유튜브 링크로만 부탁해 쿠뽀!');
            } else if (!isPlaying) {
                musicQueue.push({
                    link: wordTerm,
                    title: '링크로 추가한 곡',
                });

                await musicPlay();
            } else {
                musicQueue.push({
                    link: wordTerm,
                    title: '링크로 추가한 곡',
                });

                await msg.channel.send(`"링크로 추가한 곡" 노래를 목록에 추가 했어 쿠뽀!`);
            }
        } else if (musicList.length === 0) {
            await msg.channel.send('먼저 노래를 예약해줘 쿠뽀!');
        } else if (!isPlaying) {
            musicQueue.push({
                link: musicList[numberTerm].link,
                title: musicList[numberTerm].title,
            });
            await musicPlay();
        } else {
            musicQueue.push({
                link: musicList[numberTerm].link,
                title: musicList[numberTerm].title,
            });
            await msg.channel.send(`"${musicList[numberTerm].title}" 노래를 목록에 추가 했어 쿠뽀!`);
        }
        musicList = [];
    }

    // 노래를 스킵하는 구간
    if (msg.content == ';;s') {
        if (musicQueue.length !== 0) {
            streamDispatcher?.destroy();

            await musicPlay();
        } else {
            isPlaying = false;
            streamDispatcher?.destroy();
            await msg.channel.send("목록에 노래가 없어 쿠뽀!");
        }

        console.log('현재 남은 노래', musicQueue);
    }

    // 노래 리스트를 보여주는 부분
    if (msg.content === ';;l') {
        let musicListMessage = '';

        if (musicQueue.length == 0){
            await msg.channel.send("예약되어 있는 노래가 없어 쿠뽀!");
        } else {
            musicQueue.forEach((item, index) => {
                musicListMessage += `${index + 1}. ${item.title}\n`;
            })

            await msg.channel.send(`현재 예약되어 있는 노래들이야 쿠뽀!\n${musicListMessage}`);
        }
    }
});

client.login('NjU1NDIwNjM0ODkyODYxNDkz.XfT2CA.qbyPl2k9u2NfFg5pD4L2_CnZQqo');

