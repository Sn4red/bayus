const path = require('node:path');
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('rules')
        .setDescription('Rules for The Bunk3r server.'),
    async execute(interaction) {
        // * Notify the Discord API that the interaction was received successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        const thumbnailPath = path.join(__dirname, '../../images/embed/rules-thumbnail.gif');

        const thumbnail = new AttachmentBuilder(thumbnailPath);

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('<:rules:1339337193830879273>  Rules')
            .setDescription('<:small_white_dash:1247247464172355695>Respect everyone. Be kind and respectful to all members. No harassment, hate speech, or discrimination.\n' +
                            '<:small_white_dash:1247247464172355695>No spamming. Avoid excessive messages, emojis, caps, or mentions.\n' +
                            '<:small_white_dash:1247247464172355695>No NSFW content, offensive material, or excessive profanity.\n' +
                            '<:small_white_dash:1247247464172355695>No Self-Promotion. Do not advertise or promote other servers, social media, or businesses without permission.\n' +
                            '<:small_white_dash:1247247464172355695>Stay On Topic. Use the appropriate channels for different discussions.\n' +
                            '<:small_white_dash:1247247464172355695>No Illegal Activities. Do not share pirated content, hacking tools, or anything illegal.\n' +
                            '<:small_white_dash:1247247464172355695>No Impersonation. Do not pretend to be someone else, including staff members.\n' +
                            '<:small_white_dash:1247247464172355695>Listen to Staff. Follow the instructions of moderators and admins.\n\n' +
                            'Breaking these rules may result in warnings, timeouts, or bans. Enjoy your stay!  <a:mixed_stars:1229605947895189534>')
            .setThumbnail('attachment://rules-thumbnail.gif');

        // * Sends the embed to the #information channel.
        const channel = interaction.client.channels.cache.get('1319794997695873105');
        if (channel) {
            await channel.send({ embeds: [embed], files: [thumbnail] });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};
