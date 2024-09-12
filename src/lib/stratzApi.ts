import axios from "axios";
import { FileSystemCache } from "file-system-cache";
import { STRATZ_API_KEY } from '$env/static/private';

export const liveMatchInfoCache = new FileSystemCache({
    basePath: "./.cache/liveMatchInfo", // (optional) Path where cache files are stored (default).
    ns: "livematchinfo",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key.
    ttl: 15
});

export const liveMatchesInfoCache = new FileSystemCache({
    basePath: "./.cache/liveMatchesInfo", // (optional) Path where cache files are stored (default).
    ns: "livematchesinfo",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key.
    ttl: 15
});

export const matchesInfoCache = new FileSystemCache({
    basePath: "./.cache/matchesInfo", // (optional) Path where cache files are stored (default).
    ns: "matchesinfo",   // (optional) A grouping namespace for items.
    hash: "sha1",          // (optional) A hashing algorithm used within the cache key.
});

export interface LivePlayerInfo {
    heroId: number;
    name: string;
    steamAccount: { name: string };
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

export interface MatchInfo {
    matchId: number;
    radiantScore: number;
    direScore: number;
    completed: boolean;
    didRadiantWin: boolean;
}

export interface TeamInfo {
    name: string;
    tag: string;
    isPro: boolean;
    logo: string;
}

export interface LiveMatchInfo {
    matchId: number;

    completed: boolean;
    gameTime: number;

    radiantScore: number;
    radiantTeam?: TeamInfo;

    direScore: number;
    direTeam?: TeamInfo;

    players: Array<LivePlayerInfo>;
}

export interface MatchInfoView extends LiveMatchInfo {
    didRadiantWin?: boolean;
    draftAnalysis?: string;
}

export async function getLiveMatches(): Promise<Array<LiveMatchInfo>> {
    let liveMatchesInfo = await liveMatchesInfoCache.get('live') as Array<LiveMatchInfo>;
    if (!liveMatchesInfo) {
        console.log('Fetching latest match live info...');
        const query = `{
            live {
                matches(request: { orderBy: GAME_TIME, tiers: PROFESSIONAL }) {
                matchId,
                gameTime,
                radiantLead,
                radiantScore,
                radiantTeam {
                    name,
                    tag,
                    isPro,
                    logo
                },
                direTeam {
                    name,
                    tag,
                    isPro,
                    logo
                }
                direScore,
                completed,
                players {
                    heroId,
                    name,
                    playerSlot,
                    isRadiant,
                    numKills,
                    numDeaths,
                    numAssists,
                    goldPerMinute,
                    networth,
                    itemId0,
                    itemId1,
                    itemId2,
                    itemId3,
                    itemId4,
                    itemId5,
                    backpackId0,
                    backpackId1,
                    backpackId2,
                    level,
                    steamAccount {
                    name
                    }
                }
                }
            }
        }`

        const liveMatchesInfoResponse = await axios.post(`https://api.stratz.com/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${STRATZ_API_KEY}`
                }
            }
        );

        if (liveMatchesInfoResponse.status === 200) {
            liveMatchesInfo = liveMatchesInfoResponse.data.data.live.matches as Array<LiveMatchInfo>;
            console.log('Fetched latest match live info.')
        }

        liveMatchInfoCache.set('live', liveMatchesInfo);
    }

    return liveMatchesInfo;
}

export async function getMatches(matchIds: Array<number>): Promise<Array<MatchInfo>> {
    if (matchIds.length === 0)
        return [];

    let matchesInfo = await matchesInfoCache.get(matchIds.join(',')) as Array<MatchInfo>;
    if (!matchesInfo) {
        console.log('Fetching latest matches info...');
        const query = `{
            matches(ids: [${matchIds.join(',')}]) {
                id,
                didRadiantWin
            }
        }`;

        const matchesInfoResponse = await axios.post(`https://api.stratz.com/graphql`,
            { query },
            {
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${STRATZ_API_KEY}`
                }
            }
        );

        if (matchesInfoResponse.status === 200) {
            matchesInfo = matchesInfoResponse.data.data.matches as Array<MatchInfo>;
            console.log('Fetched latest match live info.')
        }

        matchesInfoCache.set(matchIds.join(','), matchesInfo);
    }

    return matchesInfo ?? [];
}
