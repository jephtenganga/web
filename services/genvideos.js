const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

module.exports = async function genvideos(prompt, to) {
  await replicate.predictions.create({
    version: "d80e8dbe5885d570087b782ff22cef888dcc1be7941a52c8ba82c7c9d884d845",
    input: {
      prompts: prompt, // Ajout du paramètre prompt
      num_steps: 100, // Ajout du paramètre negative_prompt
      fps: 30, // Ajout du paramètre width
      num_inference_steps: 40, // Ajout du paramètre num_inference_steps
      guidance_scale: 7, // Ajout du paramètre guidance_scale
    },
    webhook: `${process.env.NGROK_URL}/messageEnd/${to}`,
    webhook_events_filter: ["completed"],
  });
};
