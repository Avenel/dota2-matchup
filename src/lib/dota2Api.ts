export class ProMatch {
    public duration!: number;
    public radiant_name!: string;
    public dire_name!: string;
    public radiant_score!: number;
    public dire_score!: number;
}

export class TeamMatch {
    public duration!: number;
    public start_time!: number;

    public opposing_team_name!: string;
    public opposing_team_id!: number;

    public radiant_score!: number;
    public dire_score!: number;
}

export class Player {
    public hero_id!: number;
    public team_slot!: number;
    public name!: string;
    public team_id!: number;
    public team!: number;
}

export class Live {
    public match_id!: number;
    public game_time?: number;
    public team_name_radiant!: string;
    public team_name_dire!: string;
    public team_id_radiant!: number;
    public team_id_dire!: number;
    public radiant_score!: number;
    public dire_score!: number;
    public league_id!: number;

    public players!: Array<Player>;
}

export class Benchmark {

}

export class PlayerDetail {
    public team_slot!: number;
    public team_number!: number;
    public hero_id!: number;
    public item_0!: number;
    public item_1!: number;
    public item_2!: number;
    public item_3!: number;
    public item_4!: number;
    public item_5!: number;
    public backpack_0!: number;
    public backpack_1!: number;
    public backpack_2!: number;
    public kills!: number;
    public deaths!: number;
    public assists!: number;
    public kda!: number;
    public level!: number;
    public net_worth!: number;
    public actions_per_min!: number;
    public benchmarks!: Benchmark;
    public name!: string;
}

export class Match {
    public match_id!: number;
    public start_time!: number;
    public duration!: number;

    public players!: Array<PlayerDetail>;

    public radiant_team_id!: number;
    public radiant_name!: string;
    public radiant_logo!: number;

    public dire_team_id!: number;
    public dire_name!: string;
    public dire_logo!: number;

    public radiant_score!: number;
    public dire_score!: number;

    public radiant_win!: boolean;
    public dire_win!: boolean;
}