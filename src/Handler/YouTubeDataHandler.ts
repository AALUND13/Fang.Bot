import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Client } from 'discord.js';
import { getDatabaseData, writeToDatabase } from 'utilities';

export enum YoutubeDataStatus {
    SUCCESS,
    ERROR
}

export class YouTubeChannelData {
    ChannelId: string | undefined;
    ChannelName: string | undefined;
    ChannelDescription: string | undefined;
    ChannelThumbnail: string | undefined;

    Videos: YouTubeVideoData[] = [];

    private axiosInstance: AxiosInstance;
    private cacheChannelResponse: AxiosResponse | null = null;

    constructor(apiKey: string, channelId: string) {
        // Create an Axios instance with baseURL and interceptors for API key
        this.axiosInstance = axios.create({
            baseURL: 'https://www.googleapis.com/youtube/v3/',
            params: {
                key: apiKey
            }
        });

        this.ChannelId = channelId;
    }

    async fetchData(maxResults: number = 1): Promise<YoutubeDataStatus> {
        try {
            // Fetch channel information if not cached
            if (!this.cacheChannelResponse) {
                console.log(`Fetching channel data for ${this.ChannelId}...`);
                this.cacheChannelResponse = await this.axiosInstance.get('channels', {
                    params: {
                        id: this.ChannelId,
                        part: 'snippet'
                    }
                });
            }

            if (!this.cacheChannelResponse) return YoutubeDataStatus.ERROR; // Return error if the channel data is not found

            // Fetch videos from the channel
            const videoResponse: AxiosResponse = await this.axiosInstance.get('search', {
                params: {
                    channelId: this.ChannelId,
                    part: 'snippet',
                    order: 'date',
                    maxResults: maxResults.toString()
                }
            });

            // Process channel information
            const channelData = this.cacheChannelResponse.data.items[0].snippet;
            this.ChannelName = channelData.title;
            this.ChannelDescription = channelData.description;
            this.ChannelThumbnail = channelData.thumbnails.default.url;

            // Process videos
            this.Videos = videoResponse.data.items.map((video: any) => new YouTubeVideoData(video));
            return YoutubeDataStatus.SUCCESS;
        } catch (error) {
            //console.error('Error fetching YouTube channel data:', error);
            return YoutubeDataStatus.ERROR;
        }
    }
}

export class YouTubeVideoData {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publicationDate: string;

    channelTitle: string;

    constructor(data: any) {
        this.id = data.id.videoId;
        this.title = data.snippet.title;
        this.description = data.snippet.description;
        this.thumbnail = data.snippet.thumbnails.default.url;
        this.publicationDate = data.snippet.publishTime;
        this.channelTitle = data.snippet.channelTitle;
    }
}

export function getLastVideo(channelData: YouTubeChannelData): { updated: boolean, video: YouTubeVideoData } | undefined{
    if (channelData.ChannelId === undefined) return;
    let lastVideoData: string | undefined = getDatabaseData(['videoData', channelData.ChannelId, 'lastVideoID']);
    
    if (lastVideoData === undefined || lastVideoData !== channelData.Videos[0].id) {
        writeToDatabase(['videoData', channelData.ChannelId, 'lastVideoID'], channelData.Videos[0].id);
        return { updated: true, video: channelData.Videos[0] };
    }

    return { updated: false, video: channelData.Videos[0] };
}

export interface YouTubeChannelInfo {
    youTubeChannelData: YouTubeChannelData;
    guildID: string[];
}

export function fetchYouTubeChannelsGuildsData(apiKey: string, client: Client<true>, youTubeChannelInfo: YouTubeChannelInfo[] = []): YouTubeChannelInfo[] {
    const youtubeChannelData: YouTubeChannelInfo[] = [...youTubeChannelInfo];
    for (const guild of client.guilds.cache.values()) {
        const guildData = getDatabaseData(['guilds', guild.id, 'data']);
        const announcementChannel: string = guildData?.youtubeChannelAnnouncementChannel;
        const announcementYoutubeChannel: string = guildData?.youtubeChannelId;

        if (!announcementChannel || !client.channels.cache.has(announcementChannel) || !announcementYoutubeChannel) continue; // Skip if the guild doesn't have a channel set

        const existingChannelInfo = youtubeChannelData.find(channel => channel.youTubeChannelData.ChannelId === announcementYoutubeChannel);

        if (existingChannelInfo) {
            // Add the guild ID to the existing YouTubeChannelData
            if (!existingChannelInfo.guildID.includes(guild.id)) {
                existingChannelInfo.guildID.push(guild.id);
            }
        } else {
            // Check if no YouTubeChannelData already contains the current guild ID
            if (!youtubeChannelData.some(channel => channel.guildID.includes(guild.id))) {
                youtubeChannelData.push({
                    youTubeChannelData: new YouTubeChannelData(apiKey, announcementYoutubeChannel),
                    guildID: [guild.id]
                });
            }
        }
    }
    return youtubeChannelData;
}
