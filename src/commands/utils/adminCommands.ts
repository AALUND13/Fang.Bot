import { SlashCommandProps } from "commandkit";
import { GuildMember, SlashCommandBuilder } from "discord.js";
import { addMemberPoints, getMemberPoints, setMemberPoints } from "../../utils/PointsUtli";
import { getDatabaseData } from "utilities";
import axios, { AxiosError } from "axios";
import { demotePlayer, getStringPromoteLevel, PlayerRankChange, promotePlayer, RankChangeType } from "../../Interfaces";

export const data = new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Commands that only available for admins.')
    .addSubcommandGroup((subCommandGroup) => 
    subCommandGroup
        .setName('points')
        .setDescription('Manage points.')
        .addSubcommand((subcommand) =>
        subcommand
            .setName('set')
            .setDescription('Set points of a member.')
            .addIntegerOption((option) =>
            option
                .setName('points')
                .setDescription('The points to set.')
                .setRequired(true)
            )
            .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('The member to set the points of.')
            )
        )
        .addSubcommand((subcommand) =>
        subcommand
            .setName('add')
            .setDescription('Add points to a member.')
            .addIntegerOption((option) =>
            option
                .setName('points')
                .setDescription('The points to add.')
                .setRequired(true)
            )
            .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('The member to add the points to.')
            )
        )
        .addSubcommand((subcommand) =>
        subcommand
            .setName('remove')
            .setDescription('Remove points from a member.')
            .addIntegerOption((option) =>
            option
                .setName('points')
                .setDescription('The points to remove.')
                .setRequired(true)
            )
            .addUserOption((option) =>
            option
                .setName('member')
                .setDescription('The member to remove the points from.')
            )
        )
    )
    // .addSubcommandGroup((subCommandGroup) =>
    //     subCommandGroup
    //         .setName('server')
    //         .setDescription('Admin commands for the server.')
    //         .addSubcommand((subcommand) =>
    //             subcommand
    //                 .setName('start')
    //                 .setDescription('Start the server.')
    //         )
    //         .addSubcommand((subcommand) =>
    //             subcommand
    //                 .setName('stop')
    //                 .setDescription('Stop the server.')
    //         )
    //         .addSubcommand((subcommand) =>
    //             subcommand
    //                 .setName('restart')
    //                 .setDescription('Restart the server.')
    //         )
    //         .addSubcommand((subcommand) =>
    //             subcommand
    //                 .setName('promote-player')
    //                 .setDescription('Promote a player.')
    //                 .addStringOption((option) =>
    //                     option
    //                         .setName('player')
    //                         .setDescription('The player to promote.')
    //                         .setRequired(true)
    //                 )
    //         )
    //         .addSubcommand((subcommand) =>
    //             subcommand
    //                 .setName('demote-player')
    //                 .setDescription('Demote a player.')
    //                 .addStringOption((option) =>
    //                     option
    //                         .setName('player')
    //                         .setDescription('The player to promote.')
    //                         .setRequired(true)
    //                 )
    //         )
    //     )

