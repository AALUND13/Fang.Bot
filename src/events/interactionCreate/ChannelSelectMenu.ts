import { Interaction, PermissionFlagsBits } from "discord.js";
import { writeToDatabase } from "utilities";

export default async (interaction: Interaction) => {
    if (!interaction.isChannelSelectMenu()) return;
    console.log('ChannelSelectMenu event executed.');

    switch (interaction.customId) {
        case 'videoAnnouncementChannel':
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }

            const channelId = interaction.values[0];
            const fetchReply = interaction.message
            const replyMessageEmbed = fetchReply.embeds[0];
            
            const editedEmbed = {
                title: replyMessageEmbed.title || '',
                color: replyMessageEmbed.color || parseInt('D1E44C', 16),
                description: `${replyMessageEmbed.description}\nChannel <#${channelId}> will now be used for video announcements.`
            }

            writeToDatabase(['guilds', interaction.guildId!, 'data', 'youtubeChannelAnnouncementChannel'], channelId);

            await interaction.update({ embeds: [editedEmbed], components: [] })
            await interaction.followUp({ content: `You selected the channel: <#${channelId}>, Video announcement channel setup completed.`, ephemeral: true });
            break;
    }
}