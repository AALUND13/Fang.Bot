import axios from "axios";
import { getDatabaseData } from "utilities";

export interface ServerMod {
    ModID: number;
    ModName: string;
}

export interface ServerStatus {
    IsRunning: boolean;
    ServerName: string;
    ServerPublicIP: string;
    Port: number;
    MaxPlayers: number;
    Players: string[];
    ModList: ServerMod[];
    SimulationSpeed: number;
    Uptime: string;
}

export enum PromoteLevel {
    None,
    Scripter,
    Moderator,
    SpaceMaster,
    Admin,
    Owner
}

export enum RankChangeType {
    Promoted,
    Demoted,
    SameRank
}

export interface PlayerRankChange {
    PlayerName: string;

    ChangeType: RankChangeType;
    
    OldRank: PromoteLevel;
    NewRank: PromoteLevel;
}

export function getStringPromoteLevel(promoteLevel: PromoteLevel): string {
    switch (promoteLevel) {
        case PromoteLevel.None:
            return 'Player';
        case PromoteLevel.Scripter:
            return 'Scripter';
        case PromoteLevel.Moderator:
            return 'Moderator';
        case PromoteLevel.SpaceMaster:
            return 'Space Master';
        case PromoteLevel.Admin:
            return 'Admin';
        case PromoteLevel.Owner:
            return 'Owner';
    }
}

export async function promotePlayer(guild: string, player: string): Promise<PlayerRankChange | undefined> {
    const guildDataServer = getDatabaseData(['guilds', guild, 'data', 'server']);

    try {
        const response = await axios.get(`http://${guildDataServer.serverIPAndPort}/api/v1/server/players/promote?APIKey=${guildDataServer.APIKey}&PlayerName=${player}`);
        return response.data as PlayerRankChange;    
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function demotePlayer(guild: string, player: string): Promise<PlayerRankChange | undefined> {
    const guildDataServer = getDatabaseData(['guilds', guild, 'data', 'server']);

    try {
        const response = await axios.get(`http://${guildDataServer.serverIPAndPort}/api/v1/server/players/demote?APIKey=${guildDataServer.APIKey}&PlayerName=${player}`);
        return response.data as PlayerRankChange;    
    } catch (error) {
        console.error(error);
        return undefined;
    }
}

export async function getServerStatus(guild: string): Promise<ServerStatus | undefined> {
    const guildDataServer = getDatabaseData(['guilds', guild, 'data', 'server']);

    try {
        const response = await axios.get(`http://${guildDataServer.serverIPAndPort}/api/v1/server/status`);
        return response.data as ServerStatus;    
    } catch (error) {
        console.error(error);
        return undefined;
    }
}