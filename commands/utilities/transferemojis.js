const path = require('path');
const fs = require('fs');
const {
    SlashCommandBuilder,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ContainerBuilder } = require('discord.js');

// * It gives the absolute path of the current file, and thes it goes back two
// * folders to get the 'emojis' folder and the 'emojis.json' file.
const emojiFolder = path.join(__dirname, '../../emojis', 'emojis.json');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('transferemojis')
        .setDescription('Adds a given emoji to a server.')
        .addSubcommand(
            (subcommand) => subcommand
                .setName('copy')
                .setDescription('Copies all the emojis from the server.'))
        .addSubcommand(
            (subcommand) => subcommand
                .setName('paste')
                .setDescription('Pastes all the emojis to the server.'))
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received
        // * successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply({
            flags: MessageFlags.Ephemeral,
        });

        const subcommand = interaction.options.getSubcommand();

        // * This gets all the emojis from the server.
        const emojis = await interaction.guild.emojis.fetch();

        const emojiCount = emojis.size;
        const serverTier = interaction.guild.premiumTier;
        let emojiLimit = 0;

        // * The switch checks the server tier, so it can obtain the emoji
        // * limit of the server.
        switch (serverTier) {
            case 0:
                emojiLimit = 50;
                break;
            case 1:
                emojiLimit = 100;
                break;
            case 2:
                emojiLimit = 150;
                break;
            case 3:
                emojiLimit = 250;
                break;
        }

        if (subcommand === 'copy') {
            const starterContainer = createContainer(
                `### ${process.env.EMOJI_MAGNIFYING}  Copying Emojis`,
                `There are \`${emojiCount}\`/\`${emojiLimit}\` emojis in ` +
                    'this server.',
            );

            await interaction.editReply({
                components: [starterContainer],
                flags: [MessageFlags.IsComponentsV2],
            });

            const urlList = [];

            // * This loops through all the emojis in the server and pushes
            // * them to the urlList array, which stores the name and a defined
            // * URL for the emoji. If it's animated the URL will be a 'gif',
            // * and the parameter will be set to 'quality=lossless', so the
            // * quality is not lost.
            emojis.forEach((emoji) => {
                urlList.push({
                    name: emoji.name,
                    url: `https://cdn.discordapp.com/emojis/${emoji.id}.` +
                        `${emoji.animated ? 'gif' : 'png'}?quality=lossless`,
                });
            });

            // * It writes/rewrites the JSON file with the emojis from the
            // * server.
            fs.writeFile(
                emojiFolder,
                JSON.stringify(urlList, null, 2),
                async (error) => {
                    if (error) {
                        const editedContainer = createResultsComponents(
                            starterContainer,
                            `${process.env.EMOJI_ERROR}  There was an error ` +
                                'copying the emojis from this server. Please ' +
                                'check the logs.',
                        );

                        console.log(
                            `${new Date()} >>> *** ERROR: transferemojis.js ` +
                                `(COPY) *** by ${interaction.user.id} ` +
                                `(${interaction.user.username})`,
                        );
                        console.error(error);

                        await interaction.editReply({
                            components: [editedContainer],
                        });
                    } else {
                        const editedContainer = createResultsComponents(
                            starterContainer,
                            `${process.env.EMOJI_CHECK}  Copied ` +
                                `\`${emojiCount}\` emojis from this server.`,
                        );

                        await interaction.editReply({
                            components: [editedContainer],
                        });
                    }
                });
        }

        if (subcommand === 'paste') {
            let pastedEmojis = [];

            // * This reads the JSON file as UTF-8.
            fs.readFile(emojiFolder, 'utf8', async (error, data) => {
                if (error) {
                    const errorContainer = createContainer(
                        `### ${process.env.EMOJI_ERROR}  Failed to Paste ` +
                            'Emojis',
                        'There was an error pasting the emojis to this ' +
                            'server. Please check the logs.',
                    );

                    console.log(
                        `${new Date()} >>> *** ERROR: transferemojis.js ` +
                            `(PASTE) *** by ${interaction.user.id} ` +
                            `(${interaction.user.username})`,
                    );
                    console.error(error);

                    await interaction.editReply({ 
                        components: [errorContainer],
                        flags: [MessageFlags.IsComponentsV2],
                    });

                    return;
                } else {
                    // * It parses the JSON file into an object.
                    pastedEmojis = JSON.parse(data);
                    let pastedEmojiCount = pastedEmojis.length;

                    let description =
                        `Pasting \`${pastedEmojiCount}\` emojis to this ` +
                            'server.\n' +
                            'This server already has ' +
                            `\`${emojiCount}\`/\`${emojiLimit}\` emojis in ` +
                            'this server.\n\n' +
                            'The Discord API only allows to upload 50 emojis ' +
                            'per hour, so the command might take more than ' +
                            'an hour if you are uploading more than 50.\n\n';

                    const spaceEmojis = emojiLimit - emojiCount;

                    // * If there's not enough space for all the emojis, it will
                    // * display a warning message.
                    if (spaceEmojis < pastedEmojiCount) {
                        description +=
                            '**NOTE:** This server only has ' +
                                `\`${spaceEmojis}\` slots left for new emojis.`;
                    }

                    const processContainer = createContainer(
                        `### ${process.env.EMOJI_MAGNIFYING}  Pasting Emojis`,
                        description,
                    );

                    await interaction.editReply({
                        components: [processContainer],
                        flags: [MessageFlags.IsComponentsV2],
                     });

                    // * This will upload the emojis one by one to the server.
                    // * The Discord API only allows to upload 50 emojis per
                    // * hour, so it will upload another batch the next hour,
                    // * and so on. It's important to mention this because the
                    // * API doesn't return an error and the bot needs to stay
                    // * online so all the emojis are uploaded.
                    for (const emoji of pastedEmojis) {
                        try {
                            const createdEmoji = await interaction.guild.emojis
                                .create({
                                    attachment: `${emoji.url}`,
                                    name: `${emoji.name}`,
                                });

                            console.log(
                                `${new Date()} >>> ${createdEmoji.name} was ` +
                                    'added to the server.',
                            );
                        } catch (pasteError) {
                            // * If the emoji can't be uploaded, the total
                            // * number will be decremented.
                            pastedEmojiCount--;

                            console.log(
                                `${new Date()} >>> *** ERROR PASTING EMOJI: ` +
                                    'transferemojis.js (PASTE) ' +
                                    `(${emoji.name}) *** by ` +
                                    `${interaction.user.id} ` +
                                    `(${interaction.user.username})`,
                            );
                            console.error(pasteError);
                        }
                    }

                    const successContainer = createContainer(
                        `### ${process.env.EMOJI_CHECK}  Emojis Pasted`,
                        `Pasted \`${pastedEmojiCount}\` emojis to this ` +
                            'server.\n\n' +
                            'Please check the logs if all the emojis have ' +
                            'not been pasted.',
                    );

                    // * Because it's possible that the command can take an
                    // * hour or more, the bot can't reply or follow up the
                    // * interaction (it's expired), so it will send a message
                    // * to the channel instead, and this can't be ephemeral.
                    await interaction.channel.send({ 
                        components: [successContainer],
                        flags: [MessageFlags.IsComponentsV2],
                     });
                }
            });
        }
    },
};

function createContainer(title, description) {
    const header1 = new TextDisplayBuilder()
        .setContent(title);

    const separator1 = new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small);

    const text1 = new TextDisplayBuilder()
        .setContent(description);

    const container = new ContainerBuilder()
        .setAccentColor(0x3498DB)
        .addTextDisplayComponents(header1)
        .addSeparatorComponents(separator1)
        .addTextDisplayComponents(text1);

    return container;
}

function createResultsComponents(container, message) {
    const separator2 = new SeparatorBuilder()
        .setSpacing(SeparatorSpacingSize.Small)
        .setDivider(false);

    const text2 = new TextDisplayBuilder()
        .setContent(message);

    container
        .addSeparatorComponents(separator2)
        .addTextDisplayComponents(text2);

    return container;
}
