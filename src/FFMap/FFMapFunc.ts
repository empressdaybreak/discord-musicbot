export async function findMapImage(msg) {
    if (msg.content.startsWith(";;지도")) {
        const word = msg.content.replace(/^;;지도\s*/, '').split(' ');

        if (word[0].includes('레이크')) {
            await msg.channel.send({
                files: [
                    './MapImg/RakeLand.png',
                    './MapImg/RakeLand_Parse.png',
                ]
            })
        } else if (word[0].includes('아므')) {
            await msg.channel.send({
                files: [
                    './MapImg/Armarang.png',
                    './MapImg/Armarang_Parse.png',
                ]
            })
        } else if (word[0].includes('콜루')) {
            await msg.channel.send({
                files: [
                    './MapImg/Colusia.png',
                    './MapImg/Colusia_Parse.png',
                ]
            })
        } else if (word[0].includes('라케')) {
            await msg.channel.send({
                files: [
                    './MapImg/Laketica.png',
                    './MapImg/Laketica_Parse.png',
                ]
            })
        } else if (word[0].includes('일메그')) {
            await msg.channel.send({
                files: [
                    './MapImg/Mag.png',
                    './MapImg/Mag_Parse.png',
                ]
            })
        } else if (word[0].includes('템페')) {
            await msg.channel.send({
                files: [
                    './MapImg/Tempest.png',
                    './MapImg/Tempest_Parse.png',
                ]
            })
        } else if (word[0].includes('사베네어')) {
            await msg.channel.send({
                files: [
                    './MapImg/Sabe.PNG',
                    './MapImg/Sabe_Parse.PNG',
                ]
            })
        } else if (word[0].includes('라비')) {
            await msg.channel.send({
                files: [
                    './MapImg/Lavi.PNG',
                    './MapImg/Lavi_Parse.PNG',
                ]
            })
        } else if (word[0].includes('비탄')) {
            await msg.channel.send({
                files: [
                    './MapImg/Bitan.PNG',
                    './MapImg/Bitan_Parse.PNG',
                ]
            })
        } else if (word[0].includes('갈레말')) {
            await msg.channel.send({
                files: [
                    './MapImg/Gal.PNG',
                    './MapImg/Gal_Parse.PNG',
                ]
            })
        } else if (word[0].includes('울티마')) {
            await msg.channel.send({
                files: [
                    './MapImg/Ulti.PNG',
                    './MapImg/Ulti_Parse.PNG',
                ]
            })
        } else {
            await msg.channel.send('지역 이름을 다시 확인해줘 쿠뽀!');
        }
    }
};
