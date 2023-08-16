
const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

require("dotenv").config();
const bgErase = require("./services/bgErase.js");
const genvideos = require("./services/genvideos.js");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));  // Augmentez la limite de taille à 10 Mo (ou la valeur souhaitée)
app.use(bodyParser.urlencoded({ extended: false }));

const generatePersonalityResponse = require('./services/chatgpt.js')




app.post("/message", async (req, res) => {
  const { From: from, Body } = req.body;

  if (Body && (Body.startsWith("#llm") || Body.startsWith("#img") || Body.startsWith("#vid"))) {
    // Handle #llm or #img commands here
    if (Body.startsWith("#llm")) {
      const prompt = Body.replace("#llm", "").trim();
      await llamaMessage(prompt, from);

      const twiml = new MessagingResponse();
      twiml.message("Llama is working on it...");
      res.type("text/xml").send(twiml.toString());
    } else if (Body.startsWith("#img")) {
      const imageUrl = Body.replace("#img", "").trim();
      await bgErase(imageUrl, from);

      const twiml = new MessagingResponse();
      twiml.message("Ne quittez pas! Clever y travaille...");
      res.type("text/xml").send(twiml.toString());
    } else if (Body.startsWith("#vid")) {
      const prompt = Body.replace("#vid", "").trim(); // Obtenir le prompt depuis le message
      await genvideos(prompt, from); // Utiliser le prompt pour générer la vidéo
    
      const twiml = new MessagingResponse();
      twiml.message("Ne quittez pas! Clever y travaille...");
      res.type("text/xml").send(twiml.toString());
    }
  } else {
    // Regular message, not a #llm or #img command
    const aiResponse = await generatePersonalityResponse(Body, from);

    const twiml = new MessagingResponse();
    twiml.message(aiResponse);
    res.type('text/xml').send(twiml.toString());
  }
});


app.post("/messageEnd/:to", async (req, res) => {
    const { to } = req.params;
    const { output: editedImageUrl } = req.body;
  
    const decodedImageUrl = decodeURIComponent(editedImageUrl); // Décode l'URL
  
    const twiml = new MessagingResponse();
    twiml.message().media(decodedImageUrl); // Utilise l'URL décodée
  
    await client.messages.create({
      mediaUrl: decodedImageUrl,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to,
    });
  
    res.sendStatus(200);
  });
  ;


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
