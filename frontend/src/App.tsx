import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import { AllUsersPage } from './pages/Alluserpage';
import { ChooseGamePage } from './pages/chooseGame';
import { RegistrationPage } from './pages/registerPage';
import { StatisticsPage } from './pages/statsPage';
import { TimerPage } from './pages/TimePage';
import type { Game, User } from './types';

function getStored<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export default function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    getStored<User>('selectedUser')
  );
  const [selectedGame, setSelectedGame] = useState<Game | null>(() =>
    getStored<Game>('selectedGame')
  );

  useEffect(() => {
    if (currentUser) localStorage.setItem('selectedUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (selectedGame) localStorage.setItem('selectedGame', JSON.stringify(selectedGame));
  }, [selectedGame]);

  function handleUserSelected(user: User) {
    setCurrentUser(user);
    navigate('/statistics');
  }

  function handleGameSelected(game: Game) {
    setSelectedGame(game);
    navigate('/timer');
  }

  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/register" replace />} />

      {/* Registration Page */}
      <Route
        path="/register"
        element={
          <Layout>
            <RegistrationPage />
          </Layout>
        }
      />

      {/* All Users Page */}
      <Route
        path="/users"
        element={
          <Layout>
            <AllUsersPage onUserSelected={handleUserSelected} />
          </Layout>
        }
      />

      {/* Choose Game Page */}
      <Route
        path="/choose-game"
        element={
          <Layout>
            <ChooseGamePage onGameSelected={handleGameSelected} />
          </Layout>
        }
      />

      {/* Timer Page - redirect if no user/game selected */}
      <Route
        path="/timer"
        element={
          <Layout>
            {currentUser && selectedGame ? (
              <TimerPage currentUser={currentUser} selectedGame={selectedGame} />
            ) : (
              <Navigate to="/users" replace />
            )}
          </Layout>
        }
      />

      {/* Statistics Page - redirect if no user selected */}
      <Route
        path="/statistics"
        element={
          <Layout>
            {currentUser ? (
              <StatisticsPage currentUser={currentUser} />
            ) : (
              <Navigate to="/users" replace />
            )}
          </Layout>
        }
      />
    </Routes>
  );
}