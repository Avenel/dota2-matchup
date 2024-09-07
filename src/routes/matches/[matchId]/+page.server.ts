import { Live, Match, ProMatch, TeamMatch } from "$lib/dota2Api.js";
import axios from "axios";

export async function load(event) {

    let matchId = event.params.matchId;
    let match = new Match();
    if (matchId.length > 0) {
        const matchResponse = await axios.get("http://api.opendota.com/api/matches/" + matchId);
        match = matchResponse.data as Match;
    }

    return {
        match
    }

}