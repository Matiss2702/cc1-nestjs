import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('✅ Connected', socket.id);

  socket.emit('sendMessage', {
    content: 'Hello from test',
    senderId: 'eb377e99-1e85-4f1f-974e-e00d10076323',
  });
});

socket.on('message', (msg) => {
  console.log('📨 New message:', msg);
});
