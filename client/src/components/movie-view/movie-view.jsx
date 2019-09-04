import React from 'react';

export class MovieView extends React.Component {
  constructor() {
    //call the superclass constructor so React can initialize it
    super();
    //initialize the state to an empty object so it can destructured later
    this.state = {};
  }
  render() {
    const { movie, onClick } = this.props;
    if (!movie) return null;

    const backButtonHandler = () => {
      window.open('/', '_self');
    }

    return (
      <div className="movie-view">
        <img className="movie-poster" src={movie.ImagePath} />
        <div className="movie-title">
          <div className="label">Title</div>
          <div className="value">{movie.Title}</div>
        </div>
        <div className="movie-year">
          <div className="label">Year</div>
          <div className="value">{movie.Year}</div>
        </div>
        <div className="movie-description">
          <div className="label">Description</div>
          <div className="value">{movie.Description}</div>
        </div>
        {/*<div className="movie-genre">
          <div className="label">Genre</div>
          <div className="value">{movie.Genre._id}</div>
        </div> */}
        <div className="movie-director">
          <div className="label">Director</div>
          <div className="value">{movie.Director.Name}</div>
        </div>
        <button onClick={backButtonHandler} className="back-button">Back to Movie List</button>
      </div>
    );
  }
}