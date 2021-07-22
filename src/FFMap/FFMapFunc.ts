export async function findMapImage(msg) {
    if (msg.content.startsWith(";;지도")) {
        const word = msg.content.replace(/^;;지도\s*/, '').split(' ');

        if (word[0] === '레이크랜드') {
            await msg.channel.send({
                files: [
                    './RakeLand.png',
                    './RakeLand_Parse.png',
                ]
            })
        } else if (word[0] === '아므아랭') {
            await msg.channel.send({
                files: [
                    './Armarang.png',
                    './Armarang_Parse.png',
                ]
            })
        } else if (word[0] === '콜루시아') {
            await msg.channel.send({
                files: [
                    './Colusia.png',
                    './Colusia_Parse.png',
                ]
            })
        } else if (word[0] === '라케티카') {
            await msg.channel.send({
                files: [
                    './Laketica.png',
                    './Laketica_Parse.png',
                ]
            })
        } else if (word[0] === '일메그') {
            await msg.channel.send({
                files: [
                    './Mag.png',
                    './Mag_Parse.png',
                ]
            })
        } else if (word[0] === '템페스트') {
            await msg.channel.send({
                files: [
                    './Tempest.png',
                    './Tempest_Parse.png',
                ]
            })
        } else {
            await msg.channel.send('지역 이름을 다시 확인해줘 쿠뽀!');
        }
    }
};
