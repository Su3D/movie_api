import React from 'react';
import ReactDOM from 'react-dom';

import { MainView } from './components/main-view/main-view';

//import statement to indicate that we need to bundle `./index.scss`
import './index.scss';

//main component (will eventually use all the others)
class MovieListApplication extends React.Component {
  render() {
    return <MainView />;
  }
}

//find the root of app
const container = document.getElementsByClassName('app-container')[0];

//tell React to render app in the root DOM element
ReactDOM.render(React.createElement(MovieListApplication), container);
