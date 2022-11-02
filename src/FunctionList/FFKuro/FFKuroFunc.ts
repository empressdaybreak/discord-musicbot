const kuroListArr = [
    { name: '가루다', local: 'sin' },
    { name: '타이탄', local: 'sin' },
    { name: '이프리트', local: 'sin' },
    { name: '모그', local: 'sin' },
    { name: '리바', local: 'sin' },
    { name: '라무', local: 'sin' },
    { name: '시바', local: 'sin' },
    { name: '오딘', local: 'sin' },
    { name: '알테마', local: 'sin' },

    { name: '비스마르크', local: 'chang' },
    { name: '라바나', local: 'chang' },
    { name: '나오라', local: 'chang' },
    { name: '세피', local: 'chang' },
    { name: '니드호그', local: 'chang' },
    { name: '소피아', local: 'chang' },
    { name: '주르반', local: 'chang' },

    { name: '스사노오', local: 'hong' },
    { name: '락슈미', local: 'hong' },
    { name: '신룡', local: 'hong' },
    { name: '백호', local: 'hong' },
    { name: '츠쿠', local: 'hong' },
    { name: '리오레우스', local: 'hong' },
    { name: '주작', local: 'hong' },
    { name: '청룡', local: 'hong' },

    { name: '티타니아', local: 'dark' },
    { name: '이노센스', local: 'dark' },
    { name: '하데스', local: 'dark' },
    { name: '루비', local: 'dark' },
    { name: '에메랄드', local: 'dark' },
    { name: '다이아', local: 'dark' },
    { name: '빛전', local: 'dark' },
];

// 쿠로 만들기용 배열
let kuroArr: any = [];

let sinArr: string[] = [];
let changArr: string[] = [];
let hongArr: string[] = [];
let darkArr: string[] = [];

export const autoKuro = async (msg) => {
    if (msg.content.startsWith(';;쿠로')) {
        const words = msg.content.replace(/^;;쿠로\s*/, '').split(' ');

        for(let i=0; i<=words.length; i++) {
            const result = kuroListArr.filter(word => word.name.includes(words[i]));
            kuroArr.push(...result);
        }

        const filterSin = kuroArr.filter(word => word.local === "sin");
        const filterChang = kuroArr.filter(word => word.local === "chang");
        const filterHong = kuroArr.filter(word => word.local === "hong");
        const filterDark = kuroArr.filter(word => word.local === "dark");

        const Sin = Array.from(new Set(filterSin));
        const Chang = Array.from(new Set(filterChang));
        const Hong = Array.from(new Set(filterHong));
        const Dark = Array.from(new Set(filterDark));

        Sin.map((data: any) => (
            sinArr.push(data.name)
        ));

        Chang.map((data: any) => (
            changArr.push(data.name)
        ));

        Hong.map((data: any) => (
            hongArr.push(data.name)
        ));

        Dark.map((data: any) => {
            darkArr.push(data.name)
        });

        if (sinArr.length != 0) {
            let initSinArr = Array.from(new Set(sinArr));
            await msg.channel.send('신생: ' + initSinArr);
            initSinArr = [];
        }

        if (changArr.length != 0) {
            let initChangArr = Array.from(new Set(changArr))
            await msg.channel.send('창천: ' + initChangArr);
            initChangArr = [];
        }

        if (hongArr.length != 0) {
            let initHongArr = Array.from(new Set(hongArr))
            await msg.channel.send('홍련: ' + initHongArr);
            initHongArr = [];
        }

        if (darkArr.length != 0) {
            let initDarkArr = Array.from(new Set(darkArr));
            await msg.channel.send('칠흑: ' + initDarkArr);
            initDarkArr = [];
        }

        await msg.channel.send('쿠로 목록이야 쿠뽀~');

        kuroArr = [];
        sinArr = [];
        changArr = [];
        hongArr = [];
        darkArr = [];
    }
}
