const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config();
const express = require("express");

// ---------------- CLIENTE ----------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

// ---------------- SERVIDOR EXPRESS ----------------
const app = express();
app.get("/", (req, res) => res.send("Bot rodando!"));
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🌐 Servidor web ativo na porta ${PORT}`));

// ---------------- COR PADRÃO ----------------
const COLOR_PADRAO = "#2b2d31";

// ---------------- COMANDOS ----------------
const commands = [
  new SlashCommandBuilder()
    .setName("aviso")
    .setDescription("Envia um aviso com botão"),
  new SlashCommandBuilder()
    .setName("evento")
    .setDescription("Envia um evento"),
  new SlashCommandBuilder()
    .setName("atualizacao")
    .setDescription("Envia uma atualização"),
  new SlashCommandBuilder()
    .setName("pix")
    .setDescription("Envia chave PIX"),
  new SlashCommandBuilder()
    .setName("entrevista")
    .setDescription("Envia mensagem de entrevista"),
].map((command) => command.toJSON());

// ---------------- REGISTRO DE COMANDOS ----------------
const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("✅ Registrando comandos...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("✅ Comandos atualizados e registrados!");
  } catch (error) {
    console.error(error);
  }
})();

// ---------------- EVENTO READY ----------------
client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// ---------------- EVENTO INTERAÇÃO ----------------
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    // ---------- /aviso ----------
    if (commandName === "aviso") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("📢 Aviso")
        .setDescription("Este é um aviso importante!");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("👉 Acesse o Canal")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.com/channels/1120401688713502772/1136126482629005353")
      );

      await interaction.reply({
        content: `<@&1136131478888124526>`,
        embeds: [embed],
        components: [row],
      });
    }

    // ---------- /evento ----------
    if (commandName === "evento") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("🎉 Evento")
        .setDescription("Participe do nosso próximo evento!");

      await interaction.reply({
        content: `<@&1136131478888124526>`,
        embeds: [embed],
      });
    }

    // ---------- /atualizacao ----------
    if (commandName === "atualizacao") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("🔔 Atualizações")
        .setDescription("Aqui estão as novidades mais recentes!");

      await interaction.reply({
        content: `<@&1136131478888124526>`,
        embeds: [embed],
      });
    }

    // ---------- /pix ----------
    if (commandName === "pix") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("💰 Chave PIX")
        .setDescription("Aqui está a chave PIX para contribuições: `123e4567-e89b-12d3-a456-426614174000`");

      await interaction.reply({
        embeds: [embed],
      });
    }

    // ---------- /entrevista ----------
    if (commandName === "entrevista") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("📋 Entrevista")
        .setDescription("Clique no botão abaixo para acessar o canal de entrevista.");

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("👉 Canal de Entrevista")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.com/channels/1120401688713502772/1179115356854439966")
      );

      await interaction.reply({
        content: `<@&1136131478888124526>`,
        embeds: [embed],
        components: [row],
      });
    }
  } catch (error) {
    console.error("Erro em interactionCreate:", error);
    if (!interaction.replied) {
      await interaction.reply({
        content: "❌ Ocorreu um erro.",
        ephemeral: true,
      });
    }
  }
});

client.login(TOKEN);
