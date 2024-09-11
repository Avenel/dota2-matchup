import axios from "axios";
import { OPENAI_KEY } from '$env/static/private';
import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { HEROES } from "$lib/tiDb.js";
import { draftAnalysisCache } from "$lib/openAICache.js"
import { getLiveMatches, getMatches, type LiveMatchInfo, type MatchInfoView } from "$lib/stratzApi.js";

export async function load(event) {

    let matches = new Array<MatchInfoView>();
    console.log('Fetching live matches for TI 2024...');

    let liveMatches = await getLiveMatches();
    const matchesCompletedInfo = await getMatches(liveMatches.map(x => x.matchId));

    for (let liveMatch of liveMatches) {
        if (liveMatch.players.filter(x => x.heroId === 0).length > 0) {
            console.warn('Game is still in picking phase, skipping...');
            continue;
        }

        let matchInfoView: MatchInfoView = {
            ...liveMatch
        };

        matchInfoView.draftAnalysis = await getMatchDraftAnalysis(liveMatch);

        const matchCompletedInfo = matchesCompletedInfo.find(x => x.matchId == liveMatch.matchId);
        if (matchCompletedInfo) {
            matchInfoView.completed = true;
            matchInfoView.didRadiantWin = matchCompletedInfo.didRadiantWin;
        }

        matches.push(matchInfoView);
    }

    console.log('Fetched live matches for TI 2024.');

    return {
        matches
    }
}

async function getMatchDraftAnalysis(liveMatch: LiveMatchInfo): Promise<string> {
    const radiantPlayers = liveMatch.players.filter(x => x.isRadiant);
    const matchupRadiant = radiantPlayers.map(x => {
        return HEROES.find(h => h.id === x.heroId)?.localized_name ?? ''
    }).join(',');

    const direPlayers = liveMatch.players.filter(x => !x.isRadiant);
    const matchupDire = direPlayers.map(x => {
        return HEROES.find(h => h.id === x.heroId)?.localized_name ?? ''
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
    let analysisFromCache = (await draftAnalysisCache.get(cacheKey)) as string;
    if (!analysisFromCache) {
        const response = await chain.invoke({
            matchup
        });
        analysisFromCache = response;
        draftAnalysisCache.set(cacheKey, analysisFromCache);
    }

    return analysisFromCache;
}