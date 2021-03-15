import {Client, VoiceConnection} from 'discord.js';
import ytdl from 'ytdl-core-discord';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';

const client = new Client();
let voiceConnection: VoiceConnection | null | undefined = null;

// 결과 값을 저장함
let musicList: YouTubeSearchResults[] = [];
let musicQue:any = [];
let musicTitleQue:any = [];

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
    // term = msg.content.replace(/^!play\s*/, '');

    try {
        const {results} = await youtubeSearch(term,opts);
        console.log(results);
        return results;
    } catch (e) {
        console.error(e);
    }

    return [];
}

client.on('ready', () => {
    console.log(`${client.user!.tag}에 로그인하였습니다!`);
    client.user?.setActivity('테스트 운용 / 야만퀘 분배', { type: 'PLAYING' })
});

client.on('message', async msg => {
    if (msg.content === '라리호' || msg.content === ';;join') {
        if(!msg.member?.voice.channel) {
            await msg.channel.send('채널에는 아무도 없는것 같다 쿠뽀!');
        } else {
            await msg.channel.send('무슨 노래를 재생해 쿠뽀?');
            voiceConnection = await msg.member?.voice.channel?.join();
        }
    }

    if(msg.content === '나가줘' || msg.content === ';;leave') {
        await msg.channel.send('이만 가볼께 쿠뽀!');
        voiceConnection?.disconnect();
    }

    // Music Search
    if (msg.content.startsWith(';;f')) {
        const term = msg.content.replace(/^;;f\s*/, '');

        const searchResults = await searchYouTube(term);
        musicList = searchResults;

        let message = '';

        searchResults.forEach((item, index) => {
            message += `${index + 1}번 ${item.title}\n`;
        })

        msg.channel.send(`검색결과가 나왔어 쿠뽀!\n${message}`);
    }

    if (msg.content.startsWith(";;p")) {
        const numberTerm = msg.content.replace(/^;;p\s*/, '');

        if(!voiceConnection) {
            msg.channel.send('채널에는 아무도 없는것 같다 쿠뽀!');
        } else if(musicQue.length == 0) {
            musicQue.push(`${musicList[numberTerm].link}`);
            musicTitleQue.push(`${musicList[numberTerm].title}`);

            // await msg.channel.send(`"${musicQue}" 노래를 재생 할께 쿠뽀!`);
            await msg.channel.send(`"${musicList[numberTerm].title}" 노래를 재생 할께 쿠뽀!`);

            voiceConnection.play(
              // await ytdl(musicList[numberTerm].link, {filter: "audioonly"}),
              await ytdl(musicQue[0], {filter: "audioonly"}),
              {
                  type: 'opus',
                  highWaterMark: 50,
                }
            );
        } else {
            musicQue.push(`${musicList[numberTerm].link}`);
            musicTitleQue.push(`${musicList[numberTerm].title}`);
            msg.channel.send(`"${musicList[numberTerm].title}" 노래를 목록에 추가 했어 쿠뽀!`);
        }
        musicList = [];
    }

    if(msg.content === ';;l') {
        console.log(musicQue);
        console.log(musicTitleQue);
        let musicListMessage = '';

        if(musicTitleQue.length == 0){
            msg.channel.send("예약되어 있는 노래가 없어 쿠뽀!");
        } else {
            musicTitleQue.forEach((item, index) => {
                musicListMessage += `${index + 1}. ${item}\n`;
            })

            msg.channel.send(`현재 예약되어 있는 노래들이야 쿠뽀!\n${musicListMessage}`);
        }
    }

    if(msg.content === ';;s') {
        const numberTerm = msg.content.replace(/^;;s\s*/, '');
        // if(voiceConnection?.dispatcher.destroy() == null) {
        //     console.log("무언가 잘못되었다.");
        // } else {
        //     voiceConnection?.dispatcher.destroy();
        // }
        voiceConnection?.dispatcher.destroy();
        musicQue.shift();
        musicTitleQue.shift();

        if(musicQue.length != 0) {
            await msg.channel.send(`"${musicTitleQue[0]}" 노래를 재생 할께 쿠뽀!`);

            voiceConnection?.play(
              // await ytdl(musicList[numberTerm].link, {filter: "audioonly"}),
              await ytdl(musicQue[0], {filter: "audioonly"}),
              {
                  type: 'opus',
                  highWaterMark: 50,
              }
            );
        } else {
            await msg.channel.send("목록에 노래가 없어 쿠뽀!");
        }

        console.log(musicQue);
    }
});

client.login('NjU1NDIwNjM0ODkyODYxNDkz.XfT2CA.qbyPl2k9u2NfFg5pD4L2_CnZQqo');

