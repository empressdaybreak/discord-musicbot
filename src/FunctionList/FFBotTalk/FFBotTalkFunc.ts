// 업데이트 쿠뽀 레터 발행용 코드 (음악방 채널 764505214953979935 / 지도 채널 854251926316515358)
import {MessageEmbed, TextChannel} from "discord.js";

// 디스코드 봇 업데이트 문구 출력
const UpdateText = new MessageEmbed()
    .setColor('#0099ff')
    .setTitle('쿠뽀 레터 📩')
    .setDescription('"쿠뽀 레터" 를 발행하러 왔어~ 쿠뽀!\n \n' +
        '효월을 위한 14등급 지도가 추가되었어 쿠뽀~\n \n' +
        ';;지도 [지역] 으로 입력하면 해당 지도 이미지가 나올꺼야 쿠뽀~\n \n' +
        '지역에 관련된 부분은 보고 있는 채널 위에 "#보물지도" 옆에 부분을 클릭하면 자세히 볼 수 있어 쿠뽀!\n \n' +
        '언제든 불편한 점이 있다면 부담없이 말해줘 쿠뽀!'
    );


export const updateNotice = async (msg, client) => {
    if (msg.content === '!!update') {
        const channel_update = client.channels.cache.find(ch => ch.id === '854251926316515358');
        await (channel_update as TextChannel).send(UpdateText);
    }
}

// 츄르봇으로 음악방 채널에 직접 말할 수 있는 임시 코드
export const musicChannelNotice = async (msg, client) => {
    if (msg.content.startsWith("!!music")) {
        const word = msg.content.replace(/^!!music\s*/, '');
        const channel_notice = client.channels.cache.find(ch => ch.id === '764505214953979935');
        console.log(word);

        await (channel_notice as TextChannel).send(word);
    }
}

// 츄르봇으로 자유채팅 채널에 직접 말할 수 있는 임시 코드
export const freeChannelNotice = async (msg, client) => {
    if (msg.content.startsWith("!!free")) {
        const word = msg.content.replace(/^!!free\s*/, '');
        const channel_notice = client.channels.cache.find(ch => ch.id === '764503355899904012');

        await (channel_notice as TextChannel).send(word);
    }
}
