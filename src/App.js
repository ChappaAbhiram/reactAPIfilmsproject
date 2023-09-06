import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false); // Track retrying state

  useEffect(() => {
    if (retrying) {
      const retryTimer = setInterval(fetchMoviesHandler, 5000); // Retry every 5 seconds

      return () => {
        clearInterval(retryTimer); // Clear the interval when retrying is stopped
      };
    }
  }, [retrying]);

  const  fetchMoviesHandler=useCallback(async ()=>{
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('https://swapi.dev/api/films/');
      if (!response.ok) {
        throw new Error('Something went wrong ....Retrying');
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movie) => {
        return{
        id: movie.episode_id,
        title: movie.title,
        openingText: movie.opening_crawl,
        releaseDate: movie.release_date,
      };
    });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      setRetrying(true); // Enable retrying when an error occurs
    }
      setIsLoading(false);
  },[])
  useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

  function handleCancelRetry() {
    setRetrying(false); // Stop retrying
  }

  let content = <p>Found No Movies</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = (
      <div>
        <p>{error}</p>
        {retrying && <button onClick={handleCancelRetry}>Cancel Retry</button>}
      </div>
    );
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
