import { Live, openDotaLiveCache } from "$lib/dota2Api.js";
import axios from "axios";
import { OPENAI_KEY } from '$env/static/private';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { HEROES } from "$lib/tiDb.js";
import { openAIMatchupAnalysisCache } from "$lib/openAICache.js"
import { getLiveMatchInfo, getMatchInfo, type LiveMatchInfo, type MatchInfoView } from "$lib/stratzApi.js";

export async function load(event) {

    let matches = new Array<Live>();
    console.log('Fetching live matches for TI 2024...');

    matches = await openDotaLiveCache.get('live') as Array<Live>;
    if (!matches) {
        console.log('Fetching fresh live matches from opendota.com ...');
        const proMatchesResponse = await axios.get("http://api.opendota.com/api/live");
        matches = proMatchesResponse.data as Array<Live>;
        matches = matches.filter(x => x.league_id == 16935).slice(0, 20);
        matches.sort((a, b) => {
            if ((a.game_time ?? 0) === (b.game_time ?? 0)) {
                return 0;
            }

            return (a.game_time ?? 0) === (b.game_time ?? 0) ? 1 : -1;
        })

        openDotaLiveCache.set('live', matches);
    }


    const matchesWithAnalysis: Array<(Live & { analysis: string } & { liveInfo: (MatchInfoView | undefined) })> = [];
    for (let match of matches) {

        if (match.players.filter(x => HEROES.find(h => h.id === x.hero_id)).length !== 10) {
            console.warn('Game is still in picking phase, skipping...');
            continue;
        }

        const radiantPlayers = match.players.filter(x => x.team == 0);
        const matchupRadiant = radiantPlayers.map(x => {
            return HEROES.find(h => h.id === x.hero_id)?.localized_name ?? ''
        }).join(',');

        const direPlayers = match.players.filter(x => x.team == 1);
        const matchupDire = direPlayers.map(x => {
            return HEROES.find(h => h.id === x.hero_id)?.localized_name ?? ''
        }).join(',');

        const matchup = `Radiant: ${matchupRadiant}; Dire: ${matchupDire}`;
        console.log("Matchup: ", matchup);

        const humanPrompt = `You are the best DotA 2 Analyser on the planet and you also have been a very successful player. Please
                look at the following DotA 2 Matchup and explain to a Newbie. Please make it concise, short and use the following format (markdown):

                ### Composition

                #### Radiant

                Summarize the composition very very short in 1-2 sentences. Try to anticipate the thought of the teams why they picked these heroes.

                #### Dire

                Summarize the composition very very short in 1-2 sentences. Try to anticipate the thought of the teams why they picked these heroes.


                ### Prediction

                Predict which team has bigger chance winning and why,

            ---
            DOTA 2 MATCHUP: 
            {matchup}`

        const prompt = ChatPromptTemplate.fromMessages([
            ['human', humanPrompt]
        ]);
        const model = new ChatOpenAI({
            apiKey: OPENAI_KEY,
            model: 'gpt-4o'
        });
        const outputParser = new StringOutputParser();

        const chain = prompt.pipe(model).pipe(outputParser);

        const cacheKey = humanPrompt.replace('{matchup}', JSON.stringify(matchup));
        let analysisFromCache = (await openAIMatchupAnalysisCache.get(cacheKey)) as { analysis: string };
        if (!analysisFromCache) {
            // console.log('matchup not in cache, getting it fresh...', cacheKey)
            const response = await chain.invoke({
                matchup
            });
            // console.log('Got matchup...', response)
            analysisFromCache = { analysis: response };
            openAIMatchupAnalysisCache.set(cacheKey, analysisFromCache);
            // console.log('SET request for key: ', prompt);
        }

        let liveMatchInfo: MatchInfoView | undefined;
        const matchInfo = await getMatchInfo(match.match_id);
        if (matchInfo) {
            liveMatchInfo = {
                completed: true,
                direPlayers: matchInfo.players.filter(x => !x.isRadiant),
                radiantPlayers: matchInfo.players.filter(x => x.isRadiant),
                direScore: matchInfo.direScore,
                radiantScore: matchInfo.radiantScore,
                didRadiantWin: matchInfo.didRadiantWin,
                matchId: matchInfo.matchId
            }
        } else {
            const latestLiveMatchInfo = await getLiveMatchInfo(match.match_id);
            liveMatchInfo = {
                completed: false,
                direPlayers: latestLiveMatchInfo?.direPlayers ?? [],
                radiantPlayers: latestLiveMatchInfo?.radiantPlayers ?? [],
                direScore: latestLiveMatchInfo?.direScore ?? 0,
                radiantScore: latestLiveMatchInfo?.radiantScore ?? 0,
                didRadiantWin: false,
                matchId: match.match_id
            }
        }


        matchesWithAnalysis.push({
            ...match, analysis: analysisFromCache.analysis,
            liveInfo: liveMatchInfo
        });
    }

    console.log('Fetched live matches for TI 2024.');

    return {
        matches: matchesWithAnalysis
    }

}