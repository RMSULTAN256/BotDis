import { Client, GatewayIntentBits } from 'discord.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const DISCORD_TOKEN = "TOKEN_DISCORD"; // Your Discord bot token
const genAI = new GoogleGenerativeAI("API_KEY"); // Your Gemini API key
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Select the model

// Event listener for messages
client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // Ignore bot messages

  // Check if the message starts with "!ask"
  if (message.content.startsWith('!ask')) {
    const question = message.content.replace('!ask', '').trim();

    if (!question) {
      return message.channel.send('Please ask a question after the command.');
    }

    try {
      // Call the Gemini API
      const result = await model.generateContent(question);
      console.log('AI Response:', result); // Log the full response

      // Check for errors in the response
      if (result.error) {
        console.error('AI API Error:', result.error);
        return message.channel.send('Error from AI: ' + result.error.message);
      }

      const responseText = typeof result.response.text === 'string' 
        ? result.response.text 
        : JSON.stringify(result.response); // Convert to string if it's not

      // Send the generated content to the Discord channel
      message.channel.send(responseText);
    } catch (error) {
      console.error('Error fetching response from Gemini API:', error);
      message.channel.send('Sorry, there was an error contacting the AI API.');
    }
  }
});

// Log in to Discord
client.login(DISCORD_TOKEN);
