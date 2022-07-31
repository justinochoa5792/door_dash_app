import express from "express";
import { DoorDashClient } from "@doordash/sdk";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import "dotenv/config";
const port = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/frontend"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, (err) => {
  if (err) {
    return console.log("err", err);
  }
  console.log(`app listening on port ${port}`);
});

app.post("/get-delivery-rate", async (req, res) => {
  const client = new DoorDashClient({
    developer_id: process.env.DEVELOPER_ID,
    key_id: process.env.KEY_ID,
    signing_secret: process.env.SIGNING_SECRET,
  });

  const response = await client.deliveryQuote({
    external_delivery_id: uuidv4(),
    pickup_address: "1000 4th Ave, Seattle, WA, 98104",
    pickup_phone_number: "+1(650)5555555",
    dropoff_address: "1201 3rd Ave, Seattle, WA, 98101",
    dropoff_phone_number: "+1(650)5555555",
  });
  res.send(response);
});

app.post("/create-delivery", async (req, res) => {
  const client = new DoorDashClient({
    developer_id: process.env.DEVELOPER_ID,
    key_id: process.env.KEY_ID,
    signing_secret: process.env.SIGNING_SECRET,
  });

  const response = await client.deliveryQuoteAccept(
    "dab2c1df-47c5-4a2d-87bf-4524317cd567"
  );
  res.send(response);
});
