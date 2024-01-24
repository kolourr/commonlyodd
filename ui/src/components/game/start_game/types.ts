export interface WebSocketMessage {
  game_state: string;
  objs_image_links?: objs_images;
  odd_reason_for_similarity?: odd_similar;
  individual_team_score?: number;
  timer?: number;
  game_teams_score?: TeamScore[];
  game_winner?: string;
  team_id?: number;
  team_name?: string;
  number_of_teams?: number;
  target_score?: number;
}

export interface TeamScore {
  team_name: string;
  score: number;
}

export interface Objects_Images {
  game_state: string;
  objs_image_links?: objs_images;
  team_id?: number;
  team_name?: string;
}

export interface Timer {
  game_state?: string;
  timer?: number;
}

export interface Odd_Reason_for_Similarity {
  game_state: string;
  odd_reason_for_similarity?: odd_similar;
}

export interface odd_similar {
  odd: string;
  reason: string;
}

export interface objs_images {
  img_link1: string;
  img_link2: string;
  img_link3: string;
  obj1: string;
  obj2: string;
  obj3: string;
}

export interface messageData {
  game_state: string;
  team_id?: number | undefined;
  individual_team_score?: number | undefined;
  team_name?: string | undefined;
  number_of_teams?: number;
  target_score?: number;
}

export interface GameWinner {
  game_winner?: string;
}
