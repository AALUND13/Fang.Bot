import { ActionRowBuilder, BaseSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelSelectMenuComponent, ChannelType, EmbedBuilder, Interaction } from "discord.js";
import { isValidHexColor } from "../../utils/ColorUtli";
import { getDatabaseData, writeToDatabase } from "utilities";
import { clamp } from "../../utils/MathUtli";
import { YouTubeChannelData, YoutubeDataStatus } from "../../Handler/YouTubeDataHandler";

export default async (interaction: Interaction) => {
    if (!interaction.isModalSubmit()) return;
    console.log('Modal submit event executed.');

    switch (interaction.customId) {
        case 'youtubeSetup':
            const youtubeChannelId = interaction.fields.getField('youtubeChannelId').value;
            const youtubeAnnouncementMessage = interaction.fields.getField('youtubeAnnouncementMessage').value;

            // Check if  the YouTubr channel ID is exists
            const channelData = new YouTubeChannelData(process.env.YOUTUBE_API_KEY!, youtubeChannelId);
            const channelStatus = await channelData.fetchData();
            if (channelStatus === YoutubeDataStatus.ERROR) {
                await interaction.reply({ content: 'Invalid Youtube channel ID.', ephemeral: true });
                return;
            }

            
            const channelSelect = new ChannelSelectMenuBuilder()
                .setCustomId('videoAnnouncementChannel')
                .setPlaceholder('Select a video announcement channel')
                .setMaxValues(1)
                .addChannelTypes(ChannelType.GuildText)
                
            const channelActionRow = new ActionRowBuilder<ChannelSelectMenuBuilder>().addComponents(channelSelect);
            
            const embed = new EmbedBuilder()
                .setTitle('Youtube Channel Tracking Setup')
                .setDescription(`Add a channel to track: **${channelData.ChannelName}**.`)
                .setColor(getDatabaseData(['guilds', interaction.guildId!, 'data', 'embedColor']) ?? '#D1E44C');
            
            writeToDatabase(['guilds', interaction.guildId!, 'data', 'youtubeChannelId'], youtubeChannelId);
            writeToDatabase(['guilds', interaction.guildId!, 'data', 'youtubeChannelAnnouncementText'], youtubeAnnouncementMessage);

            await interaction.reply({ embeds: [embed], components: [channelActionRow], fetchReply: true });

            console.log(`Bot YouTubr tracker setup for guild ${interaction.guildId} completed.`);
            break
        case 'botSetup':
            const pointsCooldown = parseInt(interaction.fields.getField('pointsCooldown').value);
            const pointsMultiplier = parseInt(interaction.fields.getField('pointsMultiplier').value);

            const pointsFromWordle = parseInt(interaction.fields.getField('pointsFromWordle').value);
            const wordleCooldown = parseInt(interaction.fields.getField('wordleCooldown').value);

            const serverEmbedColor = interaction.fields.getField('serverEmbedColor').value;

            if (isNaN(pointsCooldown) || isNaN(pointsMultiplier) || isNaN(pointsFromWordle) || isNaN(wordleCooldown)) {
                await interaction.reply({ content: 'Invalid input.', ephemeral: true });
                return;
            }else if (!isValidHexColor(serverEmbedColor)) {
                await interaction.reply({ content: 'Invalid color.', ephemeral: true, fetchReply: true });
                return;
            }
           
            writeToDatabase(['guilds', interaction.guildId!, 'data', 'points', 'pointsCooldown'], clamp(pointsCooldown, 0, 500));
            writeToDatabase(['guilds', interaction.guildId!, 'data', 'points', 'pointsMultiplier'], clamp(pointsMultiplier, 0, 50));

            writeToDatabase(['guilds', interaction.guildId!, 'data', 'points', 'pointsFromWordle'], clamp(pointsFromWordle, 0, 1000));
            writeToDatabase(['guilds', interaction.guildId!, 'data', 'points', 'wordleCooldown'], clamp(pointsFromWordle, 1, 24));
            
            writeToDatabase(['guilds', interaction.guildId!, 'data', 'embedColor'], serverEmbedColor);

            await interaction.reply({ content: 'Setup complete.', ephemeral: true });

            console.log(`Bot setup for guild ${interaction.guildId} completed.`);
            break;
    }
}
