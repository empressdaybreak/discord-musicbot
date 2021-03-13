import {Client, VoiceConnection} from 'discord.js';
import ytdl from 'ytdl-core-discord';

const client = new Client();
let voiceConnection: VoiceConnection | null | undefined = null;


client.on('ready',      () => {
    console.log(`${client.user!.tag}에 로그인하였습니다!`);
});

client.on('message', async msg => {
    if (msg.content === '들어와') {
        await msg.reply('죄송합니다,,, 흑흑,,,');
        voiceConnection = await msg.member?.voice.channel?.join();
    }

    if(msg.content === '나가줘') {
        await msg.reply('나가볼께요');
        voiceConnection?.disconnect();
    }

    if (voiceConnection && msg.content.startsWith("!play")) {
        await msg.reply('네? 섹스요????');
        voiceConnection.play(
            await ytdl('https://www.youtube.com/watch?v=D00hlkW0u3U', { filter: "audioonly" }),
            {
                type: 'opus',
                highWaterMark: 50,
            }
        );
    }
    if (msg.content === '핑') {
        msg.reply('퐁!');
    }
});

client.login('NjU1NDIwNjM0ODkyODYxNDkz.XfT2CA.qbyPl2k9u2NfFg5pD4L2_CnZQqo');

