import React,{useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  // const dummyMovies = [
  //   {
  //     id: 1,
  //     title: 'Some Dummy Movie',
  //     openingText: 'This is the opening text of the movie',
  //     releaseDate: '2021-05-18',
  //   },
  //   {
  //     id: 2,
  //     title: 'Some Dummy Movie 2',
  //     openingText: 'This is the second opening text of the movie',
  //     releaseDate: '2021-05-19',
  //   },
  // ];
  const [movies,setMovies] =  useState([]);
  async function fetchMoviesHandler(){
    const response = await fetch('https://swapi.dev/api/films/')
    const data = await response.json();
      const tranformedMovies = data.results.map(movie=>{
        return {id : movie.episode_id,
        title : movie.title,
        openingText : movie.opening_crawl,
       releaseDate : movie.release_date};
      })
      // setMovies(data.results);
      setMovies(tranformedMovies);

  }

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;