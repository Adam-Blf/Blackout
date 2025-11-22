import React, { useState, useEffect } from 'react';
import Host from './components/Host';
import Player from './components/Player';

function App() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      setRoomCode(room);
    }
  }, []);

  if (roomCode) {
    return <Player roomCode={roomCode} />;
  }

  return <Host />;
}

export default App;


