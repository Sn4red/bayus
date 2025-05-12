const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

// * It gives the absolute path of the current file, and thes it goes back two folders to get the 'emojis' folder
// * and the 'emojis.json' file.
const emojiFolder = path.join(__dirname, '../../emojis', 'emojis.json');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('transferemojis')
        .setDescription('Adds a given emoji to a server.')
        .addSubcommand((subcommand) => subcommand.setName('copy').setDescription('Copies all the emojis from the server.'))
        .addSubcommand((subcommand) => subcommand.setName('paste').setDescription('Pastes all the emojis to the server.'))
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply({ ephemeral: true });

        const subcommand = interaction.options.getSubcommand();

        // * This gets all the emojis from the server.
        const emojis = await interaction.guild.emojis.fetch();

        const emojiCount = emojis.size;
        const serverTier = interaction.guild.premiumTier;
        let emojiLimit = 0;

        // * The switch checks the server tier, so it can obtain the emoji limit of the server.
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
            const emojiCountEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setDescription(`**Copying Emojis** ${process.env.EMOJI_MAGNIFYING}\n\n` +
                                `There are \`${emojiCount}\`/\`${emojiLimit}\` emojis in this server.\n`);

            await interaction.editReply({ embeds: [emojiCountEmbed] });

            const urlList = [];

            // * This loops through all the emojis in the server and pushes them to the urlList array, which
            // * stores the name and a defined URL for the emoji.
            // * If it's animated the URL will be a 'gif', and the parameter will be set to 'quality=lossless', so the quality is not lost.
            emojis.forEach((emoji) => {
                urlList.push({
                    name: emoji.name,
                    url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?quality=lossless`,
                });
            });

            // * It writes/rewrites the JSON file with the emojis from the server.
            fs.writeFile(emojiFolder, JSON.stringify(urlList, null, 2), async (error) => {
                if (error) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0x3498DB)
                        .setDescription(`**Failed to Copy Emojis** ${process.env.EMOJI_ERROR}\n\n` +
                                        'There was an error copying the emojis from this server. Please check the logs.');

                    console.log(`${new Date()} >>> *** ERROR: transferemojis.js (COPY) *** by ${interaction.user.id} (${interaction.user.username})`);
                    console.error(error);

                    await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
                } else {
                    const successEmbed = new EmbedBuilder()
                        .setColor(0x3498DB)
                        .setDescription(`**Emojis Copied** ${process.env.EMOJI_CHECK}\n\n` +
                                        `Copied \`${emojiCount}\` emojis from this server.`);

                    await interaction.followUp({ embeds: [successEmbed], ephemeral: true });
                }
            });
        }

        if (subcommand === 'paste') {
            let pastedEmojis = [];

            // * This reads the JSON file as UTF-8.
            fs.readFile(emojiFolder, 'utf8', async (error, data) => {
                if (error) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(0x3498DB)
                        .setDescription(`**Failed to Paste Emojis** ${process.env.EMOJI_ERROR}\n\n` +
                                        'There was an error pasting the emojis to this server. Please check the logs.');

                    console.log(`${new Date()} >>> *** ERROR: transferemojis.js (PASTE) *** by ${interaction.user.id} (${interaction.user.username})`);
                    console.error(error);

                    await interaction.editReply({ embeds: [errorEmbed] });
                    return;
                } else {
                    // * It parses the JSON file into an object.
                    pastedEmojis = JSON.parse(data);
                    let pastedEmojiCount = pastedEmojis.length;

                    let descriptionEmbed = `**Pasting Emojis** ${process.env.EMOJI_MAGNIFYING}\n\n` +
                                            `Pasting \`${pastedEmojiCount}\` emojis to this server.\n` +
                                            `This server already has \`${emojiCount}\`/\`${emojiLimit}\` emojis in this server.\n\n` +
                                            'The Discord API only allows to upload 50 emojis per hour, so the command might take more ' +
                                            'than an hour if you are uploading more than 50.\n\n';

                    const spaceEmojis = emojiLimit - emojiCount;

                    // * If there's not enough space for all the emojis, it will display a warning message.
                    if (spaceEmojis < pastedEmojiCount) {
                        descriptionEmbed += `**NOTE:** This server only has \`${spaceEmojis}\` slots left for new emojis.`;
                    }

                    const emojiCountEmbed = new EmbedBuilder()
                        .setColor(0x3498DB)
                        .setDescription(descriptionEmbed);
                    
                    await interaction.editReply({ embeds: [emojiCountEmbed] });

                    // * This will upload the emojis one by one to the server. The Discord API only allows to
                    // * upload 50 emojis per hour, so it will upload another batch the next hour, and so on.
                    // * It's important to mention this because the API doesn't return an error and the bot needs to
                    // * stay online so all the emojis are uploaded.
                    for (const emoji of pastedEmojis) {
                        try {
                            const createdEmoji = await interaction.guild.emojis.create({
                                attachment: `${emoji.url}`,
                                name: `${emoji.name}`,
                            });

                            console.log(`${new Date()} >>> ${createdEmoji.name} was added to the server.`);
                        } catch (pasteError) {
                            // * If the emoji can't be uploaded, the total number will be decremented.
                            pastedEmojiCount--;

                            console.log(`${new Date()} >>> *** ERROR PASTING EMOJI: transferemojis.js (PASTE) (${emoji.name}) *** by ${interaction.user.id} (${interaction.user.username})`);
                            console.error(pasteError);
                        }
                    }

                    const successEmbed = new EmbedBuilder()
                        .setColor(0x3498DB)
                        .setDescription(`**Emojis Pasted** ${process.env.EMOJI_CHECK}\n\n` +
                                        `Pasted \`${pastedEmojiCount}\` emojis to this server.\n\n` +
                                        'Please check the logs if all the emojis have not been pasted.');

                    await interaction.channel.send({ embeds: [successEmbed], ephemeral: true });
                }
            });
        }
    },
};