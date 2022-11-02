import {
    ParseAsphodelos,
    ParseEdenGate,
    ParseEdenPromise,
    ParseEdenVerse,
    ParseUltimateAlexander
} from "./FFLogsFunc";
import {MessageEmbed} from "discord.js";

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

export const logsLoad = async (msg) => {
    const ffMsg: string[] = msg.content.split(' ');

    if (ffMsg.length === 4 && ffMsg[3] === '-t') {
        if (ffMsg[0] === ';;로그') {
            await msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], false));
            await msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], false));
            await msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], false));
            await msg.author.send(await ParseEdenPromise(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseAsphodelos(ffMsg[1], ffMsg[2], true));
            await msg.author.send(AlertText);
        }
    } else if (ffMsg.length === 3) {
        if (ffMsg[0] === ';;로그') {
            await msg.author.send(await ParseEdenGate(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseEdenVerse(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseUltimateAlexander(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseEdenPromise(ffMsg[1], ffMsg[2], true));
            await msg.author.send(await ParseAsphodelos(ffMsg[1], ffMsg[2], true));
            await msg.author.send(AlertText);
        }
    }
}
