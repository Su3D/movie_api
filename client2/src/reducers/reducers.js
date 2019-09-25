/*
A Store is defined by it's reducer.
A reducer takes a previous state and an action and returns a new state.
*/

import { combineReducers } from 'redux';

//add additional actions UPDATE_PROFILE, DELETE_PROFILE, see end of file
import { SET_MOVIES, SET_FILTER, SET_SORT_COLUMN, SET_LOGGEDIN_USER } from '../actions/actions';

// this reducer changes the visibility property of the state
function visibilityFilter(state = '', action) {
  switch (action.type) {
    case SET_FILTER:
      return action.value;
    default:
      return state;
  }
}

// this reducer changes the sorting order of the movies
function sortColumn(state = 'Title', action) {
  switch (action.type) {
    case SET_SORT_COLUMN:
      return action.value;
    default:
      return state;
  }
}

// this reducer shows the movies
function movies(state = [], action) {
  switch (action.type) {
    case SET_MOVIES:
      return action.value;
    default:
      return state;
  }
}

// this is a test reducers 
function loggedInUser(state = [], action) {
  switch (action.type) {
    case SET_LOGGEDIN_USER:
      return action.value;
    default:
      return state;
  }
}

// 'combined reducer' groups all single reducers
const moviesApp = combineReducers({
  visibilityFilter,
  sortColumn,
  movies,
  loggedInUser
});

export default moviesApp;