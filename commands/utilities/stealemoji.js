const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('stealemoji')
        .setDescription('Adds a given emoji to a server.')
        .addStringOption(option => option.setName('emoji').setDescription('The emoji that you want to add to the server.').setRequired(true))
        .addStringOption(option => option.setName('name').setDescription('The given name for the emoji.').setRequired(true))
        .setContexts(['Guild']),
    async execute(interaction) {
        const emoji = interaction.options.getString('emoji').trim();
        const name = interaction.options.getString('name').trim();

        let emoji_url = null;

        // * This validates if the emoji is a custom one, checking if it starts with '<:' or '<a:' (default emojis start with ':').
        if (emoji.startsWith('<:') || emoji.startsWith('<a:')) {
            const id = emoji.match(/\d{15,}/g)[0];

            // * Animated emojis have a different ID than static emojis.
            const isAnimated = emoji.startsWith('<a:');

            // * If it's animated the URL will be a 'gif', and the parameter will be set to 'quality=lossless', so the quality is not lost.
            emoji_url = `https://cdn.discordapp.com/emojis/${id}.${isAnimated ? 'gif' : 'png'}?quality=lossless`;
        } else {
            const errorEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setDescription(`**Emoji Creation Error** ${process.env.EMOJI_ERROR}\n\n` +
                                'You can\'t steal default emojis!');

            return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        // * Discord downloads the emoji through the URL, and then uploads it to the server with a new ID.
        interaction.guild.emojis.create({ attachment: `${emoji_url}`, name: `${name}` })
        .then (async (createdEmoji) => {
            const successEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setDescription(`**Emoji Successfully Created** ${process.env.EMOJI_CHECK}\n\n` +
                                `Added ${createdEmoji} with the name "**${name}**".`);

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });
        }).catch (async (error) => {
            const errorEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setDescription(`**Emoji Creation Error** ${process.env.EMOJI_ERROR}\n\n` +
                                'You can\' add this emoji because you have reached your server emoji limit.');

            console.log(`${new Date()} >>> *** ERROR: stealemoji.js *** by ${interaction.user.id} (${interaction.user.username})`);
            console.error(error);

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        });
    },
};