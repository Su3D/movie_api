import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import MainView from './components/main-view/main-view';
import moviesApp from './reducers/reducers';

//import statement to indicate that we need to bundle ./index.scss
import './index.scss';

const store = createStore(moviesApp);

//main component (will eventually use all the others)
class MovieListApplication extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

//find the root of our app
const container = document.getElementsByClassName('app-container')[0];

//tell React to render our app in the root DOM element
ReactDOM.render(React.createElement(MovieListApplication), container);
