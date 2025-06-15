const path = require('path');
const backup = require('discord-backup');
const moment = require('moment');
const {
    SlashCommandBuilder,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    ComponentType } = require('discord.js');

// * It gives the absolute path of the current file, and thes it goes back two
// * folders to get the 'backups' folder, and then the backup library will use
// * this folder to store the backups.
const backupFolder = path.join(__dirname, '../../backups');
backup.setStorageFolder(backupFolder);

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('backup')
        .setDescription('Provides tools for backup and restore a server.')
        .addSubcommand(
            (subcommand) => subcommand
                .setName('create')
                .setDescription('Creates a backup of the current server.'))
        .addSubcommand(
            (subcommand) => subcommand
                .setName('information')
                .setDescription(
                    'Shows information about a backup by providing the ID.')
                .addStringOption(
                    (option) => option
                        .setName('id')
                        .setDescription('The backup ID.')
                        .setRequired(true)))
        .addSubcommand(
            (subcommand) => subcommand
                .setName('load')
                .setDescription(
                    'Loads a backup into the current server by providing the ' +
                        'ID.')
                .addStringOption(
                    (option) => option
                        .setName('id')
                        .setDescription('The backup ID.')
                        .setRequired(true)))
        .addSubcommand(
            (subcommand) => subcommand
                .setName('delete')
                .setDescription('Deletes a backup by providing the ID.')
                .addStringOption(
                    (option) => option
                        .setName('id')
                        .setDescription('The backup ID.')
                        .setRequired(true)))
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received
        // * successfully and set a maximum timeout of 15 minutes.
        await interaction.deferReply({
            flags: [MessageFlags.Ephemeral],
        });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            // * Confirm Container.
            const confirmHeader = new TextDisplayBuilder()
                .setContent(
                    `### ${process.env.EMOJI_STOP}  Are you sure you want to ` +
                        'create a backup of this server?',
                );

            const confirmSeparator1 = new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Small);

            const confirmText = new TextDisplayBuilder()
                .setContent(
                    `Guild ID: \`${interaction.guild.id}\`\n` +
                        `Guild Name: \`${interaction.guild.name}\``,
                );

            const confirmSeparator2 = new SeparatorBuilder()
                .setSpacing(SeparatorSpacingSize.Small)
                .setDivider(false);

            const yesButton = new ButtonBuilder()
                .setCustomId('txtYes')
                .setLabel('Yes')
                .setStyle(ButtonStyle.Primary);

            const noButton = new ButtonBuilder()
                .setCustomId('txtNo')
                .setLabel('No')
                .setStyle(ButtonStyle.Danger);

            const confirmActionRow = new ActionRowBuilder()
                .addComponents([yesButton, noButton]);

            const confirmContainer = new ContainerBuilder()
                .setAccentColor(0x3498DB)
                .addTextDisplayComponents(confirmHeader)
                .addSeparatorComponents(confirmSeparator1)
                .addTextDisplayComponents(confirmText)
                .addSeparatorComponents(confirmSeparator2)
                .addActionRowComponents(confirmActionRow);
            
            const reply = await interaction.editReply({
                components: [confirmContainer],
                flags: [MessageFlags.IsComponentsV2],
            });

            const timeLeft = 1000 * 30;

            const collector = await reply.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time: timeLeft,
            });

            let deletedMessage = false;

            collector.on('collect', async (button) => {
                if (button.customId === 'txtYes') {
                    await button.deferUpdate();

                    deletedMessage = true;

                    // * The same container confirmation and buttons are
                    // * displaying but disabled, so the user can't click on it
                    // * again during the process.
                    yesButton.setDisabled(true);
                    noButton.setDisabled(true);

                    await interaction.editReply({
                        components: [confirmContainer],
                    });

                    backup.create(interaction.guild, {
                        jsonBeautify: true,
                        saveImages: 'base64',
                        maxMessagesPerChannel: 10,
                    }).then (async (backupData) => {
                        // * This container is sent to the user through a DM.
                        const dmHeader = new TextDisplayBuilder()
                            .setContent(
                                `### ${process.env.EMOJI_CHECK}  ` +
                                    'Backup Created',
                            );

                        const dmSeparator = new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Small);

                        const dmText = new TextDisplayBuilder()
                            .setContent(
                                `Backup ID: \`${backupData.id}\`\n` +
                                    'Guild Name: ' +
                                    `\`${interaction.guild.name}\`\n` +
                                    `Guild ID: \`${interaction.guild.id}\``,
                            );

                        const dmContainer = new ContainerBuilder()
                            .setAccentColor(0x3498DB)
                            .addTextDisplayComponents(dmHeader)
                            .addSeparatorComponents(dmSeparator)
                            .addTextDisplayComponents(dmText);

                        await interaction.user.send({
                            components: [dmContainer],
                            flags: [MessageFlags.IsComponentsV2],
                        });

                        // * This container is sent to the user in the same
                        // * channel where the command was executed.
                        const confirmationHeader = new TextDisplayBuilder()
                            .setContent(
                                `### ${process.env.EMOJI_CHECK}  The backup ` +
                                    'has been created',
                            );

                        const confirmationSeparator = new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Small);

                        const confirmationText = new TextDisplayBuilder()
                            .setContent(
                                'A copy of the summary has been sent to ' +
                                'your DMs!\n\n' +
                                `Backup ID: \`${backupData.id}\`\n` +
                                    'Guild Name: ' +
                                    `\`${interaction.guild.name}\`\n` +
                                    `Guild ID: \`${interaction.guild.id}\``,
                            );

                        const confirmationContainer = new ContainerBuilder()
                            .setAccentColor(0x3498DB)
                            .addTextDisplayComponents(confirmationHeader)
                            .addSeparatorComponents(confirmationSeparator)
                            .addTextDisplayComponents(confirmationText);
                        
                        await interaction.followUp({
                            components: [confirmationContainer],
                            flags: [
                                MessageFlags.IsComponentsV2,
                                MessageFlags.Ephemeral,
                            ],
                        });

                        await interaction.deleteReply();
                    }).catch (async (error) => {
                        // * Error Container.
                        const errorHeader = new TextDisplayBuilder()
                            .setContent(
                                `### ${process.env.EMOJI_ERROR}  Failed to ` +
                                    'Create Backup',
                            );

                        const errorSeparator = new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Small);

                        const errorText = new TextDisplayBuilder()
                            .setContent(
                                'Error creating a backup. Please try again ' +
                                    'or check the logs.',
                            );
                        
                        const errorContainer = new ContainerBuilder()
                            .setAccentColor(0x3498DB)
                            .addTextDisplayComponents(errorHeader)
                            .addSeparatorComponents(errorSeparator)
                            .addTextDisplayComponents(errorText);

                        console.log(
                            `${new Date()} >>> *** ERROR: backup.js (CREATE) ` +
                                `*** by ${interaction.user.id} ` +
                                `(${interaction.user.username})`,
                        );
                        console.error(error);

                        await interaction.editReply({
                            components: [errorContainer],
                        });
                    });
                }

                if (button.customId === 'txtNo') {
                    deletedMessage = true;

                    await interaction.deleteReply();
                }
            });

            collector.on('end', async () => {
                // * Only the message is deleted through here if the user
                // * doesn't reply in the indicated time.
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

                // * Information Container.
                const informationHeader = new TextDisplayBuilder()
                    .setContent(
                        `### ${process.env.EMOJI_SUMMARY}  Backup Information`,
                    );

                const informationSeparator = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small);

                const informationText = new TextDisplayBuilder()
                    .setContent(
                        `Backup ID: \`${backupInformation.id}\`\n` +
                            'Server ID: ' +
                            `\`${backupInformation.data.guildID}\`\n` +
                            'Backup Size: ' +
                            `\`${backupInformation.size} MB\`\n` +
                            `Created At: \`${formatedDate}\``,
                    );

                const informationContainer = new ContainerBuilder()
                    .setAccentColor(0x3498DB)
                    .addTextDisplayComponents(informationHeader)
                    .addSeparatorComponents(informationSeparator)
                    .addTextDisplayComponents(informationText);

                await interaction.editReply({
                    components: [informationContainer],
                    flags: [MessageFlags.IsComponentsV2],
                });
            }).catch (async (error) => {
                const errorHeader = new TextDisplayBuilder()
                    .setContent(
                        `### ${process.env.EMOJI_MAGNIFYING}  Backup Not Found`,
                    );

                const errorSeparator = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small);

                const errorText = new TextDisplayBuilder()
                    .setContent(
                        `No backup found with the ID: \`${backupId}\`.`,
                    );
                
                const errorContainer = new ContainerBuilder()
                    .setAccentColor(0x3498DB)
                    .addTextDisplayComponents(errorHeader)
                    .addSeparatorComponents(errorSeparator)
                    .addTextDisplayComponents(errorText);

                console.log(
                    `${new Date()} >>> *** ERROR: backup.js (INFORMATION) ` +
                        `*** by ${interaction.user.id} ` +
                        `(${interaction.user.username})`,
                );
                console.error(error);

                await interaction.editReply({
                    components: [errorContainer],
                    flags: [MessageFlags.IsComponentsV2],
                });
            });
        }

        if (subcommand === 'load') {
            const backupId = interaction.options.getString('id');

            backup.fetch(backupId)
            .then (async (backupInformation) => {
                const date = moment(backupInformation.data.createdTimestamp);
                const formatedDate = date.format('MM/DD/YYYY HH:mm:ss');

                // * Confirm Container.
                const confirmHeader = new TextDisplayBuilder()
                    .setContent(
                        `### ${process.env.EMOJI_STOP}  Load Confirmation`,
                    );

                const confirmSeparator1 = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small);

                const confirmText = new TextDisplayBuilder()
                    .setContent(
                        'Are you sure you want to load this backup? This ' +
                            'will delete all channels, roles, messages, ' +
                            'emojis, bans, etc.\n\n' +
                            `Backup ID: \`${backupInformation.id}\`\n` +
                            'Server ID: ' +
                            `\`${backupInformation.data.guildID}\`\n` +
                            'Backup Size: ' +
                            `\`${backupInformation.size} MB\`\n` +
                            `Created At: \`${formatedDate}\``,
                    );

                const confirmSeparator2 = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(false);

                const yesButton = new ButtonBuilder()
                    .setCustomId('txtYes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Primary);
                    
                const noButton = new ButtonBuilder()
                    .setCustomId('txtNo')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger);

                const confirmActionRow = new ActionRowBuilder()
                    .addComponents([yesButton, noButton]);

                const confirmContainer = new ContainerBuilder()
                    .setAccentColor(0x3498DB)
                    .addTextDisplayComponents(confirmHeader)
                    .addSeparatorComponents(confirmSeparator1)
                    .addTextDisplayComponents(confirmText)
                    .addSeparatorComponents(confirmSeparator2)
                    .addActionRowComponents(confirmActionRow);

                const reply = await interaction.editReply({
                    components: [confirmContainer],
                    flags: [MessageFlags.IsComponentsV2],
                });

                const timeLeft = 1000 * 30;

                const collector = await reply.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: timeLeft,
                });

                let deletedMessage = false;

                collector.on('collect', async (button) => {
                    if (button.customId === 'txtYes') {
                        await button.deferUpdate();

                        deletedMessage = true;

                        backup.load(backupId, interaction.guild, {
                            clearGuildBeforeRestore: true,
                        }).then(() => {
                            console.log('*** Backup Load ***');
                            console.log(
                                `The backup with the ID ${backupId} was ` +
                                    'loaded successfully.',
                            );
                        }).catch (async (error) => {
                            // * Error Container.
                            const errorHeader = new TextDisplayBuilder()
                                .setContent(
                                    `### ${process.env.EMOJI_ERROR}  ` +
                                        'Backup Load Error',
                                );

                            const errorSeparator = new SeparatorBuilder()
                                .setSpacing(SeparatorSpacingSize.Small);

                            const errorText = new TextDisplayBuilder()
                                .setContent(
                                    'Error while loading the backup. Please ' +
                                        'check the logs.',
                                );

                            const errorContainer = new ContainerBuilder()
                                .setAccentColor(0x3498DB)
                                .addTextDisplayComponents(errorHeader)
                                .addSeparatorComponents(errorSeparator)
                                .addTextDisplayComponents(errorText);

                            console.log(
                                `${new Date()} >>> *** ERROR: backup.js ` +
                                    `(LOAD) *** by ${interaction.user.id} ` +
                                    `(${interaction.user.username})`,
                            );
                            console.error(error);

                            await interaction.user.send({
                                components: [errorContainer],
                                flags: [MessageFlags.IsComponentsV2],
                            });
                        });
                    }

                    if (button.customId === 'txtNo') {
                        deletedMessage = true;
    
                        await interaction.deleteReply();
                    }
                });

                collector.on('end', async () => {
                    // * Only the message is deleted through here if the user
                    // * doesn't reply in the indicated time.
                    if (!deletedMessage) {
                        await interaction.deleteReply();
                    }
                });
            }).catch (async (error) => {
                const notFoundHeader = new TextDisplayBuilder()
                    .setContent(
                        `### ${process.env.EMOJI_MAGNIFYING}  Backup Not Found`,
                    );

                const notFoundSeparator = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small);

                const notFoundText = new TextDisplayBuilder()
                    .setContent(
                        `No backup found with the ID: \`${backupId}\`.`,
                    );

                const notFoundContainer = new ContainerBuilder()
                    .setAccentColor(0x3498DB)
                    .addTextDisplayComponents(notFoundHeader)
                    .addSeparatorComponents(notFoundSeparator)
                    .addTextDisplayComponents(notFoundText);

                console.log(
                    `${new Date()} >>> *** ERROR: backup.js (LOAD-FETCH) *** ` +
                        `by ${interaction.user.id} ` +
                        `(${interaction.user.username})`,
                );
                console.error(error);

                await interaction.followUp({
                    components: [notFoundContainer],
                    flags: [
                        MessageFlags.IsComponentsV2,
                        MessageFlags.Ephemeral,
                    ],
                });
            });
        }

        if (subcommand === 'delete') {
            const backupId = interaction.options.getString('id');

            backup.fetch(backupId)
            .then(async (backupInformation) => {
                const date = moment(backupInformation.data.createdTimestamp);
                const formatedDate = date.format('MM/DD/YYYY HH:mm:ss');

                // * Confirm Container.
                const confirmHeader = new TextDisplayBuilder()
                    .setContent(
                        `### ${process.env.EMOJI_STOP}  Delete Confirmation`,
                    );

                const confirmSeparator1 = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small);

                const confirmText = new TextDisplayBuilder()
                    .setContent(
                        'Are you sure you want to delete this backup?\n\n' +
                            `Backup ID: \`${backupInformation.id}\`\n` +
                            'Server ID: ' +
                            `\`${backupInformation.data.guildID}\`\n` +
                            'Backup Size: ' +
                            `\`${backupInformation.size} MB\`\n` +
                            `Created At: \`${formatedDate}\``,
                    );

                const confirmSeparator2 = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small)
                    .setDivider(false);

                const yesButton = new ButtonBuilder()
                    .setCustomId('txtYes')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Primary);
                    
                const noButton = new ButtonBuilder()
                    .setCustomId('txtNo')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger);

                const confirmActionRow = new ActionRowBuilder()
                    .addComponents([yesButton, noButton]);

                const confirmContainer = new ContainerBuilder()
                    .setAccentColor(0x3498DB)
                    .addTextDisplayComponents(confirmHeader)
                    .addSeparatorComponents(confirmSeparator1)
                    .addTextDisplayComponents(confirmText)
                    .addSeparatorComponents(confirmSeparator2)
                    .addActionRowComponents(confirmActionRow);

                const reply = await interaction.editReply({
                    components: [confirmContainer],
                    flags: [MessageFlags.IsComponentsV2],
                });

                const timeLeft = 1000 * 30;

                const collector = await reply.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: timeLeft,
                });

                let deletedMessage = false;

                collector.on('collect', async (button) => {
                    if (button.customId === 'txtYes') {
                        await button.deferUpdate();

                        deletedMessage = true;

                        backup.remove(backupId);

                        // * Confirmation Container.
                        const confirmationHeader = new TextDisplayBuilder()
                            .setContent(
                                `### ${process.env.EMOJI_CHECK}  Deletion ` +
                                    'Confirmation',
                            );

                        const confirmationSeparator = new SeparatorBuilder()
                            .setSpacing(SeparatorSpacingSize.Small);

                        const confirmationText = new TextDisplayBuilder()
                            .setContent(
                                `The backup with the ID \`${backupId}\` was ` +
                                    'deleted successfully.',
                            );

                        const confirmationContainer = new ContainerBuilder()
                            .setAccentColor(0x3498DB)
                            .addTextDisplayComponents(confirmationHeader)
                            .addSeparatorComponents(confirmationSeparator)
                            .addTextDisplayComponents(confirmationText);

                        await interaction.followUp({
                            components: [confirmationContainer],
                            flags: [
                                MessageFlags.IsComponentsV2,
                                MessageFlags.Ephemeral,
                            ],
                        });
                        await interaction.deleteReply();
                    }

                    if (button.customId === 'txtNo') {
                        deletedMessage = true;
    
                        await interaction.deleteReply();
                    }
                });

                collector.on('end', async () => {
                    // * Only the message is deleted through here if the user
                    // * doesn't reply in the indicated time.
                    if (!deletedMessage) {
                        await interaction.deleteReply();
                    }
                });
            }).catch (async (error) => {
                // * Not Found Container.
                const notFoundHeader = new TextDisplayBuilder()
                    .setContent(
                        `### ${process.env.EMOJI_MAGNIFYING}  Backup Not Found`,
                    );

                const notFoundSeparator = new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Small);

                const notFoundText = new TextDisplayBuilder()
                    .setContent(
                        `No backup found with the ID: \`${backupId}\`.`,
                    );

                const notFoundContainer = new ContainerBuilder()
                    .setAccentColor(0x3498DB)
                    .addTextDisplayComponents(notFoundHeader)
                    .addSeparatorComponents(notFoundSeparator)
                    .addTextDisplayComponents(notFoundText);

                console.log(
                    `${new Date()} >>> *** ERROR: backup.js (DELETE) *** by ` +
                        `${interaction.user.id} (${interaction.user.username})`,
                );
                console.error(error);

                await interaction.followUp({
                    components: [notFoundContainer],
                    flags: [
                        MessageFlags.IsComponentsV2,
                        MessageFlags.Ephemeral,
                    ],
                });
            });
        }
    },
};
