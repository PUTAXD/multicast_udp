const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const MULTICAST_ADDRESS = "239.255.255.250";
const PORT = 12345;

client.on("listening", () => {
  client.addMembership(MULTICAST_ADDRESS);
  const address = client.address();
  console.log(`Client listening on ${address.address}:${address.port}`);
});

const robot2 = {
  id: 2,
  bola_x: 10,
  bola_y: 11,
  pos_x: 192,
  pos_y: 193,
  pos_theta: 99,
};

const jsonMessage = JSON.stringify(robot2);
const message = Buffer.from(jsonMessage);

client.send(message, PORT, MULTICAST_ADDRESS, (err) => {
  if (err) {
    console.error("Error sending message:", err);
  } else {
    console.log("Message sent successfully.");
  }
  client.close();
});
