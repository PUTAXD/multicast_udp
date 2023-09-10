const { timeStamp } = require("console");
const dgram = require("dgram");
const server = dgram.createSocket("udp4");
const Online = require("./class/online.js");

const MULTICAST_ADDRESS = "239.255.255.250";
const PORT = 12345;

let ONLINE = [new Online(false, 0), new Online(false, 0)];

server.on("listening", () => {
  server.addMembership(MULTICAST_ADDRESS);
  const address = server.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});

server.on("message", (message, rinfo) => {
  let recv_data = {};
  recv_data.headers = [
    String.fromCharCode(message[0]),
    String.fromCharCode(message[1]),
    String.fromCharCode(message[2]),
  ];

  let byte_counter = 3;
  recv_data.id = String.fromCharCode(message[byte_counter]);

  byte_counter = 4;
  recv_data.sec = message.readUInt8(byte_counter);

  // bola;
  byte_counter = 12;
  recv_data.bola_x = message.readUInt16LE(byte_counter);
  byte_counter += 2;
  recv_data.bola_y = message.readInt16LE(byte_counter);

  //pos
  byte_counter += 2;
  recv_data.pos_x = message.readInt16LE(byte_counter); //pos_x
  byte_counter += 2;
  recv_data.pos_y = message.readInt16LE(byte_counter); //pos_y
  byte_counter += 2;
  recv_data.pos_theta = message.readInt16LE(byte_counter); //pos_theta

  switch (recv_data.id) {
    case "1":
      ONLINE[0].stats = true;
      ONLINE[0].time = recv_data.sec;
      break;
    case "2":
      ONLINE[1].stats = true;
      ONLINE[1].time = recv_data.sec;
      break;
    default:
      break;
  }
  // console.log(recv_data);
});

ballGlobalFunction = function (object) {
  bola_globalx = object.pos_x + object.bola_x;
  bola_globaly = object.pos_y + object.bola_x;
  return [bola_globalx, bola_globaly];
};

setInterval(() => {
  let timeBs = new Date().getSeconds();
  let time_out = 5;
  if (timeBs - ONLINE[0].time >= time_out) {
    ONLINE[0].stats = false;
  }
  if (timeBs - ONLINE[1].time >= time_out) {
    ONLINE[1].stats = false;
  }
}, 200);

setInterval(() => {
  console.log("1 : " + ONLINE[0].stats + " " + ONLINE[1].time);
  console.log("2 : " + ONLINE[1].stats + " " + ONLINE[1].time);
}, 1000);

server.bind(PORT);
