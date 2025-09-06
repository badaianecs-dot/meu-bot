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
    .addStringOption(opt => opt.setName("titulo").setDescription("Título do aviso").setRequired(true))
    .addStringOption(opt => opt.setName("descricao").setDescription("Descrição do aviso (use \\n para quebrar linha)").setRequired(true))
    .addAttachmentOption(opt => opt.setName("imagem").setDescription("Imagem opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("evento")
    .setDescription("📅 Criar um evento")
    .addStringOption(opt => opt.setName("titulo").setDescription("Título do evento").setRequired(true))
    .addStringOption(opt => opt.setName("descricao").setDescription("Descrição do evento").setRequired(true))
    .addStringOption(opt => opt.setName("data").setDescription("Data do evento").setRequired(true))
    .addStringOption(opt => opt.setName("horario").setDescription("Horário do evento").setRequired(true))
    .addStringOption(opt => opt.setName("local").setDescription("Local do evento").setRequired(true))
    .addStringOption(opt => opt.setName("premiacao").setDescription("Premiação do evento (opcional)").setRequired(false))
    .addStringOption(opt => opt.setName("observacao").setDescription("Observação (opcional)").setRequired(false))
    .addAttachmentOption(opt => opt.setName("imagem").setDescription("Imagem opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("atualizacoes")
    .setDescription("Enviar atualizações")
    .addStringOption(opt => opt.setName("texto1").setDescription("Atualização 1").setRequired(true))
    .addStringOption(opt => opt.setName("texto2").setDescription("Atualização 2").setRequired(false))
    .addStringOption(opt => opt.setName("texto3").setDescription("Atualização 3").setRequired(false))
    .addStringOption(opt => opt.setName("texto4").setDescription("Atualização 4").setRequired(false))
    .addStringOption(opt => opt.setName("texto5").setDescription("Atualização 5").setRequired(false))
    .addStringOption(opt => opt.setName("texto6").setDescription("Atualização 6").setRequired(false))
    .addStringOption(opt => opt.setName("texto7").setDescription("Atualização 7").setRequired(false))
    .addStringOption(opt => opt.setName("texto8").setDescription("Atualização 8").setRequired(false))
    .addStringOption(opt => opt.setName("texto9").setDescription("Atualização 9").setRequired(false))
    .addStringOption(opt => opt.setName("texto10").setDescription("Atualização 10").setRequired(false))
    .addAttachmentOption(opt => opt.setName("imagem").setDescription("Imagem opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("cargostreamer")
    .setDescription("Mensagem para pegar o cargo Streamer"),

  new SlashCommandBuilder()
    .setName("pix")
    .setDescription("💰 PIX Gabriel (STAFF)")
    .addStringOption(opt => opt.setName("valor").setDescription("Valor").setRequired(true))
    .addStringOption(opt => opt.setName("produto").setDescription("Produto").setRequired(true))
    .addStringOption(opt => opt.setName("desconto").setDescription("Desconto (%) opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("pix2")
    .setDescription("💰 PIX Leandro (STAFF)")
    .addStringOption(opt => opt.setName("valor").setDescription("Valor").setRequired(true))
    .addStringOption(opt => opt.setName("servico").setDescription("Serviço").setRequired(true))
    .addStringOption(opt => opt.setName("desconto").setDescription("Desconto (%) opcional").setRequired(false)),

  new SlashCommandBuilder()
    .setName("entrevista")
    .setDescription("📌 Mensagem de aguarde entrevista"),
].map(cmd => cmd.toJSON());

// ---------------- LIMPAR COMANDOS ANTIGOS E REGISTRAR ----------------
client.once("ready", async () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] });
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    console.log("✅ Comandos atualizados e registrados!");
  } catch (err) {
    console.error("❌ Erro ao registrar comandos:", err);
  }
});

// ---------------- INTERAÇÕES ----------------
client.on("interactionCreate", async interaction => {
  try {
    if (!interaction.isChatInputCommand()) return;
    const commandName = interaction.commandName;
    const temPermissao = STAFF_ROLES.some(r => interaction.member.roles.cache.has(r));

    // ---------------- /aviso ----------------
    if (commandName === "aviso") {
      const titulo = interaction.options.getString("titulo");
      const descricao = interaction.options.getString("descricao").replace(/\\n/g, "\n");
      const imagem = interaction.options.getAttachment("imagem")?.url;

      const embed = new EmbedBuilder().setColor(COLOR_PADRAO).setTitle(titulo).setDescription(descricao);
      if (imagem) embed.setImage(imagem);

      await interaction.channel.send({ embeds: [embed] });
      await interaction.channel.send({ content: `<@&${CIDADAO_ROLE}> @everyone` });
    }

    // ---------------- /evento ----------------
    if (commandName === "evento") {
      const titulo = interaction.options.getString("titulo");
      const descricao = interaction.options.getString("descricao");
      const data = interaction.options.getString("data");
      const horario = interaction.options.getString("horario");
      const local = interaction.options.getString("local");
      const premiacao = interaction.options.getString("premiacao");
      const observacao = interaction.options.getString("observacao");
      const imagem = interaction.options.getAttachment("imagem")?.url;

      let descEmbed = `**Descrição:** ${descricao}\n\n**Data:** ${data}\n\n**Horário:** ${horario}\n\n**Local:** ${local}`;
      if (premiacao) descEmbed += `\n\n**Premiação:** ${premiacao}`;
      if (observacao) descEmbed += `\n\n**Observação:** ${observacao}`;

      const embed = new EmbedBuilder().setColor(COLOR_PADRAO).setTitle(titulo).setDescription(descEmbed);
      if (imagem) embed.setImage(imagem);

      await interaction.channel.send({ embeds: [embed] });
      await interaction.channel.send({ content: `<@&${CIDADAO_ROLE}> @everyone` });
    }

    // ---------------- /atualizacoes ----------------
    if (commandName === "atualizacoes") {
      const textos = [];
      for (let i = 1; i <= 10; i++) {
        const txt = interaction.options.getString(`texto${i}`);
        if (txt) textos.push(txt);
      }
      const imagem = interaction.options.getAttachment("imagem")?.url;

      if (textos.length === 0) return;

      const embed = new EmbedBuilder().setColor(COLOR_PADRAO).setTitle("ATUALIZAÇÕES").setDescription(textos.join("\n\n"));
      if (imagem) embed.setImage(imagem);

      await interaction.channel.send({ embeds: [embed] });
      await interaction.channel.send({ content: `<@&${CIDADAO_ROLE}> @everyone` });
    }

    // ---------------- /cargostreamer ----------------
    if (commandName === "cargostreamer") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("Seja Streamer!")
        .setDescription(`Após uma semana, cumprindo os requisitos, você receberá os benefícios na cidade.\n\nReaja com <:Streamer:1353492062376558674> para receber o cargo Streamer!`);
      const msg = await interaction.channel.send({ embeds: [embed] });
      await msg.react("1353492062376558674");
    }

    // ---------------- /pix e /pix2 ----------------
    if (commandName === "pix" || commandName === "pix2") {
      if (!temPermissao) return interaction.reply({ content: "❌ Apenas STAFF.", ephemeral: true });

      await interaction.deferReply({ ephemeral: true });

      const valor = interaction.options.getString("valor");
      const item = commandName === "pix" ? interaction.options.getString("produto") : interaction.options.getString("servico");
      const desconto = interaction.options.getString("desconto");

      let descricao = `<:Pix:1351222074097664111> **PIX** - ${commandName === "pix" ? "condadodoacoes@gmail.com - BANCO BRADESCO (Gabriel Fellipe de Souza)" : "leandro.hevieira@gmail.com"}\n\n`;
      descricao += `<:seta:1346148222044995714> **VALOR:** ${valor}  **${commandName === "pix" ? "Produto" : "Serviço"}:** ${item}\n\n**Enviar o comprovante após o pagamento.**`;
      if (desconto) descricao += `\n*Desconto aplicado: ${desconto}%*`;

      const embed = new EmbedBuilder().setColor("#00FF00").setDescription(descricao);
      await interaction.channel.send({ embeds: [embed] });
      await interaction.editReply({ content: "✅ PIX enviado com sucesso!" });
    }

    // ---------------- /entrevista ----------------
    if (commandName === "entrevista") {
      const embed = new EmbedBuilder()
        .setColor(COLOR_PADRAO)
        .setTitle("Olá, visitantes!")
        .setDescription(
          "As entrevistas já estão disponíveis. Para participar, basta clicar no botão abaixo e um membro da equipe irá atendê-lo em breve.\n\nDesejamos boa sorte! ✨"
        );

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Aguarde Entrevista")
          .setStyle(ButtonStyle.Link)
          .setURL("https://discord.com/channels/1120401688713502772/1179115356854439966")
      );

      await interaction.channel.send({ embeds: [embed], components: [row] });
    }

  } catch (err) {
    console.error("Erro em interactionCreate:", err);
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
app.listen(PORT, () => console.log("🌐 Servidor web ativo!"));

client.login(TOKEN);
