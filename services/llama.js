const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

module.exports = async function llamaMessage(prompt, to) {
  try {
    const prediction = await replicate.predictions.create({
      version: "58d078176e02c219e11eb4da5a02a7830a283b14cf8f94537af893ccff5ee781",
      input: {
        prompt: "..."
      },
      webhook: `${process.env.NGROK_URL}/messageEnd/${to}`,
      webhook_events_filter: ["completed"],
    });

    console.log("Prediction:", prediction);
  } catch (error) {
    console.error("Error:", error);
  }
};
