import {
    Client,
    DMChannel,
    NewsChannel,
    StreamDispatcher,
    TextChannel,
    VoiceChannel,
    VoiceConnection,
    MessageEmbed,
} from 'discord.js';
import ytdl from 'ytdl-core-discord';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';
import {
    ParseUltimateAlexander,
    ParseEdenGate,
    ParseEdenVerse,
    ParseEdenPromise,
    ParseAsphodelos
} from './FFLogs/FFLogsFunc';
import Timeout = NodeJS.Timeout;
import {findMapImage} from "./FFMap/FFMapFunc";

const client = new Client();

// 랜덤 파티 인원 만들기 배열
let RandomResult: string[] = [];

// 쿠로 만들기용 배열
let kuroArr: any = [];

let sinArr: string[] = [];
let changArr: string[] = [];
let hongArr: string[] = [];
let darkArr: string[] = [];

const kuroListArr = [
    { name: '가루다', local: 'sin' },
    { name: '타이탄', local: 'sin' },
    { name: '이프리트', local: 'sin' },
    { name: '모그', local: 'sin' },
    { name: '리바', local: 'sin' },
    { name: '라무', local: 'sin' },
    { name: '시바', local: 'sin' },
    { name: '오딘', local: 'sin' },
    { name: '알테마', local: 'sin' },

    { name: '비스마르크', local: 'chang' },
    { name: '라바나', local: 'chang' },
    { name: '나오라', local: 'chang' },
    { name: '세피', local: 'chang' },
    { name: '니드호그', local: 'chang' },
    { name: '소피아', local: 'chang' },
    { name: '주르반', local: 'chang' },

    { name: '스사노오', local: 'hong' },
    { name: '락슈미', local: 'hong' },
    { name: '신룡', local: 'hong' },
    { name: '백호', local: 'hong' },
    { name: '츠쿠', local: 'hong' },
    { name: '리오레우스', local: 'hong' },
    { name: '주작', local: 'hong' },
    { name: '청룡', local: 'hong' },

    { name: '티타니아', local: 'dark' },
    { name: '이노센스', local: 'dark' },
    { name: '하데스', local: 'dark' },
    { name: '루비', local: 'dark' },
    { name: '빛전', local: 'dark' },
];

// 프프로그 사용시 경고문
const AlertText = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('잠깐만요!')
    .setDescription('주의사항 : 절대 부대내 다른유저 검색금지 / 무조건 본인것만 확인하기\n' +
        '\n' +
        '시비, 갈등조장의 원인 제공시 원인제공부대원 부대추방 / 봇삭제\n' +
        '\n' +
        '갈등조장\n' +
        '예시1) A유저는 던전자체를 즐기며하는 플레이를 선호. B유저가 A유저의 프프로그를 검색 후 딜싸이클, 던전플레이훈수 등 원하지 않는 정보를 제공하며 압박감 형성\n' +
        '\n' +
        '예시2) A유저와 B유저간 분석을 통해 서로에게 도움을 주기로 합의는 했지만 의도치않은 문제발생으로인해 사이가 틀어질수있음. 둘의 문제점을 부대까지 끌고오게되는 경우\n' +
        '\n' +
        '예시3) B유저는 선의의 마음(B유저 본인의 마음)으로 프프로그 분석을 알려주고 가르쳐주지만 A유저 입장에선 엄청난 부담감, 수치심 느낄가능성이 큼. \n' +
        '\n' +
        '검색자의 검색기록은 지우셔도 남아있습니다!'
    );

// 디스코드 봇 업데이트 문구 출력
const UpdateText = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('쿠뽀 레터 📩')
    .setDescription('"쿠뽀 레터" 를 발행하러 왔어~ 쿠뽀!\n \n' +
        '이제 "링크" 로 바로 원하는 노래를 재생 할 수 있게 되었어 쿠뽀~\n \n' +
        ';;p [링크] 로 입력하면 해당 링크 노래가 나올꺼야! 물론 유튜브 링크만 지원하고 있어 쿠뽀~\n \n' +
        '다음 노래 예약 할 때도 "링크" 로 하고 싶으면 ;;p [링크] 로 하면되구 평소처럼 ;;f [제목] 한 후 ;;p [숫자] 로 해도 예약이 될거야 쿠뽀!\n \n' +
        '언제든 불편한 점이 있다면 부담없이 말해줘 쿠뽀!'
    );

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
// client.on('guildMemberAdd', member => {
//     const channel = member.guild.channels.cache.find(ch => ch.name === '자유채팅🔥');
//     (channel as TextChannel)?.send(`식빵 굽는 ${member.displayName} 냥이가 왔어 쿠뽀! 환영해줘 쿠뽀!`);
// });

