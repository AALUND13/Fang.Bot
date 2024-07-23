import { SlashCommandProps } from "commandkit";
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { getServerStatus } from "../../Interfaces";
import { url } from "inspector";
import { getDatabaseData } from "utilities";

export const data = new SlashCommandBuilder()
    .setName('server')
    .setDescription('Servers commands.')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('status')
            .setDescription('Get the server status.')
    )

export async function run({ interaction, client, handler }: SlashCommandProps) {
    const subsubcommand = interaction.options.getSubcommand(false);

    switch (subsubcommand) {
        case 'status':
            console.log(`Get server status command executed. Command run by "${interaction.user.displayName}"`);

            if (!interaction.guildId) {
                interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }
            const guildDataServer = getDatabaseData(['guilds', interaction.guildId, 'data', 'server']);
            if (guildDataServer === undefined) {
                interaction.reply({ content: 'Server data is not set up.', ephemeral: true });
                return;
            }

            const serverStatus = await getServerStatus(interaction.guildId);
            if(!serverStatus) {
                interaction.reply({ content: 'Falled to get server status.', ephemeral: true });
                return;
            }

            const embed = new EmbedBuilder()
            .setTitle(`Server Status`)

            .setDescription(`${serverStatus.ServerName} is **${serverStatus.IsRunning ? 'Online' : 'Offline'}**. \n**${serverStatus.Players.length}/${serverStatus.MaxPlayers}** players online.\n\n${serverStatus.ServerPublicIP !== '0.0.0.0' ? `Server Ip: **steam://connect/${serverStatus.ServerPublicIP}:${serverStatus.Port}**\n` : ''}Sim Speed: **${serverStatus.SimulationSpeed}** | Uptime: **${serverStatus.Uptime}**`)
            .setColor(serverStatus.IsRunning ? '#D6F04A' : '#A01516')
            .addFields(
                { name: 'Players', value: serverStatus.Players.length ? `\`\`\`\n${serverStatus.Players.join('\n')}\`\`\`` : '```\nNone```', inline: true },
                { name: 'Mods', value: serverStatus.ModList.length ? `\`\`\`\n${serverStatus.ModList.map(mod => mod.ModName).join('\n')}\`\`\`` : '```\nNone```', inline: true }
            );
        
        
            interaction.reply({ embeds: [embed], ephemeral: true });
            break;
    }
}
 
export const options = { }