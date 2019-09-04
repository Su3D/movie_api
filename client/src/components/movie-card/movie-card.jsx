import React from 'react';

export class MovieCard extends React.Component {
  render() {
    //this is given to the <MovieCard/> component by MainView which is what’s connected to the database via the movies endpoint of the API
    const { movie, onClick } = this.props;

    return (
      <div onClick={() => onClick(movie)} className="movie-card">{movie.Title}</div>
    );
  }
}