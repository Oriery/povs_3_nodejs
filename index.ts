import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

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

const parser = new ReadlineParser()
port.pipe(parser)

port.on('error', function(err) {
  //console.error('Error: ', err.message)
  throw err
})

port.on('open', function() {
  write('Hi, Serial port')
})

parser.on('data', function (data) {
  console.log(data)
})

function write(data : string) {
  port.write(data, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message)
    }
    console.log('message written')
  })
}
