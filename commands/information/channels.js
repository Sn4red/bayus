const path = require('node:path');
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('channels')
        .setDescription('Information about the channels.'),
    async execute(interaction) {
        // * Notify the Discord API that the interaction was received successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('<a:pin:1230368962496434338>  Server Channels and Purpose')
            .setDescription('**[#welcome](https://discord.com/channels/1162912802701316146/1319794982504370256)** - Text channel where Bayus bot welcomes.\n' +
                            '**[#rules](https://discord.com/channels/1162912802701316146/1319794997695873105)** - Server rules.\n' +
                            '**[#information](https://discord.com/channels/1162912802701316146/1319800124922269748)** - Information about the Discord server, its channels and important links.\n' +
                            '**[#announcements](https://discord.com/channels/1162912802701316146/1319795031258959914)** - Important announcements and updates about SCP Collector and the Discord server will be displayed here.\n' +
                            '**[#general-chat](https://discord.com/channels/1162912802701316146/1319854299941044244)** - Talk about anything with the community.\n' +
                            '**[#scp-general](https://discord.com/channels/1162912802701316146/1162912803217223903)** - Talk about anything related to SCP Collector or SCP topics.\n' +
                            '**[#scp-shots](https://discord.com/channels/1162912802701316146/1319795699365187584)** - Place to use /`capture` but it\'s not mandatory.\n' +
                            '**[#scp-trades](https://discord.com/channels/1162912802701316146/1319795445077377034)** - Use this channel to do trades with other users.');

        // * Sends the embed to the #information channel.
        const channel = interaction.client.channels.cache.get('1319800124922269748');
        if (channel) {
            await channel.send({ embeds: [embed] });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};
