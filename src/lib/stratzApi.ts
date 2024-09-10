import axios from "axios";
import { FileSystemCache } from "file-system-cache";
import { STRATZ_API_KEY } from '$env/static/private';

export const liveMatchInfoCache = new FileSystemCache({
    basePath: "./.cache/liveMatchInfo", // (optional) Path where cache files are stored (default).
    ns: "livematchinfo",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key.
    ttl: 15
});

export const matchInfoCache = new FileSystemCache({
    basePath: "./.cache/matchInfo", // (optional) Path where cache files are stored (default).
    ns: "matchinfo",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key.
});

export interface LivePlayerInfo {
    heroId: number;
    playerSlot: number;
    isRadiant: boolean;
    numKills: number;
    numDeaths: number;
    numAssists: number;
    goldPerMinute: number;
    level: number;
    gold: number;
    itemId0: number;
    itemId1: number;
    itemId2: number;
    itemId3: number;
    itemId4: number;
    itemId5: number;
    networth: number;
    backpackId0: number;
    backpackId1: number;
    backpackId2: number;
    baseWinRateValue: number;
}

export interface LiveMatchInfo {
    matchId: number;
    radiantScore: number;
    direScore: number;
    completed: boolean;
    radiantPlayers: Array<LivePlayerInfo>;
    direPlayers: Array<LivePlayerInfo>;
}

export interface MatchInfo {
    matchId: number;
    radiantScore: number;
    direScore: number;
    completed: boolean;
    didRadiantWin: boolean;
    players: Array<LivePlayerInfo>;
}

export class MatchInfoView {
    matchId!: number;
    radiantScore!: number;
    direScore!: number;
    completed!: boolean;
    didRadiantWin!: boolean;
    radiantPlayers!: Array<LivePlayerInfo>;
    direPlayers!: Array<LivePlayerInfo>;
}

export async function getLiveMatchInfo(matchId: number): Promise<(LiveMatchInfo | undefined)> {
    let liveMatchInfo: (LiveMatchInfo | undefined);

    liveMatchInfo = await liveMatchInfoCache.get(matchId.toString()) as LiveMatchInfo;
    if (!liveMatchInfo) {
        console.log('Fetching latest match live info...');
        const liveMatchInfoResponse = await axios.get(`https://api.stratz.com/api/v1/match/${matchId}/live`,
            {
                headers: {
                    Authorization: `Bearer ${STRATZ_API_KEY}`
                }
            }
        );

        if (liveMatchInfoResponse.status === 200) {
            liveMatchInfo = liveMatchInfoResponse.data as LiveMatchInfo;
            console.log('Fetched latest match live info.')
        }

        liveMatchInfoCache.set(matchId.toString(), liveMatchInfo);
    }
    return liveMatchInfo;
}

export async function getMatchInfo(matchId: number): Promise<(MatchInfo | undefined)> {
    let matchInfo: (MatchInfo | undefined);
    console.log('Fetching MatchInfo...');
    matchInfo = await matchInfoCache.get(matchId.toString()) as MatchInfo;
    if (!matchInfo) {
        const liveMatchInfoResponse = await axios.get(`https://api.stratz.com/api/v1/match/${matchId}`,
            {
                headers: {
                    Authorization: `Bearer ${STRATZ_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (liveMatchInfoResponse.status === 200) {
            matchInfo = liveMatchInfoResponse.data as MatchInfo;
            matchInfoCache.set(matchId.toString(), matchInfo);
        }
    }
    console.log('Fetched MatchInfo', matchInfo != null);
    return matchInfo;
}