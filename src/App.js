import React, { useState, useEffect, useCallback } from 'react';
import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

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
      const response = await fetch('https://react-http-b7373-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong ....Retrying');
      }
      const data = await response.json();
      const storedmovies = [];
      for(const key in data){
        storedmovies.push({
          id : key,
          title : data[key].title,
          openingText : data[key].openingText,
          releaseDate : data[key].releaseDate,
        })
      }
    //   const transformedMovies = data.map((movie) => {
    //     return{
    //     id: movie.episode_id,
    //     title: movie.title,
    //     openingText: movie.opening_crawl,
    //     releaseDate: movie.release_date,
    //   };
    // });
      setMovies(storedmovies);
    } catch (error) {
      setError(error.message);
      setRetrying(true); // Enable retrying when an error occurs
    }
      setIsLoading(false);
  },[])
  useEffect(()=>{
    fetchMoviesHandler();
  },[fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-http-b7373-default-rtdb.firebaseio.com/movies.json',{
      method : 'POST',
      body : JSON.stringify(movie),
      headers : {
        'Content-Type' : 'application/json'
      }
    });
    const data = await response.json();
    console.log(data);
    setMovies((prevMovies) => [...prevMovies, { ...movie, id: data.name }]);
    setRetrying(false);
  }
  async function deleteMovieHandler(movieId) {
    try {
      const response = await fetch(`https://react-http-b7373-default-rtdb.firebaseio.com/movies/${movieId}.json`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete movie');
      }

      // Update the movie list by filtering out the deleted movie
      setMovies((prevMovies) => prevMovies.filter((movie) => movie.id !== movieId));
    } catch (error) {
      console.error(error);
    }
  }


  function handleCancelRetry() {
    setRetrying(false); // Stop retrying
  }

  let content = <p>Found No Movies</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies}  onDeleteMovie={deleteMovieHandler}/>;
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
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
