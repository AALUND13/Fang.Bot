import { ActionRowBuilder, ModalActionRowComponentBuilder } from "@discordjs/builders";
import { SlashCommandProps } from "commandkit";
import { ModalBuilder, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
/**
 * Bot Utility Setup
 * 
 * Points Cooldown (Default: 15)
 * Points Multiplier (Default: 10)
 * 
 * Points From Wordle (Default: 0)
 * Wordle Cooldown (Default: 12 hours)
 * 
 * Server Embed Color (Default: #D1E44C)
 */

/**
 * Bot Youtube Setup
 * 
 * Youtube Channel ID
 * Youtube Announcement Channel
 * Youtube Announcement Message (Default: "New video from **[{channelName}]({channelLink})**!")
 */

export const data = new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Setup commands.')
    .addSubcommand((subcommand) =>
        subcommand
            .setName('bot')
            .setDescription('Setup bot.')
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('youtube')
            .setDescription('Setup youtube tracking.')
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName('server')
            .setDescription('Setup server connection with the bot.')
    )

export async function run({ interaction, client, handler }: SlashCommandProps) {
    const subsubcommand = interaction.options.getSubcommand(false);

    switch (subsubcommand) {
        case 'server':
            console.log(client.user?.avatarURL({ extension: 'png' }))
            if (!interaction.guildId) {
                interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }

            const serverSetupModal = new ModalBuilder()
                .setCustomId('serverSetup')
                .setTitle('Server Setup');

            const serverIpInput = new TextInputBuilder()
                .setCustomId('serverIp')
                .setLabel('Server IP:Port')
                .setPlaceholder('Server IP:Port')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const serverAPIKeyInput = new TextInputBuilder()
                .setCustomId('APIKey')
                .setLabel('Server API Key')
                .setPlaceholder('Server API Key')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const serverIpInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(serverIpInput);
            const serverAPIKeyInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(serverAPIKeyInput);

            serverSetupModal.addComponents(serverIpInputActionRow, serverAPIKeyInputActionRow);

            await interaction.showModal(serverSetupModal);

            console.log(`Server setup modal for guild ${interaction.guildId} opened. Command run by "${interaction.user.displayName}"`);
            break;
        case 'youtube':
            if (!interaction.guildId) {
                interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }

            const youtubeSetupModal = new ModalBuilder()
                .setCustomId('youtubeSetup')
                .setTitle('Youtube Channel Tracking Setup')

            const youtubeChannelIdInput = new TextInputBuilder()
                .setCustomId('youtubeChannelId')
                .setLabel('Youtube Channel ID')
                .setPlaceholder('Youtube channel ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const youtubeAnnouncementMessageInput = new TextInputBuilder()
                .setCustomId('youtubeAnnouncementMessage')
                .setLabel('Youtube Announcement Message')
                .setPlaceholder('Youtube announcement message')
                .setValue('New video from **[{channelName}]({channelLink})**!')
                .setStyle(TextInputStyle.Paragraph)
                .setMaxLength(150)
                .setRequired(true);

            const youtubeChannelIdInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(youtubeChannelIdInput);
            const youtubeAnnouncementMessageInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(youtubeAnnouncementMessageInput);

            youtubeSetupModal.addComponents(youtubeChannelIdInputActionRow, youtubeAnnouncementMessageInputActionRow);

            await interaction.showModal(youtubeSetupModal);

            console.log(`Youtube setup modal for guild ${interaction.guildId} opened. Command run by "${interaction.user.displayName}"`);

            break;
        case 'bot':
            if (!interaction.guildId) {
                interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
                return;
            }

            console.log(`Bot setup modal for guild ${interaction.guildId} opened. Command run by "${interaction.user.displayName}"`);

            const botSetupModal = new ModalBuilder()
                .setCustomId('botSetup')
                .setTitle('Bot Setup')

            // Modal input fields
            const pointsCooldownInput = new TextInputBuilder()
                .setCustomId('pointsCooldown')
                .setLabel('Points CD for Chatting (Seconds) (Max: 500)')
                .setPlaceholder('Points cooldown for chatting')
                .setValue('15')
                .setMaxLength(3)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const pointsMultiplierInput = new TextInputBuilder()
                .setCustomId('pointsMultiplier')
                .setLabel('Points Multiplier for Chatting (Max: 50)')
                .setPlaceholder('Points multiplier for chatting')
                .setValue('10')
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const pointsFromWordleInput = new TextInputBuilder()
                .setCustomId('pointsFromWordle')
                .setLabel('Points From Wordle (Max: 1000)')
                .setPlaceholder('Points from playing wordle')
                .setValue('0')
                .setMaxLength(4)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const wordleCooldownInput = new TextInputBuilder()
                .setCustomId('wordleCooldown')
                .setLabel('Wordle CD (Hours) (Max: 24)')
                .setPlaceholder('Wordle cooldown')
                .setValue('12')
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const serverEmbedColorInput = new TextInputBuilder()
                .setCustomId('serverEmbedColor')
                .setLabel('Server Embed Color')
                .setPlaceholder('Server embed color')
                .setValue('#D1E44C')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            // Modal action rows
            const pointsCooldownInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(pointsCooldownInput);
            const pointsMultiplierInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(pointsMultiplierInput);

            const pointsFromWordleInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(pointsFromWordleInput);
            const wordleCooldownInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(wordleCooldownInput);

            const serverEmbedColorInputActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(serverEmbedColorInput);

            botSetupModal.addComponents(pointsCooldownInputActionRow, pointsMultiplierInputActionRow, pointsFromWordleInputActionRow, wordleCooldownInputActionRow, serverEmbedColorInputActionRow);
            
            await interaction.showModal(botSetupModal);

            break;
    }
}
 
export const options = { 
    permissions: ['Administrator'],
    botPermissions: ['ManageWebhooks']
}