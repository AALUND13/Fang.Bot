import { GuildMember, Message } from "discord.js";
import { addMemberPoints } from "../../utils/PointsUtli";
import { getDatabaseData, writeToDatabase } from "utilities";
import axios from "axios";

export default async (message: Message) => {
    if (message.author.bot || !message.guild || !message.member) return;

    const guildDataServer = getDatabaseData(['guilds', message.guild.id, 'data', 'server']);
    const trackingChannelID = guildDataServer?.trackingChannelID;
    const serverIPAndPort = guildDataServer?.serverIPAndPort;
    const APIKey = guildDataServer?.APIKey;

    if (trackingChannelID !== message.channel.id || !serverIPAndPort || !APIKey || !message.content) return;

    try {
        await axios.get(`http://${serverIPAndPort}/api/v1/server/message/send?APIKey=${APIKey}&message=${message.content}&Sender=[Discord] ${message.author.displayName}`);
    } catch (error) {
        console.error(error);
    }
}
