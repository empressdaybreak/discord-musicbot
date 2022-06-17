export async function findMapImage(msg) {
    if (msg.content.startsWith(";;지도")) {
        const word = msg.content.replace(/^;;지도\s*/, '').split(' ');
        console.log(word);
        console.log(word[0].includes('레이크'));

        if (word[0].includes('레이크')) {
            await msg.channel.send({
                files: [
                    './RakeLand.png',
                    './RakeLand_Parse.png',
                ]
            })
        } else if (word[0].includes('아므')) {
            await msg.channel.send({
                files: [
                    './Armarang.png',
                    './Armarang_Parse.png',
                ]
            })
        } else if (word[0].includes('콜루')) {
            await msg.channel.send({
                files: [
                    './Colusia.png',
                    './Colusia_Parse.png',
                ]
            })
        } else if (word[0].includes('라케')) {
            await msg.channel.send({
                files: [
                    './Laketica.png',
                    './Laketica_Parse.png',
                ]
            })
        } else if (word[0].includes('일메그')) {
            await msg.channel.send({
                files: [
                    './Mag.png',
                    './Mag_Parse.png',
                ]
            })
        } else if (word[0].includes('템페')) {
            await msg.channel.send({
                files: [
                    './Tempest.png',
                    './Tempest_Parse.png',
                ]
            })
        } else if (word[0].includes('사베네어')) {
            await msg.channel.send({
                files: [
                    './Sabe.PNG',
                    './Sabe_Parse.PNG',
                ]
            })
        } else if (word[0].includes('라비')) {
            await msg.channel.send({
                files: [
                    './Lavi.PNG',
                    './Lavi_Parse.PNG',
                ]
            })
        } else if (word[0].includes('비탄')) {
            await msg.channel.send({
                files: [
                    './Bitan.PNG',
                    './Bitan_Parse.PNG',
                ]
            })
        } else if (word[0].includes('갈레말')) {
            await msg.channel.send({
                files: [
                    './Gal.PNG',
                    './Gal_Parse.PNG',
                ]
            })
        } else if (word[0].includes('울티마')) {
            await msg.channel.send({
                files: [
                    './Ulti.PNG',
                    './Ulti_Parse.PNG',
                ]
            })
        } else {
            await msg.channel.send('지역 이름을 다시 확인해줘 쿠뽀!');
        }
    }
};
