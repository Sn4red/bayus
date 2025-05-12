const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('channels')
        .setDescription('Information about the channels.')
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle(`${process.env.EMOJI_PIN}  Server Channels and Purpose`)
            .setDescription(`**[#welcome](${process.env.DISCORD_WELCOME_CHANNEL_URL})** - Text channel where Bayus bot welcomes.\n` +
                            `**[#rules](${process.env.DISCORD_RULES_CHANNEL_URL})** - Server rules.\n` +
                            `**[#information](${process.env.DISCORD_INFORMATION_CHANNEL_URL})** - Information about the Discord server, its channels and important links.\n` +
                            `**[#announcements](${process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_URL})** - Important announcements and updates about SCP Collector and the Discord server will be displayed here.\n` +
                            `**[#general-chat](${process.env.DISCORD_GENERAL_CHAT_CHANNEL_URL})** - Talk about anything with the community.\n` +
                            `**[#scp-general](${process.env.DISCORD_SCP_GENERAL_URL})** - Talk about anything related to SCP Collector or SCP topics.\n` +
                            `**[#scp-shots](${process.env.DISCORD_SCP_SHOTS_URL})** - Place to use /\`capture\` but it's not mandatory.\n` +
                            `**[#scp-trades](${process.env.DISCORD_SCP_TRADES_URL})** - Use this channel to do trades with other users.`);

        // * Sends the embed to the #information channel.
        const channel = interaction.client.channels.cache.get(process.env.DISCORD_INFORMATION_CHANNEL_ID);
        if (channel) {
            await channel.send({ embeds: [embed] });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};
