let RandomResult: string[] = [];

export const randomParty = async (msg) => {
    if (msg.content.startsWith(';;파티')) {
        const word = msg.content.replace(/^;;파티\s*/, '').split(' ');
        const number = Number(word[0]) + 1;
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
            await msg.channel.send(';;파티 (인원수) 이름1 이름2 이런식으로 적어 줘~ 쿠뽀!');
        }
        RandomResult = [];
    }
}

// TODO: 현재 한파티만 나오고 나머지 인원들이 파티로 안나오고 있음 추후에 변경을 해야 할 것으로 보임
