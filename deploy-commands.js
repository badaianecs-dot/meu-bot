const { REST, Routes } = require("discord.js");
require("dotenv").config();

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("🗑️ Limpando todos os comandos...");

    // Se quiser limpar apenas no servidor (comandos de guild)
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: [],
    });

    // Se quiser limpar também os globais (opcional)
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });

    console.log("✅ Todos os comandos foram removidos!");
  } catch (error) {
    console.error(error);
  }
})();
