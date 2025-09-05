const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  SlashCommandBuilder,
  REST,
  Routes,
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
const GUILD_ID = "1120401688713502772";
const COLOR_PADRAO = "#f6b21b";
const STREAMER_ROLE = "1150955061606895737";
const STAFF_ROLES = [
  "1136127586737590412",
  "1181617285530660904",
  "1123014410496118784",
  "1197207305968701521",
];
const CIDADAO_ROLE = "1136132647115030608";

// ---------------- REGISTRO DE COMANDOS ----------------
const commands = [
  new SlashCommandBuilder()
    .setName("aviso")
    .setDescription("📣 Enviar um aviso")
    .addStringOption((opt) =>
      opt.setName("titulo").setDescription("Título do aviso").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("descricao").setDescription("Descrição do aviso").setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName("descricaoExtra").setDescription("Descrição extra (opcional)").setRequired(false)
    )
    .addAttachmentOption((opt) =>
      opt.setName("imagem").setDescription("Imagem opcional").setRequired(false)
    ),

  // ---------------- OUTROS COMANDOS ----------------
  new SlashCommandBuilder()
    .setName("evento")
    .setDescription("📅 Criar um evento")
    .addStringOption((opt) => opt.setName("titulo").setDescription("Título do evento").setRequired(true))
    .addStringOption((opt) => opt.setName("descricao").setDescription("Descrição do evento").setRequired(true))
    .addStringOption((opt) => opt.setName("data").setDescription("Data do evento").setRequired(true))
    .addStringOption((opt) => opt.setName("horario").setDescription("Horário do evento").setRequired(true))
    .addStringOption((opt) => opt.setName("local").setDescription("Local do evento").setRequired(true))
    .addStringOption((opt) => opt.setName("premiacao").setDescription("Premiação do evento").setRequired(true))
    .addStringOption((opt) => opt.setName("observacao").setDescription("Observação (opcional)").setRequired(false))
    .addAttachmentOption((opt) => opt.setName("imagem").setDescription("Imagem opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("atualizacoes")
    .setDescription("📰 Enviar atualizações")
    .addStringOption((opt) => opt.setName("texto1").setDescription("Atualização 1").setRequired(true))
    .addStringOption((opt) => opt.setName("texto2").setDescription("Atualização 2").setRequired(false))
    .addStringOption((opt) => opt.setName("texto3").setDescription("Atualização 3").setRequired(false))
    .addStringOption((opt) => opt.setName("texto4").setDescription("Atualização 4").setRequired(false))
    .addStringOption((opt) => opt.setName("texto5").setDescription("Atualização 5").setRequired(false))
    .addStringOption((opt) => opt.setName("texto6").setDescription("Atualização 6").setRequired(false))
    .addStringOption((opt) => opt.setName("texto7").setDescription("Atualização 7").setRequired(false))
    .addStringOption((opt) => opt.setName("texto8").setDescription("Atualização 8").setRequired(false))
    .addStringOption((opt) => opt.setName("texto9").setDescription("Atualização 9").setRequired(false))
    .addStringOption((opt) => opt.setName("texto10").setDescription("Atualização 10").setRequired(false))
    .addAttachmentOption((opt) => opt.setName("imagem").setDescription("Imagem opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("cargostreamer")
    .setDescription("Mensagem para pegar o cargo Streamer"),

  new SlashCommandBuilder()
    .setName("pix")
    .setDescription("💰 PIX Gabriel (STAFF)")
    .addStringOption((opt) => opt.setName("valor").setDescription("Valor").setRequired(true))
    .addStringOption((opt) => opt.setName("produto").setDescription("Produto").setRequired(true))
    .addStringOption((opt) => opt.setName("desconto").setDescription("Desconto (%) opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("pix2")
    .setDescription("💰 PIX Leandro (STAFF)")
    .addStringOption((opt) => opt.setName("valor").setDescription("Valor").setRequired(true))
    .addStringOption((opt) => opt.setName("servico").setDescription("Serviço").setRequired(true))
    .addStringOption((opt) => opt.setName("desconto").setDescription("Desconto (%) opcional").setRequired(false)),
].map((cmd) => cmd.toJSON());

// ---------------- REGISTRAR COMANDOS ----------------
client.once("ready", async () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Comandos registrados!");
  } catch (err) {
    console.error("❌ Erro ao registrar comandos:", err);
  }
});

// ---------------- INTERAÇÕES ----------------
client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const temPermissao = STAFF_ROLES.some((r) => interaction.member.roles.cache.has(r));

    // ---------------- COMANDO /AVISO ----------------
    if (commandName === "aviso") {
      const titulo = interaction.options.getString("titulo");
      const descricao1 = interaction.options.getString("descricao");
      const descricao2 = interaction.options.getString("descricaoExtra");
      const imagem = interaction.options.getAttachment("imagem")?.url || null;

      let descEmbed = `
──────────────
**Título:** ${titulo}
──────────────
**Descrição:** ${descricao1}
──────────────
**Descrição extra:** ${descricao2 || "Nenhuma"}
──────────────
`;

      const embed = new EmbedBuilder().setColor(COLOR_PADRAO).setDescription(descEmbed);
      if (imagem) embed.setImage(imagem);

      // Resposta ephemer adiantada
      await interaction.deferReply({ ephemeral: true });

      // Envia embed e menção
      await interaction.channel.send({ embeds: [embed] });
      await interaction.channel.send({ content: `<@&${CIDADAO_ROLE}> @everyone` });

      // Atualiza a interação ephemer
      await interaction.editReply({ content: "✅ Aviso enviado!" });
    }

    // ---------------- OUTROS COMANDOS ----------------
    // Cole aqui a lógica de /evento, /atualizacoes, /pix, /pix2, /cargostreamer
    // Sem alterações
  } catch (err) {
    console.error("Erro em interactionCreate:", err);
    if (!interaction.replied) interaction.reply({ content: "❌ Ocorreu um erro.", ephemeral: true });
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

// ---------------- SERVIDOR EXPRESS ----------------
const app = express();
app.get("/", (req, res) => res.send("Bot está rodando e acordado! ✅"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🌐 Servidor web ativo para manter o Replit acordado!"));

// ---------------- LOGIN ----------------
client.login(TOKEN);
