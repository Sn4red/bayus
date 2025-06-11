const path = require('node:path');
const sharp = require('sharp');
const {
    SlashCommandBuilder,
    AttachmentBuilder,
    MessageFlags,
    MediaGalleryItemBuilder,
    MediaGalleryBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    ThumbnailBuilder,
    SectionBuilder,
    ContainerBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('information')
        .setDescription('Information about The Bunk3r server.')
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received
        // * successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        // * Image 1.
        const image1Path = path
            .join(__dirname, '../../images/container/information-image-1.jpg');

        const buffer1 = await sharp(image1Path)
            .resize(570, 70)
            .toBuffer();

        const image1 = new AttachmentBuilder(
            buffer1,
            { name: 'information-image-1.jpg' },
        );

        const mediaGalleryItem1Component1 = new MediaGalleryItemBuilder()
            .setURL('attachment://information-image-1.jpg');

        const mediaGallery1 = new MediaGalleryBuilder()
            .addItems(mediaGalleryItem1Component1);
        
        // * Header 1.
        const header1 = new TextDisplayBuilder()
            .setContent(
                '## Welcome to the Official SCP Collector Discord Server!',
            );

        // * Separator 1.
        const separator1 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        // * Section 1.
        const textSection1 = new TextDisplayBuilder()
            .setContent(
                'This server is a place for users of SCP Collector to ' +
                    'connect, collect and trade cards. You can collect not ' +
                    'only by making shots but also by exchanging cards with ' +
                    'others—feel free to use the designated channels for ' +
                    'these activities.\n\n' +
                    `${process.env.EMOJI_PIN}  **Please read the ` +
                    `[#rules](${process.env.DISCORD_RULES_CHANNEL_URL}) and ` +
                    'enjoy your stay!**',
            );

        const image2Path = path
            .join(__dirname, '../../images/container/information-image-2.gif');
            
        const image2 = new AttachmentBuilder(
            image2Path,
            { name: 'information-image-2.gif' },
        );

        const thumbnailSection1 = new ThumbnailBuilder()
            .setURL('attachment://information-image-2.gif');
            
        const section1 = new SectionBuilder()
            .addTextDisplayComponents(textSection1)
            .setThumbnailAccessory(thumbnailSection1);

        // * Separator 2.
        const separator2 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(false);

        // * Text 1.
        const text1 = new TextDisplayBuilder()
            .setContent(
                `### ${process.env.EMOJI_LIGHT_BULB}  Feedback & Issues\n` +
                    'Have any suggestions or problems with SCP Collector? ' +
                    'Let me know by filling out this form: ' +
                    '[Google Form](https://bit.ly/SCPCollector)',
                );

        // * Separator 3.
        const separator3 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(false);

        // * Text 2.
        const text2 = new TextDisplayBuilder()
            .setContent(
                `### ${process.env.EMOJI_CLIP}  Important Links\n` +
                    '- Discord Server Invite: ' +
                    '[The Bunk3r](https://discord.gg/PrfWkJchZg)\n' +
                    '- Official Patreon: ' +
                    '[patreon.com/Sn4red](https://www.patreon.com/Sn4red/)',
            );

        // * Separator 4.
        const separator4 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(false);

        // * Text 3.
        const text3 = new TextDisplayBuilder()
            .setContent(
                `### ${process.env.EMOJI_STOP}  New to SCP Collector?\n` +
                    'If this is your first time using SCP Collector, you ' +
                    'won’t be able to use commands until you run /`card`. ' +
                    'This will register you in the system. Feel free to ' +
                    'explore the information commands such as /`commands`.',
            );

        // * Separator 5.
        const separator5 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(false);

        // * Text 4.
        const text4 = new TextDisplayBuilder()
            .setContent(
                `### ${process.env.EMOJI_KIIROITORI_QUESTION}  FAQs\n` +
                    'For frequently asked questions, use /`faq`.',
            );

        // * Separator 6.
        const separator6 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small)
            .setDivider(false);

        // * Footer 1.
        const footer1 = new TextDisplayBuilder()
            .setContent(
                `### Secure, Contain, Protect  ${process.env.EMOJI_SCP}`,
            );

        // * Separator 7.
        const separator7 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Large)
            .setDivider(false);

        // * Header 2.
        const header2 = new TextDisplayBuilder()
            .setContent(
                `## ${process.env.EMOJI_CHANNEL}  Server Channels and Purpose`,
            );

        // * Separator 8.
        const separator8 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        // * Text 5.
        const text5 = new TextDisplayBuilder()
            .setContent(
                `**[#welcome](${process.env.DISCORD_WELCOME_CHANNEL_URL})** ` +
                    '- Text channel where Bayus bot welcomes.\n' +
                    `**[#rules](${process.env.DISCORD_RULES_CHANNEL_URL})** ` +
                    '- Server rules.\n' +
                    '**[#information]' +
                    `(${process.env.DISCORD_INFORMATION_CHANNEL_URL})** - ` +
                    'Information about the Discord server, its channels and ' +
                    'important links.\n' +
                    '**[#announcements]' +
                    `(${process.env.DISCORD_ANNOUNCEMENTS_CHANNEL_URL})** - ` +
                    'Important announcements and updates about SCP Collector ' +
                    'and the Discord server will be displayed here.\n' +
                    '**[#general-chat]' +
                    `(${process.env.DISCORD_GENERAL_CHAT_CHANNEL_URL})** - ` +
                    'Talk about anything with the community.\n' +
                    '**[#scp-general]' +
                    `(${process.env.DISCORD_SCP_GENERAL_URL})** - Talk about ` +
                    'anything related to SCP Collector or SCP topics.\n' +
                    `**[#scp-shots](${process.env.DISCORD_SCP_SHOTS_URL})** ` +
                    '- Place to use /`capture` but it\'s not mandatory.\n' +
                    '**[#scp-trades]' +
                    `(${process.env.DISCORD_SCP_TRADES_URL})** - Use this ` +
                    'channel to do trades with other users.',
            );

        // * Container.
        const container = new ContainerBuilder()
            .setAccentColor(0x3498DB)
            .addMediaGalleryComponents(mediaGallery1)
            .addTextDisplayComponents(header1)
            .addSeparatorComponents(separator1)
            .addSectionComponents(section1)
            .addSeparatorComponents(separator2)
            .addTextDisplayComponents(text1)
            .addSeparatorComponents(separator3)
            .addTextDisplayComponents(text2)
            .addSeparatorComponents(separator4)
            .addTextDisplayComponents(text3)
            .addSeparatorComponents(separator5)
            .addTextDisplayComponents(text4)
            .addSeparatorComponents(separator6)
            .addTextDisplayComponents(footer1)
            .addSeparatorComponents(separator7)
            .addTextDisplayComponents(header2)
            .addSeparatorComponents(separator8)
            .addTextDisplayComponents(text5);

        // * Sends the container to the #information channel.
        const channel = interaction.client.channels.cache
            .get(process.env.DISCORD_INFORMATION_CHANNEL_ID);

        if (channel) {
            await channel.send({
                components: [container],
                files: [image1, image2],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};
