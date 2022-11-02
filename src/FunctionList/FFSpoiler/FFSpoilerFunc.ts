import {TextChannel} from "discord.js";

export const autoSpoiler = async (msg, client) => {
    if (msg.channel.id === "820875943769669653") {
        if (msg.author.id != "655420634892861493") {
            const spoilerChannel = client.channels.cache.find(ch => ch.id === "820875943769669653");

            msg.fetch(msg.author?.lastMessageID).then(message => message.delete());

            if (msg.member.nickname == null) {
                await (spoilerChannel as TextChannel).send("||" + "**" + msg.author.username + "**" + "```" + msg.author.lastMessage.content + "```" + "||");
            } else {
                await (spoilerChannel as TextChannel).send("||" + "**" + msg.member.nickname + "**" + "```" + msg.author.lastMessage.content + "```" + "||");
            }
        }
    }
}

// TODO: 나중에 채널 아이디 변경해야함
