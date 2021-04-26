import {Client, DMChannel, NewsChannel, StreamDispatcher, TextChannel, VoiceConnection} from 'discord.js';
import ytdl from 'ytdl-core-discord';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';
import config from './config';
import axios from "axios";

const client = new Client();

const server: {[key: string]: string} = {
    모그리: 'moogle',
    초코보: 'chocobo',
    카벙클: 'carbuncle',
    톤베리: 'tonberry',
};
const job: {[key: string]: string} = {
    Astrologian: '점성술사',
    Bard: '음유시인',
    'Black Mage': '흑마도사',
    'Dark Knight': '암흑기사',
    Dragoon: '용기사',
    Machinist: '기공사',
    Monk: '몽크',
    Ninja: '닌자',
    Paladin: '나이트',
    Scholar: '학자',
    Summoner: '소환사',
    Warrior: '전사',
    'White Mage': '백마도사',
    'Red Mage': '적마도사',
    Samurai: '사무라이',
    Dancer: '무도가',
    Gunbreaker: '건브레이커',
};

type ExtractLayout = {
    encounterID: number;
    spec: string;
    percentile: number;
};


const percentileSortFn = (a: ExtractLayout, b: ExtractLayout) =>
    b.percentile - a.percentile;

const sortByPercentile = (rawData: ExtractLayout[][]) =>
    rawData.map((item) => {
        item.sort(percentileSortFn);
        return item;
    });


function SlicingByLayer(rawData: Array<any>): ExtractLayout[][] {
    const layer: ExtractLayout[] = [];
    const encounterIDList: number[] = [];
    const output: ExtractLayout[][] = [];
    let cnt: number = -1;
    rawData.forEach((i) => {
        if (i.difficulty === 101 || i.encounterID === 1050) {
            layer.push({
                encounterID: i.encounterID,
                spec: i.spec,
                percentile: i.percentile,
            });
        }
    });

    layer.forEach((e) => {
        if (!encounterIDList.find((val) => val === e.encounterID)) {
            output.push([]);
            encounterIDList.push(e.encounterID);
            cnt += 1;
        }
        output[cnt].push(e);
    });
    return output;
}

function SlicedBySpec(rawData: ExtractLayout[][]) {
    let specList: string[] = [];
    const output: ExtractLayout[][] = [];
    const sortData: ExtractLayout[][] = sortByPercentile(rawData);

    sortData.forEach((data) => {
        specList = [];
        output.push([]);
        for (let i: number = 0; i < data.length; i += 1) {
            if (!specList.find((val) => val === data[i].spec)) {
                specList.push(data[i].spec);
                output[output.length - 1].push(data[i]);
            }
        }
    });

    return output;
}

async function QueryHistorical(
    serverNameENG: string,
    charNameENG: string,
    flag: number,
) {
    const url = `https://www.fflogs.com:443/v1/parses/character/${encodeURI(
        charNameENG,
    )}/${serverNameENG}/KR`;
    return (
        await axios.get(url, {
            params: {
                api_key: config.FF_KEY,
                metric: 'rdps',
                zone: flag,
                timeframe: 'historical',
            },
        })
    ).data;
}

async function QueryToday(
    serverNameENG: string,
    charNameENG: string,
    flag: number,
) {
    const url = `https://www.fflogs.com:443/v1/parses/character/${encodeURI(
        charNameENG,
    )}/${serverNameENG}/KR`;
    return (
        await axios.get(url, {
            params: {
                api_key: config.FF_KEY,
                metric: 'rdps',
                zone: flag,
            },
        })
    ).data;
}

