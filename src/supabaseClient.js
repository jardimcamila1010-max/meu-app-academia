import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ybwgvmdwkirsfxrdjtxn.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlid2d2bWR3a2lyc2Z4cmRqdHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMzg2MjUsImV4cCI6MjA5OTgxNDYyNX0.T-A6iHQcj3iBHrvT37gOMZ2bnPsiaIsKVyNz96ZWzxY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
