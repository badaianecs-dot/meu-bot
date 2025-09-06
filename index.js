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
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// ---------------- CONFIGURAÇÕES ----------------
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
const COLOR_PADRAO = "#f6b21b";
const STREAMER_ROLE = "1150955061606895737";
const STAFF_ROLES = [
  "1136127586737590412",
  "1181617285530660904",
  "1123014410496118784",
  "1197207305968701521",
];
const CIDADAO_ROLE = "1136132647115030608";

// ---------------- COMANDOS ----------------
const commands = [
  new SlashCommandBuilder()
    .setName("aviso")
    .setDescription("📣 Enviar um aviso")
    .addStringOption((opt) =>
      opt.setName("titulo").setDescription("Título do aviso").setRequired(true),
    )
    .addStringOption((opt) =>
      opt
        .setName("descricao")
        .setDescription("Descrição do aviso (use \\n para quebrar linha)")
        .setRequired(true),
    )
    .addAttachmentOption((opt) =>
      opt
        .setName("imagem")
        .setDescription("Imagem opcional")
        .setRequired(false),
    )
    .addChannelOption(opt =>
      opt.setName("canal1")
         .setDescription("Escolha o canal para Abrir Ticket (opcional)")
         .setRequired(false))
    .addChannelOption(opt =>
      opt.setName("canal2")
         .setDescription("Escolha o canal para Aguarde entrevista (opcional)")
         .setRequired(false))
    .addRoleOption(opt =>
      opt.setName("mencao1")
         .setDescription("Escolha uma role para mencionar (opcional)")
         .setRequired(false))
    .addRoleOption(opt =>
      opt.setName("mencao2")
         .setDescription("Escolha outra role para mencionar (opcional)")
         .setRequired(false)),

  // ... outros comandos que você já tem

  new SlashCommandBuilder()
    .setName("entrevista")
    .setDescription("📌 Envia mensagem de aguarde entrevista"),
].map((cmd) => cmd.toJSON());

// ---------------- LIMPAR COMANDOS ANTIGOS E REGISTRAR ----------------
client.once("ready", async () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    console.log("✅ Comandos globais antigos removidos");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
    console.log("✅ Comandos da guilda antigos removidos");

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Comandos atualizados e registrados!");
  } catch (err) {
    console.error("❌ Erro ao registrar comandos:", err);
  }
});

// ---------------- INTERAÇÕES ----------------
client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const temPermissao = STAFF_ROLES.some((r) =>
      interaction.member.roles.cache.has(r),
    );

    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    // ---------------- /entrevista ----------------
    if (commandName === "entrevista") {
      const canal = interaction.channel; // canal onde o comando foi usado

      // Embed com título e descrição
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("Olá, visitantes! 👋")
        .setDescription(
          "As entrevistas já estão disponíveis. Para participar, basta clicar no botão \"Aguarde Entrevista\" e um membro da equipe irá atendê-lo em breve.\n\n" +
          "Desejamos boa sorte! ✨"
        );

      // Botão link para o canal de entrevista específico
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Aguarde Entrevista")
          .setStyle(ButtonStyle.Success) // botão verde
          .setURL("https://discord.com/channels/1120401688713502772/1179115356854439966")
      );

      // Envia o embed com botão
      await canal.send({ embeds: [embed], components: [row] });

      // Mensagem com menção de role
      await canal.send({ content: `<@&1136131478888124526>` });

      return interaction.editReply({ content: "✅ Mensagem de entrevista enviada com sucesso!" });
    }

    // ---------------- outros comandos existentes ----------------
    // Seu código existente de /aviso, /evento, /atualizacoes, /pix, /pix2, /cargostreamer continua igual

  } catch (err) {
    console.error("Erro em interactionCreate:", err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Ocorreu um erro.", ephemeral: true });
    } else {
      await interaction.followUp({ content: "❌ Ocorreu um erro.", ephemeral: true });
    }
  }
});

// ---------------- REAÇÕES ----------------
client.on("messageReactionAdd", async (reaction, user) => {
  try {
    if (reaction.partial) await reaction.fetch();
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;

    if (reaction.emoji.id === "1353492062376558674") {
      const member = await reaction.message.guild.members.fetch(user.id);
      await member.roles.add(STREAMER_ROLE);
    }
  } catch (err) {
    console.error("Erro em messageReactionAdd:", err);
  }
});

// ---------------- EXPRESS ----------------
const app = express();
app.get("/", (req, res) => res.send("Bot está rodando e acordado! ✅"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("🌐 Servidor web ativo para manter o Replit acordado!"),
);

// ---------------- LOGIN ----------------
client.login(TOKEN);