client.on('message', async msg => {
    // 혹시나 모를 일을 위해 메시지 정보 수집
    console.log(`${msg.author.tag}: ${msg.content}`);

    const ffMsg: string[] = msg.content.split(' ');

    // 업데이트 쿠뽀 레터 발행용 코드
    if (msg.content === '!!update') {
        const channel_update = client.channels.cache.find(ch => ch.id === '764505214953979935');
        await (channel_update as TextChannel).send(UpdateText);
    }

    // 츄르봇으로 음악방 채널에 직접 말할 수 있는 임시 코드
    if (msg.content.startsWith("!!music")) {
        const word = msg.content.replace(/^!!music\s*/, '');
        const channel_notice = client.channels.cache.find(ch => ch.id === '764505214953979935');
        console.log(word);

        await (channel_notice as TextChannel).send(word);
    }

    // 츄르봇으로 자유채팅 채널에 직접 말할 수 있는 임시 코드
    if (msg.content.startsWith("!!free")) {
        const word = msg.content.replace(/^!!free\s*/, '');
        const channel_notice = client.channels.cache.find(ch => ch.id === '764503355899904012');
        console.log(word);

        await (channel_notice as TextChannel).send(word);
    }

    // 원하는 인원수 만큼 랜덤으로 파티원을 묶어 파티를 만들어줌
    if (msg.content.startsWith(';;파티')) {
        const word = msg.content.replace(/^;;파티\s*/, '').split(' ');
        const number = Number(word[0])+1;
        const calc = Number(word.length - number);

        word.shift();

        while (word.length > calc) {
            const move = word.splice(Math.floor(Math.random() * word.length), 1)[0];
            RandomResult.push(move);
        }

        const result = RandomResult.join(' ');

        if (result.length != 0) {
            await msg.channel.send(`${result} 가 한 파티야~ 쿠뽀!`);
        } else {
            await msg.channel.send('다시 적어 줘~ 쿠뽀!');
        }
        RandomResult = [];
    }

    // 쿠로 중복 단어 제거 하여 보여주는 기능
    if (msg.content.startsWith(';;쿠로')) {
        const words = msg.content.replace(/^;;쿠로\s*/, '').split(' ');

        for(let i=0; i<=words.length; i++) {
            const result = kuroListArr.filter(word => word.name.includes(words[i]));
            kuroArr.push(...result);
        }

        const filterSin = kuroArr.filter(word => word.local === "sin");
        const filterChang = kuroArr.filter(word => word.local === "chang");
        const filterHong = kuroArr.filter(word => word.local === "hong");
        const filterDark = kuroArr.filter(word => word.local === "dark");

        const Sin = Array.from(new Set(filterSin));
        const Chang = Array.from(new Set(filterChang));
        const Hong = Array.from(new Set(filterHong));
        const Dark = Array.from(new Set(filterDark));

        Sin.map((data: any) => (
            sinArr.push(data.name)
        ));

        Chang.map((data: any) => (
            changArr.push(data.name)
        ));

        Hong.map((data: any) => (
            hongArr.push(data.name)
        ));

        Dark.map((data: any) => {
            darkArr.push(data.name)
        });

        if (sinArr.length != 0) {
            let initSinArr = Array.from(new Set(sinArr));
            msg.channel.send('신생: ' + initSinArr);
            initSinArr = [];
        }

        if (changArr.length != 0) {
            let initChangArr = Array.from(new Set(changArr))
            msg.channel.send('창천: ' + initChangArr);
            initChangArr = [];
        }

        if (hongArr.length != 0) {
            let initHongArr = Array.from(new Set(hongArr))
            msg.channel.send('홍련: ' + initHongArr);
            initHongArr = [];
        }

        if (darkArr.length != 0) {
            let initDarkArr = Array.from(new Set(darkArr));
            msg.channel.send('칠흑: ' + initDarkArr);
            initDarkArr = [];
        }

        msg.channel.send('쿠로 목록이야 쿠뽀~');

        kuroArr = [];
        sinArr = [];
        changArr = [];
        hongArr = [];
        darkArr = [];
    }

    // 지도 이미지를 바로 보여주는 기능
    await findMapImage(msg);

    if (ffMsg.length === 4 && ffMsg[3] === '-t') {
        if (ffMsg[0] === '/ff') {
            await msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
            await msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
            await msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
            await msg.author.send(await ParseEdenPromise(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseAsphodelos(ffMsg[1], ffMsg[2], true));
            await msg.author.send(AlertText);
        }
    } else if (ffMsg.length === 3) {
        if (ffMsg[0] === '/ff') {
            await msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseEdenPromise(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseAsphodelos(ffMsg[1], ffMsg[2], true));
            await msg.author.send(AlertText);
        }
    }

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

