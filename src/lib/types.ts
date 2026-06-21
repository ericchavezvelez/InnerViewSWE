// Shared Supabase response shapes used across the app

export type UserResponseRow = {
  is_correct: boolean;
  topics: { name: string };
};

export type UserResponseRowWithDate = UserResponseRow & {
  created_at: string;
};
