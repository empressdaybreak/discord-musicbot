import {Client, DMChannel, NewsChannel, StreamDispatcher, TextChannel, VoiceConnection} from 'discord.js';
import ytdl from 'ytdl-core-discord';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';
import {ParseUltimateAlexander,  ParseEdenGate, ParseEdenVerse} from './FFLogs/FFLogsFunc';

const client = new Client();
const Discord = require("discord.js");

// 프프로그 사용시 경고문
const AlertText = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('경고문!')
    .setDescription('주의사항 : 절대 부대내 다른유저 검색금지 / 무조건 본인것만 확인하기\n' +
        '\n' +
        '시비, 갈등조장의 원인 제공시 원인제공부대원 부대추방 / 봇삭제\n' +
        '\n' +
        '갈등조장\n' +
        '예시1) A유저는 던전자체를 즐기며하는 플레이를 선호. B유저가 A유저의 프프로그를 검색 후 딜싸이클, 던전플레이훈수 등 원하지 않는 정보를 제공하며 압박감 형성\n' +
        '\n' +
        '예시2) A유저와 B유저간 분석을 통해 서로에게 도움을 주기로 합의는 했지만 의도치않은 문제발생으로인해 사이가 틀어질수있음. 둘의 문제점을 부대까지 끌고오게되는 경우\n' +
        '\n' +
        '예시3) B유저는 선의의 마음(B유저 본인의 마음)으로 프프로그 분석을 알려주고 가르쳐주지만 A유저 입장에선 엄청난 부담감, 수치심 느낄가능성이 큼.');

// 유튜브 노래 재생을 위한 변수
let voiceConnection: VoiceConnection | null = null;
let channel: TextChannel | DMChannel | NewsChannel | null = null;
let streamDispatcher: StreamDispatcher | null = null;
let isPlaying: boolean = false;

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
            highWaterMark: 1<<25,
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

client.on('ready', () => {
    console.log(`${client.user!.tag}에 로그인하였습니다!`);
    client.user?.setActivity('식빵 굽기', { type: 'PLAYING' });
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(ch => ch.name === '자유채팅🔥');
    (channel as TextChannel)?.send(`식빵 굽는 ${member.displayName} 냥이가 왔어 쿠뽀! 환영해줘 쿠뽀!`);
});

client.on('message', async msg => {
    console.log('유저: ', msg.author.tag);
    console.log('채팅 내용: ', msg.content);
    // const ffMsg: string[] = msg.content.split(' ');
    // console.log(ffMsg[0]);
    //
    // if (ffMsg.length === 4 && ffMsg[3] === '-t') {
    //     if (ffMsg[0] === '/ffeg') {
    //         // msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
    //         msg.author.send(AlertText);
    //     } else if (ffMsg[0] === '/ffua') {
    //         // msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
    //         msg.author.send(AlertText);
    //     } else if (ffMsg[0] === '/ffev') {
    //         // msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
    //         msg.author.send(AlertText);
    //     } else if (ffMsg[0] === '/ff') {
    //         // msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
    //         // msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
    //         // msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
    //         msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
    //         msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
    //         msg.author.send(AlertText);
    //     }
    // } else if (ffMsg.length === 3) {
    //     if (ffMsg[0] === '/ffeg') {
    //         // msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
    //         msg.author.send(AlertText);
    //     } else if (ffMsg[0] === '/ffua') {
    //         // msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
    //         msg.author.send(AlertText);
    //     } else if (ffMsg[0] === '/ffev') {
    //         // msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
    //         msg.author.send(AlertText);
    //     } else if (ffMsg[0] === '/ff') {
    //         // msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
    //         // msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
    //         // msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
    //         // msg.channel.send(AlertText);
    //
    //         msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
    //         msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
    //         msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
    //         msg.author.send(AlertText);
    //     }
    // }


    // Bot 을 들어오게 함
    if (msg.content === ';;라리호' || msg.content === ';;join') {
        channel = msg.channel;
        if(!msg.member?.voice.channel) {
            await msg.channel.send('채널에는 아무도 없는것 같다 쿠뽀!');
        } else {
            await msg.channel.send('무슨 노래를 재생해 쿠뽀?');
            voiceConnection = await msg.member?.voice.channel?.join();
        }
    }

    // Bot 을 나가게 함
    if (msg.content === '나가줘' || msg.content === ';;leave') {
        await msg.channel.send('이만 가볼께 쿠뽀!');
        voiceConnection?.disconnect();
    }

    // 음악 검색을 함
    if (msg.content.startsWith(';;f')) {
        const term = msg.content.replace(/^;;f\s*/, '');
        const searchResults = await searchYouTube(term);
        let message = '';

        // 검색 결과가 musicList 에 저장됨
        musicList = searchResults;

        searchResults.forEach((item, index) => {
            message += `${index + 1}번 ${item.title}\n`;
        })

        await msg.channel.send(`검색결과가 나왔어 쿠뽀!\n${message}`);
    }


    // 노래 재생 부분
    if (msg.content.startsWith(";;p")) {
        const numberTerm = parseInt(msg.content.replace(/^;;p\s*/, ''), 10) - 1;

        if (!voiceConnection) {
            await msg.channel.send('채널에는 아무도 없는것 같다 쿠뽀!');

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

