import { GuildMember, Message } from "discord.js";
import { addMemberPoints } from "../../utils/PointsUtli";
import { getDatabaseData, writeToDatabase } from "utilities";

export default async (message: Message) => {
    if (message.author.bot || !message.guild || !message.member) return;
    const pointsData = getDatabaseData(['guilds', message.guild.id, 'data', 'points']) ?? {};
    const memeberData = getDatabaseData(['guilds', message.guild.id, 'members', message.member.id]) ?? {};

    const pointsCooldown = pointsData.pointsCooldown ?? 15;
    const memeberPointsCooldown = memeberData.pointsCooldown ?? 0;
    if (memeberPointsCooldown > Date.now()) return;

    const newCooldown = Date.now() + (pointsCooldown * 1000);
    writeToDatabase(['guilds', message.guild.id, 'members', message.member.id, 'pointsCooldown'], newCooldown);

    const points = pointsData.pointsMultiplier ? Math.floor(Math.random() * pointsData.pointsMultiplier) + 1 : 0;
    addMemberPoints(message.member, points);
}
