import React from 'react';
import ReactDOM from 'react-dom';
import Video from './Components/Video';

const App = () => (
  <div>
    <Video videoData="/data/videodata.json" />
  </div>
);
ReactDOM.render(<App />, document.getElementById('app'));
