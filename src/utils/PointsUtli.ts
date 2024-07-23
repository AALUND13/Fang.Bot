import { EmbedBuilder, GuildMember, HexColorString } from "discord.js";
import { getDatabaseData, writeToDatabase } from "utilities";
import client from "..";

export function getMemberPoints(member: GuildMember): number {
    return getDatabaseData(['guilds', member.guild.id, 'members', member.id, 'points']) ?? 0;
}

export function setMemberPoints(member: GuildMember, points: number) {
    writeToDatabase(['guilds', member.guild.id, 'members', member.id, 'points'], points);
    console.log(`Set ${member.displayName}'s points to ${points}`);
}

export function addMemberPoints(member: GuildMember, points: number) {
    setMemberPoints(member, getMemberPoints(member) + points);
    console.log(`Added ${points} points to ${member.displayName}'s`);
}

export function removeMemberPoints(member: GuildMember, points: number) {
    setMemberPoints(member, getMemberPoints(member) - points);
    console.log(`Removed ${points} points from ${member.displayName}'s`);
}

export function getLeaderboard(guildId: string): { [key: string]: number } {
    const membersData = getDatabaseData(['guilds', guildId, 'members']) ?? {};
    const membersArray = Object.entries(membersData).map(([key, value]) => {
        const memberData = value as { points: number };
        return {
            id: key,
            points: memberData.points
        }
    });

    membersArray.sort((a, b) => b.points - a.points);

    const leaderboard: { [key: string]: number } = {};
    for (const member of membersArray) {
        if (member.points === 0) continue;
        leaderboard[member.id] = member.points;
    }

    return leaderboard;
}

export async function leaderboardEmbed(leaderboard: { [key: string]: number }, senderID: string, color: HexColorString = "#D1E44C", count: number = 5) {
    const newLeaderboard = Object.entries(leaderboard).slice(0, count);
    let leaderboardPostion = 0;
    const embed = {
        color: parseInt(color.replace("#", ""), 16),
        title: 'Leaderboard',
        fields: await Promise.all(newLeaderboard.map(async ([key, value], index) => {
            const user = await client.users.fetch(key).catch(() => undefined);
            if (user?.id === senderID) leaderboardPostion = index + 1;
            return {
                name: `${index + 1}. ${user ? user.displayName : 'Unknown'}`,
                value: `\`\`\`\nPoints: ${value}\`\`\``
            };
        })),
        description: `Showing top ${count} members.\n${leaderboardPostion ? `Your position: **${leaderboardPostion}**.` : ''}`
    }

    return embed;
}