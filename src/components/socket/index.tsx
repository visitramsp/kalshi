import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "http://api.opinionkings.com";
const SOCKET_URL = "http://192.168.29.218:3000";

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false,
});
export default socket;

// socket.ts
// import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "http://192.168.29.218:3000";

// const socket: Socket = io(SOCKET_URL, {
//   transports: ["websocket"],
//   autoConnect: false,
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

// export default socket;
