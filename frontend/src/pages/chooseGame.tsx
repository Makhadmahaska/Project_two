import { useEffect, useState } from 'react';
import { api } from '../api';
import type { Game } from '../types';

type Props = {
  onGameSelected: (game: Game) => void;
};

const fallbackGames: Game[] = [
  {
    id: 'fallback-cs2',
    name: 'CS2',
    imageUrl: 'https://placehold.co/420x240?text=CS2',
  },
  {
    id: 'fallback-minecraft',
    name: 'Minecraft',
    imageUrl: 'https://placehold.co/420x240?text=Minecraft',
  },
  {
    id: 'fallback-valorant',
    name: 'Valorant',
    imageUrl: 'https://placehold.co/420x240?text=Valorant',
  },
  {
    id: 'fallback-lol',
    name: 'League of Legends',
    imageUrl: 'https://placehold.co/420x240?text=League+of+Legends',
  },
];

export function ChooseGamePage({ onGameSelected }: Props) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getGames()
      .then((rows) => {
        if (rows.length > 0) {
          setGames(rows);
          setError('');
          return;
        }

        setGames(fallbackGames);
        setError('Here are Four game To Choose1 GOOD Lucky BY Me.');
      })
      .catch(() => {
        setGames(fallbackGames);
        setError('Here are Four game To Choose1 GOOD Lucky BY Me.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <section className="card">Loading games...</section>;
  }

  return (
    <section className="card">
      <h2>Choose Game</h2>
      {error && <p className="error-text">{error}</p>}
      <div className="games-grid">
        {games.map((game) => (
          <button
            key={game.id}
            type="button"
            className="game-card"
            onClick={() => onGameSelected(game)}
          >
            <img
              src={game.imageUrl || 'https://placehold.co/420x240?text=Game'}
              alt={game.name}
            />
            <h3>{game.name}</h3>
          </button>
        ))}
      </div>
    </section>
  );
}
