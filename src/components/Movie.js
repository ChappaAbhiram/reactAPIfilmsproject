import React from 'react';

import classes from './Movie.module.css';

const Movie = (props) => {
  const handleDeleteMovie = (movieId) => {
    props.onDeleteMovie(movieId); // Pass the movie ID to the parent component for deletion
  };
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={() => handleDeleteMovie(props.id)}>Delete Movie</button>
    </li>
  );
};

export default Movie;
