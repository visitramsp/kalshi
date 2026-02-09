"use client";

import { useEffect } from "react";
import socket from ".";

export default function SocketProvider({ children }) {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  return children; // UI kuch render nahi karta
}
