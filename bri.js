const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

require("dotenv").config();
const bgErase = require("./services/bgErase.js");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.urlencoded({
  extended: true
}));

const generatePersonalityResponse = require('./services/chatgpt.js')

app.post('/message', async (req, res) => {
    const aiResponse = await generatePersonalityResponse(req.body.Body, req.body.From)
    const twiml = new MessagingResponse();
    twiml.message(aiResponse);
    res.type('text/xml').send(twiml.toString());
});


app.post("/message", async (req, res) => {
  const { From: from, Body } = req.body;

  if (Body && Body.startsWith("#img")) {
    const imageUrl = Body.replace("#img", "").trim();
    await bgErase(imageUrl, from);

    const twiml = new MessagingResponse();
    twiml.message("Ne quittez pas ! Clever fait son travail...");
    res.type("text/xml").send(twiml.toString());
  } else {
    const twiml = new MessagingResponse();
    twiml.message("Invalid command. Start your message with #img.");
    res.type("text/xml").send(twiml.toString());
  }
});

app.post("/messageEnd/:to", async (req, res) => {
  const { to } = req.params;
  const { output: editedImageUrl } = req.body;

  const decodedImageUrl = decodeURIComponent(editedImageUrl);

  const twiml = new MessagingResponse();
  twiml.message().media(decodedImageUrl);

  await client.messages.create({
    mediaUrl: decodedImageUrl,
    from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
    to,
  });

  res.sendStatus(200);
});

const { MessagingResponse } = require("twilio").twiml;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = require("twilio")(accountSid, authToken);
const ngrok = require("ngrok");

app.listen(3000, () => {
  console.log("Server is listening on port 3000");

  (async function () {
    const url = await ngrok.connect(3000);
    process.env["NGROK_URL"] = url;
    console.log(`Ngrok URL: ${url}`);
  })();
});
