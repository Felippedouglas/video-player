import React, { useEffect } from "react";
import Player from "./components/player";

import VideoExample from './components/media/exemplo-720p.mp4'

const App = () => {

  return (
    <>
      <Player
        title={'NATURE IN MOVEMENT'}
        description={'Description - 720p'}
        src={VideoExample}
      />
    </>
  );
};

export default App;
