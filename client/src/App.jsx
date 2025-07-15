import { useEffect, useState } from 'react';
import { socket } from './socket';

function App() {
  const [username, setUsername] = useState('');
  const [typing, setTyping] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [online, setOnline] = useState([]);

  useEffect(() => {
    socket.on('receive-message', (msg) => setChat((prev) => [...prev, msg]));
    socket.on('typing', (name) => setTyping(`${name} is typing...`));
    socket.on('online-users', setOnline);
    return () => {
      socket.off();
    };
  }, []);

  const handleJoin = () => {
    socket.emit('join', username);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send-message', { text: message, sender: username });
      setMessage('');
      setTyping('');
    }
  };

  return (
    <div className=''>
      {!username ? (
        <div>
          <input placeholder="Enter name" onChange={e => setUsername(e.target.value)} />
          <button onClick={handleJoin}>Join Chat</button>
        </div>
      ) : (
        <div className='manin'>
            <h2>Welcome to My Sockeio App</h2>
          <h2>Welcome, {username}</h2>
          <div>Online: {online.join(', ')}</div>
          <div style={{ height: 200, overflowY: 'scroll' }}>
            {chat.map((m, i) => (
              <div key={i}><strong>{m.sender}</strong>: {m.text} <small>{new Date(m.time).toLocaleTimeString()}</small></div>
            ))}
          </div>
          <p>{typing}</p>
          <input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              socket.emit('typing', username);
            }}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}
export default App;
