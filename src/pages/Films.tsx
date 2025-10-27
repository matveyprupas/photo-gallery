import { useState, useEffect } from 'react';

interface Film {
  title: string;
  episode_id: number;
  release_date: string;
  director: string;
}

export default function Films() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://swapi.dev/api/films/')
      .then((response) => response.json())
      .then((data) => {
        setFilms(data.results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to fetch films');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="films-page">
      <h2>Star Wars Films</h2>

      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {films && films.length > 0 && (
        <div className="films-grid">
          {films.map((film) => (
            <div key={film.episode_id} className="film-card">
              <h3>{film.title}</h3>
              <p>Episode: {film.episode_id}</p>
              <p>Director: {film.director}</p>
              <p>Release Date: {film.release_date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
