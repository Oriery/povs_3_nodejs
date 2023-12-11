import http from "http";
import WebSocket from "ws";

const PORT = process.env.WSS_PORT || 5050;

let server = http.createServer();

const wss = new WebSocket.Server({ server });

export type WsMessage = {
  type: "ping" | "log" | "info" | "pong" | "error" | "message";
  message: string;
};

export async function setWsCallbacks(
  onConnection: () => void,
  onMessage: (message: WsMessage) => void
) : Promise<WebSocket> {
  const promise = new Promise<WebSocket>((resolve, reject) => {
    wss.on("connection", (ws) => {
      onConnection();
      ws.on("message", (message) => {
        const messageString = message.toString();
        onMessage && onMessage(JSON.parse(messageString) as WsMessage);
      });
      resolve(ws);
    });
  });

  return promise;
}

server.listen(PORT, () => {
  console.log(`WS server is listening on port ${PORT}`);
});
