import { Database } from "./supabase";

export type PollType = Database["public"]["Tables"]["polls"]["Row"];
export type VoteType = Database["public"]["Tables"]["votes"]["Row"];