export async function run({ interaction, client, handler }: SlashCommandProps) {
    const subCommandGroup = interaction.options.getSubcommandGroup(false);
    const subsubcommand = interaction.options.getSubcommand(false);

    switch (subCommandGroup) {
        // case 'server':
        //     if (!interaction.guildId) {
        //         interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
        //         return;
        //     } else if (getDatabaseData(['guilds', interaction.guildId, 'data', 'server']) === undefined) {
        //         interaction.reply({ content: 'Server data is not set up.', ephemeral: true });
        //         return;
        //     }
        //     const guildDataServer = getDatabaseData(['guilds', interaction.guildId, 'data', 'server']);

        //     switch (subsubcommand) {

        //         case 'start':
        //             axios.get(`http://${guildDataServer.serverIPAndPort}/api/v1/server/start?APIKey=${guildDataServer.APIKey}`)
        //             .then(() => {
        //                 interaction.reply({ content: 'Server is starting...', ephemeral: true });
        //             })
        //             .catch((error: AxiosError) => {
        //                 interaction.reply({ content: error.response?.data as string ?? 'Failed to start the server.', ephemeral: true });
        //             });                
        //             break;
        //         case 'stop':
        //             axios.get(`http://${guildDataServer.serverIPAndPort}/api/v1/server/stop?APIKey=${guildDataServer.APIKey}`)
        //             .then(() => {
        //                 interaction.reply({ content: 'Server is shutting down...', ephemeral: true });
        //             })
        //             .catch((error: AxiosError) => {
        //                 interaction.reply({ content: error.response?.data as string ?? 'Failed to stop the server.', ephemeral: true });
        //             });     
        //             break;
        //         case 'restart':
        //             axios.get(`http://${guildDataServer.serverIPAndPort}/api/v1/server/restart?APIKey=${guildDataServer.APIKey}&Delay=10`)
        //             .then(() => {
        //                 interaction.reply({ content: 'Server is restarting...', ephemeral: true });
        //             })
        //             .catch((error: AxiosError) => {
        //                 interaction.reply({ content: error.response?.data as string ?? 'Failed to restart the server.', ephemeral: true });
        //             });
        //             break;
        //         case 'promote-player':
        //             const playerRankChangePromote = await promotePlayer(interaction.guildId, interaction.options.getString('player')!);
        //             if (!playerRankChangePromote) {
        //                 interaction.reply({ content: 'Failed to promote the player.', ephemeral: true });
        //                 return;
        //             } else if (playerRankChangePromote.ChangeType === RankChangeType.SameRank) {
        //                 interaction.reply({ content: `Player **${playerRankChangePromote?.PlayerName}** is already at the highest rank.`, ephemeral: true });
        //                 return;
        //             }

        //             interaction.reply({ content: `Player **${playerRankChangePromote.PlayerName}** has been promoted from **${getStringPromoteLevel(playerRankChangePromote.OldRank)}** to **${getStringPromoteLevel(playerRankChangePromote.NewRank)}**`, ephemeral: true });
        //             break;
        //         case 'demote-player':
        //             const playerRankChangeDemote = await demotePlayer(interaction.guildId, interaction.options.getString('player')!);
        //             if (!playerRankChangeDemote) {
        //                 interaction.reply({ content: 'Failed to demote the player.', ephemeral: true });
        //                 return;
        //             } else if (playerRankChangeDemote.ChangeType === RankChangeType.SameRank) {
        //                 interaction.reply({ content: `Player **${playerRankChangeDemote?.PlayerName}** is already at the lowest rank.`, ephemeral: true });
        //                 return;
        //             }
                    
        //             interaction.reply({ content: `Player **${playerRankChangeDemote.PlayerName}** has been demoted from **${getStringPromoteLevel(playerRankChangeDemote.OldRank)}** to **${getStringPromoteLevel(playerRankChangeDemote.NewRank)}**`, ephemeral: true });
        //             break;
        //     }
        //     break;
        case 'points':
            if (!interaction.guildId) {
                interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }

            const member = (interaction.options.getMember('member') ?? interaction.member) as GuildMember;
            if (!interaction.guildId) {
                interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }
            if (member.user.bot) {
                interaction.reply({ content: 'Bots do not have points.', ephemeral: true });
                break;
            }

            switch (subsubcommand) {
                case 'set':
                    interaction.reply({ content: `Points of ${member.displayName} went from **${getMemberPoints(member)}** to **${interaction.options.getInteger('points')}**`, ephemeral: true });
                    setMemberPoints(member, interaction.options.getInteger('points')!);
                    break;
                case 'add':
                    interaction.reply({ content: `Points of ${member.displayName} went from **${getMemberPoints(member)}** to **${getMemberPoints(member) + interaction.options.getInteger('points')!}**`, ephemeral: true });
                    addMemberPoints(member, interaction.options.getInteger('points')!);
                    break;
                case 'remove':
                    interaction.reply({ content: `Points of ${member.displayName} went from **${getMemberPoints(member)}** to **${Math.max(0, getMemberPoints(member) - interaction.options.getInteger('points')!)}**`, ephemeral: true });
                    setMemberPoints(member, Math.max(0, getMemberPoints(member) - interaction.options.getInteger('points')!));
                    break;
            }
            break;
    }
}

export const options = { 
    Permissions: ['Administrator']
}
