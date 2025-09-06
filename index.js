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
    ),
    
  new SlashCommandBuilder()
    .setName("evento")
    .setDescription("📅 Criar um evento")
    .addStringOption((opt) =>
      opt.setName("titulo").setDescription("Título do evento").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("descricao").setDescription("Descrição do evento").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("data").setDescription("Data do evento").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("horario").setDescription("Horário do evento").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("local").setDescription("Local do evento").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("premiacao").setDescription("Premiação do evento (opcional)").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("observacao").setDescription("Observação (opcional)").setRequired(false),
    )
    .addAttachmentOption((opt) =>
      opt.setName("imagem").setDescription("Imagem opcional").setRequired(false),
    ),
    
  new SlashCommandBuilder()
    .setName("atualizacoes")
    .setDescription("Enviar atualizações")
    .addStringOption((opt) =>
      opt.setName("texto1").setDescription("Atualização 1").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("texto2").setDescription("Atualização 2").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto3").setDescription("Atualização 3").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto4").setDescription("Atualização 4").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto5").setDescription("Atualização 5").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto6").setDescription("Atualização 6").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto7").setDescription("Atualização 7").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto8").setDescription("Atualização 8").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto9").setDescription("Atualização 9").setRequired(false),
    )
    .addStringOption((opt) =>
      opt.setName("texto10").setDescription("Atualização 10").setRequired(false),
    )
    .addAttachmentOption((opt) =>
      opt.setName("imagem").setDescription("Imagem opcional").setRequired(false),
    ),
    
  new SlashCommandBuilder()
    .setName("cargostreamer")
    .setDescription("Mensagem para pegar o cargo Streamer"),

  new SlashCommandBuilder()
    .setName("pix")
    .setDescription("💰 PIX Gabriel (STAFF)")
    .addStringOption((opt) =>
      opt.setName("valor").setDescription("Valor").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("produto").setDescription("Produto").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("desconto").setDescription("Desconto (%) opcional").setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName("pix2")
    .setDescription("💰 PIX Leandro (STAFF)")
    .addStringOption((opt) =>
      opt.setName("valor").setDescription("Valor").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("servico").setDescription("Serviço").setRequired(true),
    )
    .addStringOption((opt) =>
      opt.setName("desconto").setDescription("Desconto (%) opcional").setRequired(false),
    ),

  new SlashCommandBuilder()
    .setName("entrevista")
    .setDescription("📌 Envia mensagem de aguarde entrevista"),
].map((cmd) => cmd.toJSON());

// ---------------- REGISTRAR COMANDOS ----------------
client.once("ready", async () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
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

    // --------- /entrevista corrigido ---------
    if (commandName === "entrevista") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("Olá, visitantes! 👋")
        .setDescription(
          "As entrevistas já estão disponíveis. Para participar, basta clicar no botão \"Aguarde Entrevista\" e um membro da equipe irá atendê-lo em breve.\n\nDesejamos boa sorte! ✨"
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Aguarde Entrevista")
          .setStyle(ButtonStyle.Link) // botão cinza de link
          .setURL("https://discord.com/channels/1120401688713502772/1179115356854439966")
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });
      await interaction.channel.send({ content: `<@&1136131478888124526>` });

      return interaction.editReply({ content: "✅ Mensagem de entrevista enviada com sucesso!" });
    }

    // --------- Mantém todos os comandos originais (/aviso, /evento, /atualizacoes, /pix, /pix2, /cargostreamer) ---------
    // ... (o código de interação para os comandos anteriores permanece igual ao que você já tinha)

  } catch (err) {
    console.error("Erro em interactionCreate:", err);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Ocorreu um erro.", ephemeral: true });
    } else {
      try {
        await interaction.editReply({ content: "❌ Ocorreu um erro.", ephemeral: true });
      } catch {}
    }
  }
});

// ---------------- EXPRESS PARA MANUTENÇÃO ----------------
const app = express();
app.get("/", (req, res) => res.send("Bot está rodando e acordado! ✅"));

const PORT = process.env.PORT || 10000; // Render fornece via env
app.listen(PORT, () =>
  console.log(`🌐 Servidor web ativo na porta ${PORT}!`)
);

// ---------------- LOGIN ----------------
client.login(TOKEN);
