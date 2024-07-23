import { GuildBasedChannel, GuildTextChannelType, Interaction, PermissionFlagsBits, TextChannel } from "discord.js";
import { getDatabaseData, writeToDatabase } from "utilities";
import client from "../..";
import axios from "axios";

export default async (interaction: Interaction) => {
    if (!interaction.isChannelSelectMenu()) return;
    console.log('ChannelSelectMenu event executed.');

    switch (interaction.customId) {
        case 'serverChannel':
            if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }

            const selectedChannelId = interaction.values[0];
            const fetchResponse = interaction.message
            const messageEmbedResponse = fetchResponse.embeds[0];

            const modifiedEmbed = {
                title: messageEmbedResponse.title || '',
                color: messageEmbedResponse.color || parseInt('D1E44C', 16),
                description: `${messageEmbedResponse.description}\nChannel <#${selectedChannelId}> will now be used for server tracking.`
            }

            writeToDatabase(['guilds', interaction.guildId!, 'data', 'server', 'trackingChannelID'], selectedChannelId);
            // if the bot have `Manager Webhooks` permission, craete a webhook for the selected channel and send it to the server
            if (interaction.guild?.members?.me?.permissions?.has(PermissionFlagsBits.ManageWebhooks)) {
                const channel = client.channels.cache.get(selectedChannelId) as TextChannel;

                console.log(client?.user?.avatarURL({ extension: 'png' }) || undefined);
                await channel?.createWebhook({
                    name: 'Server Tracking',
                    avatar: client?.user?.avatarURL({ extension: 'png' }) || undefined
                }).then(async webhook => {
                    const guildServerData = getDatabaseData(['guilds', interaction.guildId!, 'data', 'server']);

                    // if the server already have a webhook, delete it.
                    if (guildServerData.webhookID !== undefined) {
                        // delete the old webhook from the channel
                        channel.fetchWebhooks().then(webhooks => {
                            const oldWebhook = webhooks.find(webhook => webhook.id === guildServerData.webhookID);
                            if (oldWebhook) oldWebhook.delete().catch(console.error);
                        })
                        
                        // deatch the old webhook from the server.
                        await axios.delete(`http://${guildServerData.serverIPAndPort}/api/v1/webhooks/${webhook.id}/${webhook.token}?APIKey=${guildServerData.APIKey}`).catch(console.error);
                    }

                    // Attach the new webhook to the server, And save the webhook ID to the database.
                    console.log(webhook.url);
                    await axios.get(`http://${guildServerData.serverIPAndPort}/api/v1/webhooks/${webhook.id}/${webhook.token}?APIKey=${guildServerData.APIKey}`).catch(console.error);
                    writeToDatabase(['guilds', interaction.guildId!, 'data', 'server', 'webhookID'], webhook?.id);
                }).catch(console.error);
            }

            await interaction.update({ embeds: [modifiedEmbed], components: [] });
            await interaction.followUp({ content: `You selected the channel: <#${selectedChannelId}>, Server tracking channel setup completed.`, ephemeral: true });
            break;
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