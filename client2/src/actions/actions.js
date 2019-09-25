/*
Actions define the type of change that will be performed on the data.
They can be called from anywhere within the application.
Data is packed into an Action object literal that contains the action type and
the new field of data. An action changes the state by changing the according property.
*/

// initializes the movies list
export const SET_MOVIES = 'SET_MOVIES';
// sets search filter based on value
export const SET_FILTER = 'SET_FILTER';
// sets sort filter
export const SET_SORT_COLUMN = 'SET_SORT_COLUMN';
// sets users profile
export const SET_LOGGEDIN_USER = 'SET_LOGGEDIN_USER';

export function setMovies(value) {
  return { type: SET_MOVIES, value };
}

export function setFilter(value) {
  return { type: SET_FILTER, value };
}

export function setSortColumn(value) {
  return { type: SET_SORT_COLUMN, value };
}

export function setLoggedInUser(value) {
  return { type: SET_LOGGEDIN_USER, value }
}