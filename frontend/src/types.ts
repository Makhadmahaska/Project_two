export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  profilePictureUrl: string | null;
  createdAt?: string;
};

export type Game = {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt?: string;
};

export type Session = {
  id: string;
  userId: string;
  gameId: string;
  startTime: string;
  endTime: string | null;
  playedSeconds: number | null;
};

export type UserStats = {
  totalPlayedSeconds: number;
  minutesPerGame: Array<{ gameId: string; gameName: string; minutes: number }>;
  percentPerGame: Array<{ gameId: string; gameName: string; percent: number }>;
  sessionsByGame: Array<{
    gameId: string;
    gameName: string;
    sessions: number;
    averageMinutes: number;
  }>;
  weeklyByUserForGame: Array<{ date: string; minutes: number }>;
};
