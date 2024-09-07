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