async function RankMarker(
    serverName: string,
    charName: string,
    flag: number,
    CheckMethod: boolean,
) {
    const parseTier: string[] = [
        '(회딱)',
        '(초딱)',
        '(파딱)',
        '(보딱)',
        '(주딱)',
        '(핑딱)',
        '(노딱)',
    ];
    const encounter: {[key: number]: string} = {
        65: 'Eden Prime',
        66: 'Voidwalker',
        67: 'Leviathan',
        68: 'Titan',
        69: 'Ramuh',
        70: 'Ifrit and Garuda',
        71: 'The Idol of Darkness',
        72: 'Shiva',
        1050: 'The Epic of Alexander',
    };

    let output: string = '';
    if (Object.keys(server).find((e) => e === serverName)) {
        const getData: ExtractLayout[][] = SlicedBySpec(
            SlicingByLayer(
                CheckMethod
                    ? await QueryHistorical(server[serverName], charName, flag)
                    : await QueryToday(server[serverName], charName, flag),
            ),
        );

        getData.forEach((e) => {
            output += `> **${encounter[e[0].encounterID]}** \n`;
            e.forEach((d) => {
                if (d.percentile < 25) {
                    output += `> \t\`${job[d.spec]} : ${
                        Math.floor(d.percentile * 100) / 100
                    }${parseTier[0]}\`\n`;
                } else if (d.percentile < 50) {
                    output += `> \t\`${job[d.spec]} : ${
                        Math.floor(d.percentile * 100) / 100
                    }${parseTier[1]}\`\n`;
                } else if (d.percentile < 75) {
                    output += `> \t\`${job[d.spec]} : ${
                        Math.floor(d.percentile * 100) / 100
                    }${parseTier[2]}\`\n`;
                } else if (d.percentile < 95) {
                    output += `> \t\`${job[d.spec]} : ${
                        Math.floor(d.percentile * 100) / 100
                    }${parseTier[3]}\`\n`;
                } else if (d.percentile < 99) {
                    output += `> \t\`${job[d.spec]} : ${
                        Math.floor(d.percentile * 100) / 100
                    }${parseTier[4]}\`\n`;
                } else if (d.percentile < 100) {
                    output += `> \t\`${job[d.spec]} : ${
                        Math.floor(d.percentile * 100) / 100
                    }${parseTier[5]}\`\n`;
                } else {
                    output += `> \t\`${job[d.spec]} : ${
                        Math.floor(d.percentile * 100) / 100
                    }${parseTier[6]}\`\n`;
                }
            });
        });
    } else {
        output = 'ERR : 서버명에 문제가 있습니다.';
    }
    return output;
}

async function ParseUltimateAlexander(
    serverName: string,
    charName: string,
    CheckMethod: boolean,
) {
    const output: string = `\`'${charName}'\`의 \`'절 알렉산더'\` 기록\n`;

    return output + (await RankMarker(serverName, charName, 32, CheckMethod));
}

async function ParseEdenGate(
    serverName: string,
    charName: string,
    CheckMethod: boolean,
) {
    const output: string = `\`'${charName}'\`의 \`'Eden's Gate'\` 기록\n`;
    return output + (await RankMarker(serverName, charName, 29, CheckMethod));
}

async function ParseEdenVerse(
    serverName: string,
    charName: string,
    CheckMethod: boolean,
) {
    const output: string = `\`'${charName}'\`의 \`'Eden's Verse'\` 기록\n`;
    return output + (await RankMarker(serverName, charName, 33, CheckMethod));
}
// <---------------------------------------------------------------------------->


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
    const channel = member.guild.channels.cache.find(ch => ch.name === '테스트1');
    (channel as TextChannel)?.send(`식빵 굽는 ${member.displayName} 냥이가 왔어 쿠뽀! 환영해줘 쿠뽀!`);
});

client.on('message', async msg => {
    // console.log(msg.content);
    // const ffMsg: string[] = msg.content.split(' ');
    // console.log(ffMsg[0]);
    //
    // if (ffMsg.length === 4 && ffMsg[3] === '-t') {
    //     if (ffMsg[0] === '/ffeg') {
    //         msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
    //     } else if (ffMsg[0] === '/ffua') {
    //         msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
    //     } else if (ffMsg[0] === '/ffev') {
    //         msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
    //     } else if (ffMsg[0] === '/ff') {
    //         msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
    //         msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
    //         msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
    //     }
    // } else if (ffMsg.length === 3) {
    //     if (ffMsg[0] === '/ffeg') {
    //         msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
    //     } else if (ffMsg[0] === '/ffua') {
    //         msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
    //     } else if (ffMsg[0] === '/ffev') {
    //         msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
    //     } else if (ffMsg[0] === '/ff') {
    //         msg.channel.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
    //         msg.channel.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
    //         msg.channel.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
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

