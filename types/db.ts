import { Database } from "./supabase";

export type PollType = Database["public"]["Tables"]["polls"]["Row"];
