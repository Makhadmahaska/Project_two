import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { api } from '../api';
import type { Game, User, UserStats } from '../types';

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'];

type Props = {
  currentUser: User | null;
};

export function StatisticsPage({ currentUser }: Props) {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState('');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [globalTotals, setGlobalTotals] = useState<Array<{ gameName: string; minutes: number }>>([]);
  const [leaderboard, setLeaderboard] = useState<Array<{ userId: string; name: string; minutes: number }>>([]);
  const [weeklyByGame, setWeeklyByGame] = useState<Array<Record<string, number | string>>>([]);

  useEffect(() => {
    api.getGames().then((gameRows) => {
      setGames(gameRows);
      if (gameRows.length > 0) {
        setSelectedGameId(gameRows[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    api.getUserStats(currentUser.id, selectedGameId || undefined).then(setStats);
  }, [currentUser, selectedGameId]);

  useEffect(() => {
    api.getGlobalStats().then((result) => {
      setGlobalTotals(result.totalTimePerGame.map((item) => ({ gameName: item.gameName, minutes: item.minutes })));
    });
  }, []);

  useEffect(() => {
    if (!selectedGameId) return;
    api.getLeaderboard(selectedGameId).then((rows) => {
      setLeaderboard(rows.map((row) => ({ userId: row.userId, name: row.name, minutes: row.minutes })));
    });
  }, [selectedGameId]);

  useEffect(() => {
    if (!selectedGameId) return;
    api.getWeeklyByGame(selectedGameId).then(setWeeklyByGame);
  }, [selectedGameId]);

  const weeklyUserKeys = Array.from(
    new Set(
      weeklyByGame.flatMap((row) =>
        Object.keys(row).filter((key) => key !== 'date')
      )
    )
  );

  const selectedGameName =
    games.find((game) => game.id === selectedGameId)?.name ?? 'Selected Game';
  const currentUserName = currentUser
    ? [currentUser.firstName, currentUser.lastName].filter(Boolean).join(' ')
    : '';

  const selectedGameSessionStats =
    stats?.sessionsByGame.find((item) => item.gameId === selectedGameId) ?? null;

  if (!currentUser) {
    return <section className="card">Select a user from search or All Users page to view stats.</section>;
  }

  if (!stats) {
    return <section className="card">Loading statistics...</section>;
  }

  return (
    <section className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <img
          src={currentUser.profilePictureUrl || 'https://placehold.co/96x96?text=User'}
          alt={currentUserName}
          style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div>
          <h2 style={{ margin: 0 }}>
            Statistics for {currentUserName}
          </h2>
          <p style={{ margin: '6px 0 0 0' }}>
            Total time played: {Math.round(stats.totalPlayedSeconds / 60)} minutes
          </p>
        </div>
      </div>

      <label>
        Choose game for detailed charts
        <select value={selectedGameId} onChange={(e) => setSelectedGameId(e.target.value)}>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </label>

      <div className="chart-grid">
        <div className="chart-card">
          <h3>Minutes Per Game</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.minutesPerGame}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gameName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#2f6f4f" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Percent Time By Game</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.percentPerGame}
                dataKey="percent"
                nameKey="gameName"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {stats.percentPerGame.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Sessions + Average Length (Selected Game)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={
                selectedGameSessionStats
                  ? [
                      {
                        gameName: selectedGameSessionStats.gameName,
                        sessions: selectedGameSessionStats.sessions,
                        averageMinutes: selectedGameSessionStats.averageMinutes
                      }
                    ]
                  : []
              }
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gameName" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sessions" fill="#845ec2" />
              <Bar dataKey="averageMinutes" fill="#ff9671" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Weekly Play Time (Selected Game, Current User)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.weeklyByUserForGame}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="minutes" stroke="#ff6f91" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Weekly Play Time By User (Selected Game)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyByGame}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {weeklyUserKeys.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Total Time Per Game (All Users)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={globalTotals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="gameName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#2c73d2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-card">
        <h3>Leaderboard (Top Players for Selected Game)</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Game</th>
              <th>Time Played (min)</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((row) => (
              <tr key={row.userId}>
                <td>{row.name}</td>
                <td>{selectedGameName}</td>
                <td>{row.minutes}</td>
              </tr>
            ))}
            {leaderboard.length === 0 && (
              <tr>
                <td colSpan={3}>No sessions recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
