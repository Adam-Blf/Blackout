import React, { useState, useEffect } from 'react';
import Host from './components/Host';
import Player from './components/Player';
import AgeVerification from './components/AgeVerification';

function App() {
  const [roomCode, setRoomCode] = useState(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room) {
      setRoomCode(room);
    }
  }, []);

  if (!isVerified) {
    return <AgeVerification onVerified={() => setIsVerified(true)} />;
  }

  if (roomCode) {
    return <Player roomCode={roomCode} />;
  }

  return <Host />;
}

export default App;


