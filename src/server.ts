import {Client, VoiceConnection} from 'discord.js';
import ytdl from 'ytdl-core-discord';
import youtubeSearch, { YouTubeSearchResults } from 'youtube-search';

const client = new Client();
let voiceConnection: VoiceConnection | null | undefined = null;

// 결과 값을 저장함
let musicList: YouTubeSearchResults[] = [];

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
});

client.on('message', async msg => {
    if (msg.content === '들어와') {
        if(!msg.member?.voice.channel) {
            await msg.channel.send('채널에는 아무도 없는것 같아요!');
        } else {
            await msg.channel.send('무슨 노래를 재생할까요?');
            voiceConnection = await msg.member?.voice.channel?.join();
        }
    }

    if(msg.content === '나가줘') {
        await msg.channel.send('나가볼께요');
        voiceConnection?.disconnect();
    }

    if (msg.content.startsWith('!찾기')) {
        // !조건만남검색 미시녀가 춤추는 영상
        // -> '미시녀가 춤추는 영상'
        // msg.content.split(" "); // ['!조건만남검색', '미시녀가', '춤추는', '영상']
        // 0번 빼고 조인으로 합치는 방법이 있고
        const term = msg.content.replace(/^!찾기\s*/, '');

        console.log(msg.content);
        console.log(term);

        const searchResults = await searchYouTube(term);
        musicList = searchResults;

        let message = '';

        searchResults.forEach((item, index) => {
            message += `${index + 1}번 ${item.title}\n`;
        })

        msg.channel.send(message);
    }

    if (msg.content.startsWith("!play")) {
        const numberTerm = msg.content.replace(/^!play\s*/, '');

        console.log(msg.content);
        console.log(numberTerm);

        if(!voiceConnection) {
            msg.channel.send('채널에 사람이 없어요!');
        } else {
            await msg.channel.send(`${musicList[numberTerm].title} 노래를 재생합니다.`);

            voiceConnection.play(
              // await ytdl('https://www.youtube.com/watch?v=D00hlkW0u3U', { filter: "audioonly" }),
              await ytdl(musicList[numberTerm].link, {filter: "audioonly"}),
              {
                  type: 'opus',
                  highWaterMark: 50,
              }
            );
        }

        musicList = [];
    }
});

client.login('NjU1NDIwNjM0ODkyODYxNDkz.XfT2CA.qbyPl2k9u2NfFg5pD4L2_CnZQqo');

