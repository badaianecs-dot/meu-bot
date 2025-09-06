// index.js
require("dotenv").config();
const { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle 
} = require("discord.js");
const express = require("express");

// ---------------- CONFIGURAÇÃO DO BOT ----------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const COLOR_PADRAO = "#00FF00"; // Cor padrão dos embeds
const CIDADAO_ROLE = "ID_DO_ROLE_CIDADAO"; // Troque pelo seu role ID
const STAFF_ROLES = ["ID_DO_ROLE_STAFF"]; // IDs de staff

// ---------------- SERVIDOR EXPRESS ----------------
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Bot online ✅"));

app.listen(PORT, () => console.log(`🌐 Servidor web ativo na porta ${PORT}`));

// ---------------- EVENTOS ----------------
client.once("ready", () => {
  console.log(`🤖 Bot online como ${client.user.tag}`);
});

// ---------------- INTERAÇÕES ----------------
client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isChatInputCommand()) return;

    const commandName = interaction.commandName;
    const temPermissao = STAFF_ROLES.some((r) =>
      interaction.member.roles.cache.has(r)
    );

    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply({ ephemeral: true });
    }

    switch (commandName) {
      case "aviso":
        {
          const titulo = interaction.options.getString("titulo");
          const descricao = interaction.options.getString("descricao").replace(/\\n/g, "\n");
          const imagem = interaction.options.getAttachment("imagem")?.url;

          const embed = new EmbedBuilder()
            .setColor(COLOR_PADRAO)
            .setTitle(titulo)
            .setDescription(descricao);
          if (imagem) embed.setImage(imagem);

          await interaction.channel.send({ embeds: [embed] });
          await interaction.channel.send({ content: `<@&${CIDADAO_ROLE}> @everyone` });
          await interaction.editReply({ content: "✅ Aviso enviado!" });
        }
        break;

      case "evento":
        {
          const titulo = interaction.options.getString("titulo");
          const descricao = interaction.options.getString("descricao");
          const data = interaction.options.getString("data");
          const horario = interaction.options.getString("horario");
          const local = interaction.options.getString("local");
          const premiacao = interaction.options.getString("premiacao");
          const observacao = interaction.options.getString("observacao");
          const imagem = interaction.options.getAttachment("imagem")?.url;

          let descEmbed = `**Descrição:** ${descricao}\n**Data:** ${data}\n**Horário:** ${horario}\n**Local:** ${local}`;
          if (premiacao) descEmbed += `\n**Premiação:** ${premiacao}`;
          if (observacao) descEmbed += `\n**Observação:** ${observacao}`;

          const embed = new EmbedBuilder()
            .setColor(COLOR_PADRAO)
            .setTitle(titulo)
            .setDescription(descEmbed);
          if (imagem) embed.setImage(imagem);

          await interaction.channel.send({ embeds: [embed] });
          await interaction.channel.send({ content: `<@&${CIDADAO_ROLE}> @everyone` });
          await interaction.editReply({ content: "✅ Evento enviado!" });
        }
        break;

      case "atualizacoes":
        {
          const textos = [];
          for (let i = 1; i <= 10; i++) {
            const txt = interaction.options.getString(`texto${i}`);
            if (txt) textos.push(txt);
          }
          const imagem = interaction.options.getAttachment("imagem")?.url;

          if (!textos.length)
            return interaction.editReply({ content: "❌ Informe pelo menos uma atualização." });

          const embed = new EmbedBuilder()
            .setColor(COLOR_PADRAO)
            .setTitle("ATUALIZAÇÕES") // sem emoji
            .setDescription(textos.join("\n\n"));
          if (imagem) embed.setImage(imagem);

          await interaction.channel.send({ embeds: [embed] });
          await interaction.channel.send({ content: `<@&${CIDADAO_ROLE}> @everyone` });
          await interaction.editReply({ content: "✅ Atualizações enviadas!" });
        }
        break;

      case "cargostreamer":
        {
          const embed = new EmbedBuilder()
            .setColor(COLOR_PADRAO)
            .setTitle("Seja Streamer!")
            .setDescription(
              `Após uma semana, cumprindo os requisitos, você receberá os benefícios na cidade.\n\nReaja com <:Streamer:1353492062376558674> para receber o cargo Streamer!`
            );
          const mensagem = await interaction.channel.send({ embeds: [embed] });
          await mensagem.react("1353492062376558674");
          await interaction.editReply({ content: "✅ Mensagem de cargo enviada!" });
        }
        break;

      case "pix":
      case "pix2":
        {
          if (!temPermissao)
            return interaction.editReply({ content: "❌ Apenas STAFF." });

          const valor = interaction.options.getString("valor");
          const item =
            commandName === "pix"
              ? interaction.options.getString("produto")
              : interaction.options.getString("servico");
          const desconto = interaction.options.getString("desconto");

          let descricao = `<:Pix:1351222074097664111> **PIX** - ${
            commandName === "pix"
              ? "condadodoacoes@gmail.com - BANCO BRADESCO (Gabriel Fellipe de Souza)"
              : "leandro.hevieira@gmail.com"
          }\n\n<:seta:1346148222044995714> **VALOR:** ${valor}  **${
            commandName === "pix" ? "Produto" : "Serviço"
          }:** ${item}\n\n**Enviar o comprovante após o pagamento.**\n`;
          if (desconto) descricao += `\n*Desconto aplicado: ${desconto}%*`;

          const embed = new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription(descricao);

          await interaction.channel.send({ embeds: [embed] });
          await interaction.editReply({ content: "✅ PIX enviado com sucesso!" });
        }
        break;

      case "entrevista":
        {
          const embed = new EmbedBuilder()
            .setColor(COLOR_PADRAO)
            .setTitle("Olá, entrevista!");

          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("Canal da Entrevista")
              .setStyle(ButtonStyle.Link)
              .setURL("https://discord.com/channels/1120401688713502772/1179115356854439966")
          );

          await interaction.channel.send({
            embeds: [embed],
            components: [row],
            content: `<@&1136131478888124526>`,
          });

          await interaction.editReply({ content: "✅ Mensagem de entrevista enviada!" });
        }
        break;
    }
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
  if (user.bot) return;
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();

  const { message, emoji } = reaction;

  // Cargo Streamer
  if (message.embeds[0]?.title === "Seja Streamer!" && emoji.id === "1353492062376558674") {
    const member = await message.guild.members.fetch(user.id);
    const role = message.guild.roles.cache.get("ID_DO_ROLE_STREAMER");
    if (!member.roles.cache.has(role.id)) {
      await member.roles.add(role).catch(console.error);
    }
  }
});

// ---------------- LOGIN ----------------
client.login(process.env.TOKEN);
