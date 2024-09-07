import { Live, ProMatch, TeamMatch } from "$lib/dota2Api.js";
import axios from "axios";

export async function load(event) {

    let query = event.url.searchParams.get('query') ?? '';
    let matches = new Array<Live>();
    if (query.length > 0) {
        query = query.toLocaleLowerCase();
        const proMatchesResponse = await axios.get("http://api.opendota.com/api/live");
        matches = proMatchesResponse.data as Array<Live>;
        matches = matches.filter(x => x.league_id == 16935).slice(0, 20);
        matches.sort((a, b) => {
            if ((a.game_time ?? 0) === (b.game_time ?? 0)) {
                return 0;
            }

            return (a.game_time ?? 0) === (b.game_time ?? 0) ? 1 : -1;
        })
    }

    return {
        matches,
        query
    }

}