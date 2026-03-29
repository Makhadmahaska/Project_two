export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string | null;
  profilePictureUrl: string | null;
  createdAt: string;
};

export type Game = {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt: string;
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
  minutesPerGame: Array<{
    gameId: string;
    gameName: string;
    minutes: number;
  }>;
  percentPerGame: Array<{
    gameId: string;
    gameName: string;
    percent: number;
  }>;
  sessionsByGame: Array<{
    gameId: string;
    gameName: string;
    sessions: number;
    averageMinutes: number;
  }>;
  weeklyByUserForGame: Array<{
    date: string;
    minutes: number;
  }>;
};

export type GlobalStatsResponse = {
  totalTimePerGame: Array<{
    gameId: string;
    gameName: string;
    total: number;
    minutes: number;
  }>;
};

export type LeaderboardRow = {
  userId: string;
  name: string;
  totalSeconds: number;
  minutes: number;
};

export type WeeklyByGameRow = Record<string, number | string>;

const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const message =
        data && typeof data === 'object' && 'message' in data
          ? String(data.message)
          : 'Request failed';
      throw new Error(message);
    }

    return data as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Could not reach the server. Start the backend and try again.');
    }

    throw error;
  }
}

export const api = {
  createUser: (payload: {
    email: string;
    firstName: string;
    lastName?: string;
    profilePictureUrl?: string;
  }) =>
    request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getUsers: () => request<User[]>('/users'),

  searchUsers: (query: string) =>
    request<User[]>(`/users/search?q=${encodeURIComponent(query)}`),

  getGames: () => request<Game[]>('/games'),

  startSession: (payload: { userId: string; gameId: string }) =>
    request<Session>('/sessions/start', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  stopSession: (payload: { sessionId: string }) =>
    request<Session>('/sessions/stop', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getUserStats: (userId: string, gameId?: string) =>
    request<UserStats>(`/stats/user/${userId}${gameId ? `?gameId=${gameId}` : ''}`),

  getGlobalStats: () => request<GlobalStatsResponse>('/stats/global'),

  getLeaderboard: (gameId: string) =>
    request<LeaderboardRow[]>(`/stats/leaderboard?gameId=${encodeURIComponent(gameId)}`),

  getWeeklyByGame: (gameId: string) =>
    request<WeeklyByGameRow[]>(`/stats/weekly-by-game?gameId=${encodeURIComponent(gameId)}`),
};
