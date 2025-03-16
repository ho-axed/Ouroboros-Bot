import { Client, Events, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const userWorkData = {}; // object to save every user data

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user?.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();
  const userId = message.author.id; // User id

  if (!userWorkData[userId]) {
    // Initialize user if it doesn't exist
    userWorkData[userId] = {
      workStartTime: 0,
      breakStartTime: 0,
      totalTimeWorked: 0,
    };
  }

  const userData = userWorkData[userId];

  if (content === "inicio trabajo") {
    userData.workStartTime = Date.now();
    userData.totalTimeWorked = 0; // reset timer
    message.reply("¡Tiempo de trabajo iniciado!");
  } else if (content === "empiezo descanso" && userData.workStartTime) {
    userData.breakStartTime = Date.now();
    userData.totalTimeWorked += userData.breakStartTime - userData.workStartTime;
    message.reply("¡Disfruta tu descanso!");
  } else if (content === "termino descanso" && userData.breakStartTime) {
    userData.workStartTime = Date.now();
    userData.breakStartTime = 0;
    message.reply("¡De vuelta al trabajo!");
  } else if (content === "terminar trabajo" && userData.workStartTime) {
    userData.totalTimeWorked += Date.now() - userData.workStartTime;
    userData.workStartTime = 0;

    const hoursWorked = (userData.totalTimeWorked / (1000 * 60 * 60)).toFixed(2); // get hours in decimal
    const user = message.author.tag;

    // Send data
    const result = await sendToApi(user, hoursWorked);

    if (result.success) {
      message.reply(
        `Trabajo finalizado. Total trabajado: ${hoursWorked} horas. Datos guardados exitosamente.`
      );
    } else {
      message.reply(
        `Trabajo finalizado. Total trabajado: ${hoursWorked} horas. Hubo un error al guardar los datos.`
      );
    }
  }
});

// Send data to API Function
async function sendToApi(user, hoursWorked) {
  const apiUrl = process.env.API_URL;

  try {
    const response = await fetch(`${apiUrl}?action=write&path=Sheet1&Users=${encodeURIComponent(user)}&HoursWorked=${encodeURIComponent(hoursWorked)}`);
    const result = await response.text();
    return { success: response.ok, message: result };
  } catch (error) {
    console.error("Error al enviar datos a la API:", error);
    return { success: false, message: error.message };
  }
}

client.login(process.env.DISCORD_BOT_TOKEN);
