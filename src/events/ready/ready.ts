import { ActivityType, EmbedBuilder, HexColorString, TextChannel, type Client } from 'discord.js';
import { fetchYouTubeChannelsGuildsData, getLastVideo, YouTubeChannelData, YoutubeDataStatus, YouTubeVideoData } from '../../Handler/YouTubeDataHandler';
import { getDatabaseData } from 'utilities';
import { getServerStatus } from '../../Interfaces';

interface YouTubeChannelInfo {
    youTubeChannelData: YouTubeChannelData;
    guildID: string[];
}

async function fetchAndUpdateYouTubeData(youtubeChannelData: YouTubeChannelInfo[], client: Client<true>) {
    //console.log('Fetching YouTube channel data...');
    for (const channelData of youtubeChannelData) {
        if (!channelData.guildID.length) continue; // Skip if the channel isn't in any guild

        console.log(`Fetching data for ${channelData.youTubeChannelData.ChannelName ?? channelData.youTubeChannelData.ChannelId}...`);
        const youtubeDataStatus = await channelData.youTubeChannelData.fetchData();
        if (youtubeDataStatus === YoutubeDataStatus.ERROR) {
            console.log(`Error fetching data for ${channelData.youTubeChannelData.ChannelName ?? channelData.youTubeChannelData.ChannelId}.`);
            continue;
        }
        
        for (const guildID of channelData.guildID) {
            const lastVideoData: { updated: boolean, video: YouTubeVideoData } | undefined = getLastVideo(channelData.youTubeChannelData);
            if (lastVideoData?.updated) {
                console.log(`New video from ${channelData.youTubeChannelData.ChannelName}: ${lastVideoData.video.title}`);
                const guild = client.guilds.cache.get(guildID);
                if (!guild) continue; // Skip if the guild doesn't exist

                const guildData = getDatabaseData(['guilds', guildID, 'data']);
                
                const announcementChannel: string = guildData?.youtubeChannelAnnouncementChannel;
                const announcementText: string = guildData?.youtubeChannelAnnouncementText ?? 'New video from **[{channelName}]({channelLink})**!';
                const serverEmbedColor = getDatabaseData(['guilds', guildID, 'data', 'embedColor']) ?? '#D1E44C';

                // Skip if the guild doesn't have a channel set or the channel doesn't exist
                if (guildData && announcementChannel && !client.channels.cache.has(announcementChannel)) continue;
                const channel = await client.channels.fetch(announcementChannel) as TextChannel;

                const embed = new EmbedBuilder()
                    .setTitle(lastVideoData.video.title)
                    .setDescription(lastVideoData.video.description)
                    .setImage(lastVideoData.video.thumbnail)
                    .setTimestamp(new Date(lastVideoData.video.publicationDate))
                    .setAuthor({ name: lastVideoData.video.channelTitle, iconURL: channelData.youTubeChannelData.ChannelThumbnail })
                    .setURL(`https://www.youtube.com/watch?v=${lastVideoData.video.id}`)
                    .setColor(serverEmbedColor);

                await channel.send({ content: announcementText.replace('{channelName}', channelData.youTubeChannelData.ChannelName!).replace('{channelLink}', `https://www.youtube.com/channel/${channelData.youTubeChannelData.ChannelId}`), embeds: [embed] });
                console.log(`Sent announcement for ${channelData.youTubeChannelData.ChannelName} in ${guild.name}.`);
            } else {
                console.log(`No new video from ${channelData.youTubeChannelData.ChannelName}.`);
            }
        }
    }
    //console.log('Finished fetching YouTube channel data.');
}

async function fetchAndUpdateServerStatus(client: Client<true>) {
    const guilds = getDatabaseData(['guilds']) ?? {};
    const guildsWithServerData = Object.keys(guilds).filter(guildID => guilds[guildID]?.data?.server?.serverIPAndPort || guilds[guildID]?.data?.server?.trackOnProfile);
    if (guildsWithServerData.length === 0) return;
    const serverStatus = await getServerStatus(guildsWithServerData[0]);

    let statusMessage = 'Server status not available';
    if (serverStatus !== undefined) statusMessage = `Server: ${serverStatus.IsRunning ? 'Online' : 'Offline'} | ${serverStatus.Players.length}/${serverStatus.MaxPlayers} players`;
    if (guildsWithServerData !== undefined) client.user.setActivity(statusMessage, { type: ActivityType.Custom });
}

export default async (client: Client<true>) => {
    console.log(`${client.user.tag} is online!`);

    let youtubeChannelData: YouTubeChannelInfo[] = fetchYouTubeChannelsGuildsData(process.env.YOUTUBE_API_KEY!, client);

    await fetchAndUpdateYouTubeData(youtubeChannelData, client);
    await fetchAndUpdateServerStatus(client);

    setInterval(async () => {
        await fetchAndUpdateServerStatus(client);
    }, 60000 * 1);
    setInterval(async () => {
        youtubeChannelData = fetchYouTubeChannelsGuildsData(process.env.YOUTUBE_API_KEY!, client, youtubeChannelData); // Update the channel data
        await fetchAndUpdateYouTubeData(youtubeChannelData, client);
    }, 60000 * 10);
};