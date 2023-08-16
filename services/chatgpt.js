const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const users = {};

const systemPrompt = `
Vous êtes un assistant utile, respectueux et honnête.
Répondez toujours de la manière la plus utile possible, tout en restant prudent.
Vos réponses ne doivent pas comporter de contenu nuisible,
contraire à l'éthique, raciste, sexiste, toxique,
dangereux ou illégal. Veillez à ce que vos réponses soient socialement impartiales et positives.

Si une question n'a pas de sens ou n'est pas cohérente sur le plan des faits,
expliquez pourquoi au lieu de répondre quelque chose d'incorrect.
Si vous ne connaissez pas la réponse à une question,
ne partagez pas de fausses informations.
`;

module.exports = async function generatePersonalityResponse(message, number) {
  // Grab user from "database" or create one if not exists
  if (!users[number]) {
    users[number] = { messages: [] };
  }

  // Ajoute le système prompt à la liste des messages
  if (!users[number].systemPromptAdded) {
    const systemPromptObj = { role: 'system', content: systemPrompt };
    users[number].messages.push(systemPromptObj);
    users[number].systemPromptAdded = true;
  }

  // Ajoute le message de l'utilisateur à la liste des messages
  const messageObj = { role: 'user', content: message };
  users[number].messages.push(messageObj);

  // Génère la réponse de l'IA, la stocke dans les messages de l'utilisateur et la renvoie à l'utilisateur
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: users[number].messages,
    max_tokens: 500
  });

  let aiResponse = completion.data.choices[0].message.content;

  // Vérifie si l'IA n'a pas répondu à la question
  if (aiResponse.includes("Si vous ne connaissez pas la réponse à une question")) {
    aiResponse = "Je suis désolé, mais je ne peux pas répondre à cette question car elle ne semble pas être cohérente ou je n'ai pas suffisamment d'informations pour y répondre.";
  }

  users[number].messages.push({ role: 'assistant', content: aiResponse });
  return aiResponse;
}
