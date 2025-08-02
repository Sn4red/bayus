const {
    SlashCommandBuilder,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder,
} = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('stealemoji')
        .setDescription('Adds a given emoji to a server.')
        .addStringOption(option =>
            option
                .setName('emoji')
                .setDescription('The emoji that you want to add to the server.')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('name')
                .setDescription('The given name for the emoji.')
                .setRequired(true))
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received
        // * successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral],
        });

        const emoji = interaction.options.getString('emoji').trim();
        const name = interaction.options.getString('name').trim();

        let emoji_url = null;

        // * This validates if the emoji is a custom one, checking if it starts
        // * with '<:' or '<a:' (default emojis start with ':').
        if (emoji.startsWith('<:') || emoji.startsWith('<a:')) {
            const id = emoji.match(/\d{15,}/g)[0];

            // * Animated emojis have a different ID than static emojis.
            const isAnimated = emoji.startsWith('<a:');

            // * If it's animated the URL will be a 'gif', and the parameter
            // * will be set to 'quality=lossless', so the quality is not lost.
            emoji_url =
                `https://cdn.discordapp.com/emojis/${id}.` +
                    `${isAnimated ? 'gif' : 'png'}?quality=lossless`;
        } else {
            const errorContainer = createContainer(
                `### ${process.env.EMOJI_ERROR}  Emoji Creation Error`,
                '==You can\'t steal default emojis!==',
            );

            return await interaction.editReply({
                components: [errorContainer],
                flags: [MessageFlags.IsComponentsV2],
            });
        }

        // * Discord downloads the emoji through the URL, and then uploads it
        // * to the server with a new ID.
        interaction.guild.emojis.create({
            attachment: `${emoji_url}`,
            name: `${name}`,
        }).then (async (createdEmoji) => {
            const successContainer = createContainer(
                `### ${process.env.EMOJI_CHECK}  Emoji Successfully Created`,
                `Added  ${createdEmoji}  with the name "**${name}**".`,
            );

            return await interaction.editReply({
                components: [successContainer],
                flags: [MessageFlags.IsComponentsV2],
            });
        }).catch(async (error) => {
            const errorContainer = createContainer(
                `### ${process.env.EMOJI_ERROR}  Emoji Creation Error`,
                'There was an error while trying to create the emoji. Please ' +
                    'check the logs.',
            );

            console.log(
                `${new Date()} >>> *** ERROR: stealemoji.js *** by ` +
                    `${interaction.user.id} (${interaction.user.username})`,
            );
            console.error(error);

            return await interaction.editReply({
                components: [errorContainer],
                flags: [MessageFlags.IsComponentsV2],
            });
        });
    },
};

function createContainer(title, description) {
    const header = new TextDisplayBuilder()
        .setContent(title);

    const separator = new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small);

    const text = new TextDisplayBuilder()
        .setContent(description);

    const container = new ContainerBuilder()
        .setAccentColor(0x3498DB)
        .addTextDisplayComponents(header)
        .addSeparatorComponents(separator)
        .addTextDisplayComponents(text);

    return container;
}
