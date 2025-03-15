import { Client, Events, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

let workStartTime = 0;
let breakStartTime = 0;
let totalTimeWorked = 0;

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user?.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot) return;

  const content = message.content.toLowerCase();

  if (content === "inicio trabajo") {
    workStartTime = Date.now();
    totalTimeWorked = 0; // Reset timer.
    message.reply("¡Tiempo de trabajo iniciado!");
  } else if (content === "empiezo descanso" && workStartTime) {
    breakStartTime = Date.now();
    totalTimeWorked += breakStartTime - workStartTime;
    message.reply("¡Disfruta tu descanso!");
  } else if (content === "termino descanso" && breakStartTime) {
    workStartTime = Date.now();
    breakStartTime = 0;
    message.reply("¡De vuelta al trabajo!");
  } else if (content === "terminar trabajo" && workStartTime) {
    totalTimeWorked += Date.now() - workStartTime;
    workStartTime = 0;

    const hoursWorked = (totalTimeWorked / (1000 * 60 * 60)).toFixed(2); // get hours as decimal
    const user = message.author.tag;

    // send data to API to the spreadsheet
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

// send data to api function
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