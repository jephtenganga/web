const Replicate = require("replicate");

class StebleAPI {
  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });
  }

  async generateImage(prompt, to) {
    const prediction = await this.replicate.predictions.create({
      version: "a00d0b7dcbb9c3fbb34ba87d2d5b46c56969c84a628bf778a7fdaec30b1b99c5",
      input: {
        prompt,
      },
      webhook: `${process.env.NGROK_URL}/messageEnd/${to}`,
      webhook_events_filter: ["completed"]
    });

    return prediction.output.url; // Assuming the output URL field contains the image URL
  }
}

module.exports = StebleAPI;
