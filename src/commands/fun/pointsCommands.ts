import { SlashCommandProps } from "commandkit";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { getLeaderboard, getMemberPoints, leaderboardEmbed } from "../../utils/PointsUtli";
import { getDatabaseData } from "utilities";
import { isValidHexColor } from "../../utils/ColorUtli";

export const data = new SlashCommandBuilder()
    .setName('points')
    .setDescription('Points commands.')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('get')
            .setDescription('Get points of a member.')
            .addUserOption((option) =>
                option
                    .setName('member')
                    .setDescription('The member to get the points of.')
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('leaderboard')
            .setDescription('Get the points leaderboard.')
            .addNumberOption((option) =>
                option
                    .setName('count')
                    .setDescription('The number of members to show in the leaderboard. (Max 10, default 5)')
            )
        )
    
export async function run({ interaction, client, handler }: SlashCommandProps) {
    const subsubcommand = interaction.options.getSubcommand(false);
    const member = (interaction.options.getMember('member') ?? interaction.member) as GuildMember;

    
    if (!interaction.guildId) {
        interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        return;
    }
    else if(member.user.bot) {
        interaction.reply({ content: 'Bots do not have points.', ephemeral: true });
        return;
    }

    switch (subsubcommand) {
        case 'get':
            console.log(`Points get command executed. Command run by "${interaction.user.displayName}"`);

            interaction.reply({ content: `Points of **${member.displayName}**: **${getMemberPoints(member)}**`, ephemeral: true });
            break;
        case 'leaderboard':
            console.log(`Points leaderboard command executed. Command run by "${interaction.user.displayName}"`);

            const count = Math.max(1, Math.min(10, interaction.options.getNumber('count') ?? 5));
            const serverEmbedColor = getDatabaseData(['guilds', interaction.guildId, 'data', 'embedColor']) ?? '#D1E44C';

            const leaderboard = getLeaderboard(interaction.guildId);
            const embed = await leaderboardEmbed(leaderboard, interaction.user.id, serverEmbedColor, count) as any;
            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
    }
}

export const options = { }
