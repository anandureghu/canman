import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";

const config = {
  EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_KEY: process.env.EXPO_PUBLIC_SUPABASE_KEY,
};

const supabaseUrl = config.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseKey = config.EXPO_PUBLIC_SUPABASE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);
