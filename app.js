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
app.get("/order", (req, res) => {
  res.render("order");
});
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
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
    pickup_address: "11 Madison Ave, New York, NY 10010",
    pickup_phone_number: "+1(650)5555555",
    pickup_business_name: "Top Clothing",
    dropoff_address: `${req.body.street}, ${req.body.city}, ${req.body.zipcode}`,
    dropoff_phone_number: req.body.dropoff_phone_number,
    dropoff_contact_given_name: req.body.dropoff_contact_given_name,
    dropoff_contact_family_name: req.body.dropoff_contact_family_name,
    order_value: req.body.order_value,
  });
  res.send(response);
  console.log("QUOTE", response);
});

app.post("/create-delivery", async (req, res) => {
  const client = new DoorDashClient({
    developer_id: process.env.DEVELOPER_ID,
    key_id: process.env.KEY_ID,
    signing_secret: process.env.SIGNING_SECRET,
  });

  const response = await client.deliveryQuoteAccept(
    "53b314ca-c95f-49b5-9625-9ae347428aac"
  );
  const clothingTotal = (response.data.order_value / 100).toFixed(2);
  const feeTotal = (response.data.fee / 100).toFixed(2);
  const orderTotal = Number(clothingTotal) + Number(feeTotal);

  const data = {
    clothingTotal: clothingTotal,
    feeTotal: feeTotal,
    orderTotal: orderTotal,
  };

  res.render("order", {
    clothingTotal: data.clothingTotal,
    feeTotal: data.feeTotal,
    orderTotal: data.orderTotal,
  });
});
