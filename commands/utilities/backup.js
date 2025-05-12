const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonStyle, ButtonBuilder, ComponentType } = require('discord.js');
const path = require('path');
const backup = require('discord-backup');
const moment = require('moment');

// * It gives the absolute path of the current file, and thes it goes back two folders to get the 'backus' folder,
// * and then the backup library will use this folder to store the backups.
const backupFolder = path.join(__dirname, '../../backups');
backup.setStorageFolder(backupFolder);

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Provides tools for backup and restore a server.')
        .addSubcommand((subcommand) => subcommand.setName('create').setDescription('Creates a backup of the current server.'))
        .addSubcommand((subcommand) => subcommand.setName('information').setDescription('Shows information about a backup by providing the ID.').addStringOption((option) => option.setName('id')
                                                                                                                                                                                    .setDescription('The backup ID.')
                                                                                                                                                                                    .setRequired(true)))
        .addSubcommand((subcommand) => subcommand.setName('load').setDescription('Loads a backup into the current server by providing the ID.').addStringOption((option) => option.setName('id')
                                                                                                                                                                                    .setDescription('The backup ID.')
                                                                                                                                                                                    .setRequired(true)))
        .addSubcommand((subcommand) => subcommand.setName('delete').setDescription('Deletes a backup by providing the ID.').addStringOption((option) => option.setName('id')
                                                                                                                                                                .setDescription('The backup ID.')
                                                                                                                                                                .setRequired(true)))
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply({ ephemeral: true });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const confirmEmbed = new EmbedBuilder()
                .setColor(0x3498DB)
                .setDescription(`**Are you sure you want to create a backup of this server?** ${process.env.EMOJI_STOP}\n\n` +
                                `\`Guild ID\`: \`${interaction.guild.id}\`\n` +
                                `\`Guild Name\`: \`${interaction.guild.name}\``);

            const yesButton = new ButtonBuilder()
                .setCustomId('txtYes')
                .setLabel('Yes')
                .setStyle(ButtonStyle.Primary);

            const noButton = new ButtonBuilder()
                .setCustomId('txtNo')
                .setLabel('No')
                .setStyle(ButtonStyle.Danger);

            const row = new ActionRowBuilder();

            row.addComponents([yesButton, noButton]);
            
            const reply = await interaction.editReply({ embeds: [confirmEmbed], components: [row] });

            const time = 1000 * 30;

            const collector = await reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: time });

            let deletedMessage = false;

            collector.on('collect', async (button) => {
                if (button.customId === 'txtYes') {
                    await button.deferUpdate();

                    deletedMessage = true;

                    // * The same embed confirmation and button are displaying but disabled, so the user can't click on it again during the process.
                    yesButton.setDisabled(true);
                    noButton.setDisabled(true);

                    const disabledRow = new ActionRowBuilder();

                    disabledRow.addComponents([yesButton, noButton]);

                    await interaction.editReply({ embeds: [confirmEmbed], components: [disabledRow] });

                    backup.create(interaction.guild, {
                        jsonBeautify: true,
                        saveImages: 'base64',
                        maxMessagesPerChannel: 10,
                    }).then (async (backupData) => {
                        // * This embed is sent to the user through a DM.
                        const dmEmbed = new EmbedBuilder()
                            .setColor(0x3498DB)
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setDescription(`**Backup Created** ${process.env.EMOJI_CHECK}\n\n` +
                                            `\`Backup ID\`: \`${backupData.id}\`\n` +
                                            `\`Guild Name\`: \`${interaction.guild.name}\`\n` +
                                            `\`Guild ID\`: \`${interaction.guild.id}\``);

                        await interaction.user.send({ embeds: [dmEmbed] });

                        // * This embed is sent to the user in the same channel where the command was executed.
                        const confirmationEmbed = new EmbedBuilder()
                            .setColor(0x3498DB)
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setDescription(`The backup has been created. A copy of the summary has been sent to your DMs! ${process.env.EMOJI_CHECK}\n\n` +
                                            `\`Backup ID\`: \`${backupData.id}\`\n` +
                                            `\`Guild Name\`: \`${interaction.guild.name}\`\n` +
                                            `\`Guild ID\`: \`${interaction.guild.id}\``);
                        
                        await interaction.followUp({ embeds: [confirmationEmbed], ephemeral: true });
                        await interaction.deleteReply();
                    }).catch (async (error) => {
                        const errorEmbed = new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setColor(0x3498DB)
                            .setDescription(`**Failed to Create Backup** ${process.env.EMOJI_ERROR}\n\n` +
                                            'Error creating a backup. Please try again or check the logs.');

                        console.log(`${new Date()} >>> *** ERROR: backup.js (CREATE) *** by ${interaction.user.id} (${interaction.user.username})`);
                        console.error(error);

                        await interaction.editReply({ embeds: [errorEmbed] });
                    });
                }

                if (button.customId === 'txtNo') {
                    deletedMessage = true;

                    await interaction.deleteReply();
                }
            });

            collector.on('end', async () => {
                // * Only the message is deleted through here if the user doesn't reply in the indicated time.
                if (!deletedMessage) {
                    await interaction.deleteReply();
                }
            });
        }

        if (subcommand === 'information') {
            const backupId = interaction.options.getString('id');

            backup.fetch(backupId)
            .then (async (backupInformation) => {
                const date = moment(backupInformation.data.createdTimestamp);
                const formatedDate = date.format('MM/DD/YYYY HH:mm:ss');

                const informationEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor(0x3498DB)
                    .setDescription(`**Backup Information** ${process.env.EMOJI_SUMMARY}\n\n` +
                                    `\`Backup ID\`: \`${backupInformation.id}\`\n` +
                                    `\`Server ID\`: \`${backupInformation.data.guildID}\`\n` +
                                    `\`Backup Size\`: \`${backupInformation.size} MB\`\n` +
                                    `\`Created At\`: \`${formatedDate}\``);

                await interaction.followUp({ embeds: [informationEmbed] });
            }).catch (async (error) => {
                const notFoundEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor(0x3498DB)
                    .setDescription(`**Backup Not Found** ${process.env.EMOJI_MAGNIFYING}\n\n` +
                                    `No backup found with the ID: \`${backupId}\`.`);

                console.log(`${new Date()} >>> *** ERROR: backup.js (INFORMATION) *** by ${interaction.user.id} (${interaction.user.username})`);
                console.error(error);

                await interaction.followUp({ embeds: [notFoundEmbed] });
            });
        }

        if (subcommand === 'load') {
            const backupId = interaction.options.getString('id');

            backup.fetch(backupId)
            .then (async (backupInformation) => {
                const date = moment(backupInformation.data.createdTimestamp);
                const formatedDate = date.format('MM/DD/YYYY HH:mm:ss');

                const confirmEmbed = new EmbedBuilder()
                    .setColor(0x3498DB)
                    .setDescription(`**LOAD CONFIRMATION** ${process.env.EMOJI_STOP}\n\n` +
                                    'Are you sure you want to load this backup? This will delete all channels, roles, messages, ' +
                                    'emojis, bans, etc.\n\n' +
                                    `\`Backup ID\`: \`${backupInformation.id}\`\n` +
                                    `\`Server ID\`: \`${backupInformation.data.guildID}\`\n` +
                                    `\`Backup Size\`: \`${backupInformation.size} MB\`\n` +
                                    `\`Created At\`: \`${formatedDate}\``);

                const yesButton = new ButtonBuilder()
                    .setCustomId('txtYes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Primary);
                    
                const noButton = new ButtonBuilder()
                    .setCustomId('txtNo')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder();

                row.addComponents([yesButton, noButton]);

                const reply = await interaction.editReply({ embeds: [confirmEmbed], components: [row] });

                const time = 1000 * 30;

                const collector = await reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: time });

                let deletedMessage = false;

                collector.on('collect', async (button) => {
                    if (button.customId === 'txtYes') {
                        await button.deferUpdate();

                        deletedMessage = true;

                        backup.load(backupId, interaction.guild, { clearGuildBeforeRestore: true })
                        .then(() => {
                            console.log('*** Backup Load ***');
                            console.log(`The backup with the ID ${backupId} was loaded successfully.`);
                        }).catch (async (error) => {
                            const errorEmbed = new EmbedBuilder()
                                .setAuthor({
                                    name: interaction.user.username,
                                    iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                                })
                                .setColor(0x3498DB)
                                .setDescription(`**Backup Load Error** ${process.env.EMOJI_ERROR}\n\n` +
                                                'Error while loading the backup. Please check the logs.');

                            console.log(`${new Date()} >>> *** ERROR: backup.js (LOAD) *** by ${interaction.user.id} (${interaction.user.username})`);
                            console.error(error);

                            await interaction.user.send({ embeds: [errorEmbed] });
                        });
                    }

                    if (button.customId === 'txtNo') {
                        deletedMessage = true;
    
                        await interaction.deleteReply();
                    }
                });

                collector.on('end', async () => {
                    // * Only the message is deleted through here if the user doesn't reply in the indicated time.
                    if (!deletedMessage) {
                        await interaction.deleteReply();
                    }
                });
            }).catch (async (error) => {
                const notFoundEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor(0x3498DB)
                    .setDescription(`**Backup Not Found** ${process.env.EMOJI_MAGNIFYING}\n\n` +
                                    `No backup found with the ID: \`${backupId}\`.`);

                console.log(`${new Date()} >>> *** ERROR: backup.js (LOAD-FETCH) *** by ${interaction.user.id} (${interaction.user.username})`);
                console.error(error);

                await interaction.followUp({ embeds: [notFoundEmbed] });
            });
        }

        if (subcommand === 'delete') {
            const backupId = interaction.options.getString('id');

            backup.fetch(backupId)
            .then(async (backupInformation) => {
                const date = moment(backupInformation.data.createdTimestamp);
                const formatedDate = date.format('MM/DD/YYYY HH:mm:ss');

                const confirmEmbed = new EmbedBuilder()
                    .setColor(0x3498DB)
                    .setDescription(`**Delete Confirmation** ${process.env.EMOJI_STOP}\n\n` +
                                    'Are you sure you want to delete this backup?\n\n' +
                                    `\`Backup ID\`: \`${backupInformation.id}\`\n` +
                                    `\`Server ID\`: \`${backupInformation.data.guildID}\`\n` +
                                    `\`Backup Size\`: \`${backupInformation.size} MB\`\n` +
                                    `\`Created At\`: \`${formatedDate}\``);

                const yesButton = new ButtonBuilder()
                    .setCustomId('txtYes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Primary);
                    
                const noButton = new ButtonBuilder()
                    .setCustomId('txtNo')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger);

                const row = new ActionRowBuilder();

                row.addComponents([yesButton, noButton]);

                const reply = await interaction.editReply({ embeds: [confirmEmbed], components: [row] });

                const time = 1000 * 30;

                const collector = await reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: time });

                let deletedMessage = false;

                collector.on('collect', async (button) => {
                    if (button.customId === 'txtYes') {
                        await button.deferUpdate();

                        deletedMessage = true;

                        backup.remove(backupId);

                        const confirmationEmbed = new EmbedBuilder()
                            .setAuthor({
                                name: interaction.user.username,
                                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                            })
                            .setColor(0x3498DB)
                            .setDescription(`**Deletion Completed** ${process.env.EMOJI_CHECK}\n\n` +
                                            `The backup with the ID \`${backupId}\` was deleted successfully.`);

                        await interaction.followUp({ embeds: [confirmationEmbed], ephemeral: true });
                        await interaction.deleteReply();
                    }

                    if (button.customId === 'txtNo') {
                        deletedMessage = true;
    
                        await interaction.deleteReply();
                    }
                });

                collector.on('end', async () => {
                    // * Only the message is deleted through here if the user doesn't reply in the indicated time.
                    if (!deletedMessage) {
                        await interaction.deleteReply();
                    }
                });
            }).catch (async (error) => {
                const notFoundEmbed = new EmbedBuilder()
                    .setAuthor({
                        name: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setColor(0x3498DB)
                    .setDescription(`**Backup Not Found** ${process.env.EMOJI_MAGNIFYING}\n\n` +
                                    `No backup found with the ID: \`${backupId}\`.`);

                console.log(`${new Date()} >>> *** ERROR: backup.js (DELETE) *** by ${interaction.user.id} (${interaction.user.username})`);
                console.error(error);

                await interaction.followUp({ embeds: [notFoundEmbed] });
            });
        }
    },
};
