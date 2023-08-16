app.post("/message", async (req, res) => {
  const { From: from, Body } = req.body;
  let twimlResponse = new MessagingResponse();

  if (Body && Body.startsWith("#llm")) {
    const prompt = Body.replace("#llm", "").trim();
    await llamaMessage(prompt, from);

    const twiml = new MessagingResponse();
    twiml.message("Llama is working on it...");
    res.type("text/xml").send(twiml.toString());
  } else if (Body && Body.startsWith("#img")) {
    const imageUrl = Body.replace("#img", "").trim();
    await bgErase(imageUrl, from);

    const twiml = new MessagingResponse();
    twiml.message("Ne quittez pas! Clever y travaille...");
    res.type("text/xml").send(twiml.toString());
  } else {
    const twiml = new MessagingResponse();
    twiml.message("Invalid command. Start your message with #llm or #bgErase.");
    res.type("text/xml").send(twiml.toString());
  } // Envoi unique de la réponse
});
