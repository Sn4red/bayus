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
            .setTitle(`${process.env.EMOJI_RULES}  Rules`)
            .setDescription(`${process.env.EMOJI_SMALL_WHITE_DASH}Respect everyone. Be kind and respectful to all members. No harassment, hate speech, or discrimination.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}Maintain the channels english only.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}No spamming. Avoid excessive messages, emojis, caps, or mentions.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}No NSFW content, offensive material, or excessive profanity.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}No Self-Promotion. Do not advertise or promote other servers, social media, or businesses without permission.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}Stay On Topic. Use the appropriate channels for different discussions.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}No Illegal Activities. Do not share pirated content, hacking tools, or anything illegal.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}No Impersonation. Do not pretend to be someone else, including staff members.\n` +
                            `${process.env.EMOJI_SMALL_WHITE_DASH}Listen to Staff. Follow the instructions of moderators and admins.\n\n` +
                            `Breaking these rules may result in warnings, timeouts, or bans. Enjoy your stay!  ${process.env.EMOJI_MIXED_STARS}`)
            .setThumbnail('attachment://rules-thumbnail.gif');

        // * Sends the embed to the #rules channel.
        const channel = interaction.client.channels.cache.get(process.env.DISCORD_RULES_CHANNEL_ID);
        
        if (channel) {
            await channel.send({ embeds: [embed], files: [thumbnail] });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};
