const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

module.exports = async function bgErase(prompt, to) {
  await replicate.predictions.create({
    version: "629a9fe82c7979c1dab323aedac2c03adaae2e1aecf6be278a51fde0245e20a4",
    input: {
      prompt: prompt,
      negative_prompt: "painted illustration", // Ajout du paramètre negative_prompt
      width: 768, // Ajout du paramètre width
      num_inference_steps: 20, // Ajout du paramètre num_inference_steps
      guidance_scale: 7, // Ajout du paramètre guidance_scale
    },
    webhook: `${process.env.NGROK_URL}/messageEnd/${to}`,
    webhook_events_filter: ["completed"],
  });
};
