import { io, Socket } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getSocket = (userId: string): Socket => {
  return io(socketUrl, {
    query: { userId }
  });
};
