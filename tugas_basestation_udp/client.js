const dgram = require("dgram");
const Robot = require("./class/robot.js");
const client = dgram.createSocket("udp4");

const MULTICAST_ADDRESS = "239.255.255.250";
const PORT = 12345;

client.on("listening", () => {
  client.addMembership(MULTICAST_ADDRESS);
  const address = client.address();
  console.log(`Client listening on ${address.address}:${address.port}`);
});

const ROBOT = [
  new Robot(1, 10, 20, 192, 193, 99),
  new Robot(2, 20, 22, 200, 202, 220),
];

function writeDataBufferRobot2Bs(index_robot) {
  let data = Buffer.allocUnsafe(100);
  const Robot = ROBOT[index_robot];

  data.write("i", 0);
  data.write("t", 1);
  data.write("s", 2);
  data.write(`${Robot.id}`, 3);

  let byte_counter = 4;
  byte_counter = data.writeBigInt64LE(
    BigInt(new Date().getSeconds()),
    byte_counter
  );

  // console.log(byte_counter);
  byte_counter = 12;
  byte_counter = data.writeInt16LE(Robot.bola_x, byte_counter); //bola_x
  byte_counter = data.writeInt16LE(Robot.bola_y, byte_counter); //bola_y

  byte_counter = data.writeInt16LE(Robot.pos_x, byte_counter); //pos_x
  byte_counter = data.writeInt16LE(Robot.pos_y, byte_counter); //pos_y
  byte_counter = data.writeInt16LE(Robot.pos_theta, byte_counter); //pos_theta

  return data;
}
setInterval(() => {
  for (i = 0; i < ROBOT.length; i++) {
    const message = writeDataBufferRobot2Bs(i);

    client.send(message, PORT, MULTICAST_ADDRESS, (err) => {
      if (err) {
        console.error("Error sending message:", err);
      } else {
        console.log("Message sent successfully.");
      }
    });
  }
}, 500);
