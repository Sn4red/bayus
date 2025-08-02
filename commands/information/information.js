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
    ContainerBuilder,
} = require('discord.js');

const path = require('node:path');
const sharp = require('sharp');

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

        // * Banner Image.
        const bannerImagePath = path
            .join(__dirname, '../../images/container/information-image-1.jpg');

        const bannerImageBuffer = await sharp(bannerImagePath)
            .resize(570, 70)
            .toBuffer();

        const bannerImage = new AttachmentBuilder(
            bannerImageBuffer,
            { name: 'information-image-1.jpg' },
        );

        // * Thumbnail Image.
        const thumbnailImagePath = path
            .join(__dirname, '../../images/container/information-image-2.gif');

        const thumbnailImage = new AttachmentBuilder(
            thumbnailImagePath,
            { name: 'information-image-2.gif' },
        );

        // * Banner.
        const bannerMediaGalleryItem = new MediaGalleryItemBuilder()
            .setURL('attachment://information-image-1.jpg');

        const bannerMediaGallery = new MediaGalleryBuilder()
            .addItems(bannerMediaGalleryItem);

        // * Header.
        const header = new TextDisplayBuilder()
            .setContent(
                '## Welcome to the Official SCP Collector Discord Server!',
            );

        // * Separator 1.
        const separator1 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        // * Section.
        const textSection = new TextDisplayBuilder()
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

        const thumbnailSection = new ThumbnailBuilder()
            .setURL('attachment://information-image-2.gif');
            
        const section = new SectionBuilder()
            .addTextDisplayComponents(textSection)
            .setThumbnailAccessory(thumbnailSection);

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

        // * Footer.
        const footer = new TextDisplayBuilder()
            .setContent(
                `### Secure, Contain, Protect  ${process.env.EMOJI_SCP}`,
            );

        // * Separator 7.
        const separator7 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Large)
            .setDivider(false);

        // * Channels Header.
        const headerChannels = new TextDisplayBuilder()
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
            .addMediaGalleryComponents(bannerMediaGallery)
            .addTextDisplayComponents(header)
            .addSeparatorComponents(separator1)
            .addSectionComponents(section)
            .addSeparatorComponents(separator2)
            .addTextDisplayComponents(text1)
            .addSeparatorComponents(separator3)
            .addTextDisplayComponents(text2)
            .addSeparatorComponents(separator4)
            .addTextDisplayComponents(text3)
            .addSeparatorComponents(separator5)
            .addTextDisplayComponents(text4)
            .addSeparatorComponents(separator6)
            .addTextDisplayComponents(footer)
            .addSeparatorComponents(separator7)
            .addTextDisplayComponents(headerChannels)
            .addSeparatorComponents(separator8)
            .addTextDisplayComponents(text5);

        // * Sends the container to the #information channel.
        const channel = interaction.client.channels.cache
            .get(process.env.DISCORD_INFORMATION_CHANNEL_ID);

        if (channel) {
            await channel.send({
                components: [container],
                files: [bannerImage, thumbnailImage],
                flags: [MessageFlags.IsComponentsV2],
            });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};
