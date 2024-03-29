import dotenv from "dotenv";
dotenv.config();
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { setWsCallbacks, broadcast } from "./ws";
import type { WsMessage } from "./ws";
import type { WebSocket } from "ws";

SerialPort.list().then((ports) => {
  ports.forEach((port) => {
    console.log(port);
  });
});

// Create a port
const port = new SerialPort({
  path: "COM5",
  baudRate: 115200,
});

const parser = new ReadlineParser();
port.pipe(parser);

port.on("error", function (err) {
  //console.error('Error: ', err.message)
  throw err;
});

/*
port.on('open', function() {
  write('Hi, Serial port')
})
*/

parser.on("data", function (data) {
  //console.log(data);
  broadcast({ type: "message", message: data });
});

function write(data: string) {
  port.write(data, function (err) {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
    console.log(`message written: ${data}`);
  });
}

setWsCallbacks(
  () => {
    //console.log("WS client connected");
  },
  (message) => {
    console.log("WS message: ", message);
    onIncomingWs(message);
  }
);

function onIncomingWs(msg: WsMessage) {
  console.log("received ws message of type: %s", msg.type);

  switch (msg.type) {
    case "ping":
      broadcast({ type: "pong", message: "pong" });
      break;
    case "log":
      console.log("log: %s", msg.message);
      break;
    case "info":
      console.log("log: %s", msg.message);
      break;
    case "error":
      throw new Error(msg.message);
    case "message":
      write(msg.message);
      break;
    case "pong":
      console.log("pong: ", performance.now());
      break;
    default:
      throw new Error("unknown message type: " + msg.type);
  }
}
