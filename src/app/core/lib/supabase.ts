import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yqlaedexihtdgllpygng.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGFlZGV4aWh0ZGdsbHB5Z25nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3NDcxOTEsImV4cCI6MjA1NDMyMzE5MX0.u_p3_Xm8xLX6QfhJtvxkV63vjeaHdJawNy1z3vP8kWs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
