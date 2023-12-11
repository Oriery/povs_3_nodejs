import http from "http";
import WebSocket from "ws";

const PORT = process.env.WSS_PORT || 5050;

let server = http.createServer();
const connections = new Set<WebSocket>();

const wss = new WebSocket.Server({ server });

export type WsMessage = {
  type: "ping" | "log" | "info" | "pong" | "error" | "message";
  message: string;
};

export function setWsCallbacks(
  onConnection: () => void,
  onMessage: (message: WsMessage) => void
) {
  wss.on("connection", (ws) => {
    onConnection();
    ws.on("message", (message) => {
      const messageString = message.toString();
      onMessage && onMessage(JSON.parse(messageString) as WsMessage);
    });
    connections.add(ws);

    ws.on("close", () => {
      connections.delete(ws);
    });
  });
}

server.listen(PORT, () => {
  console.log(`WS server is listening on port ${PORT}`);
});

export function broadcast(message: WsMessage) {
  connections.forEach((conn) => {
    conn.send(JSON.stringify(message));
  });
}
