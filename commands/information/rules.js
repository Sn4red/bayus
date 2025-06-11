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
        .setName('rules')
        .setDescription('Rules for The Bunk3r server.')
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received
        // * successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        // * Image 1.
        const image1Path = path
            .join(__dirname, '../../images/container/rules-image-1.jpg');

        const buffer1 = await sharp(image1Path)
            .resize(570, 70)
            .toBuffer();

        const image1 = new AttachmentBuilder(
            buffer1,
            { name: 'rules-image-1.jpg' },
        );

        const mediaGalleryItem1Component1 = new MediaGalleryItemBuilder()
            .setURL('attachment://rules-image-1.jpg');

        const mediaGallery1 = new MediaGalleryBuilder()
            .addItems(mediaGalleryItem1Component1);

        // * Header 1.
        const header1 = new TextDisplayBuilder()
            .setContent(`## ${process.env.EMOJI_RULES}  Rules`);

        // * Separator 1.
        const separator1 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        // * Section 1.
        const textSection1 = new TextDisplayBuilder()
            .setContent(
                `${process.env.EMOJI_SMALL_WHITE_DASH}Respect everyone. Be ` +
                    'kind and respectful to all members. No harassment, hate ' +
                    'speech, or discrimination.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}Maintain the ` +
                    'channels english only.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}No spamming. Avoid ` +
                    'excessive messages, emojis, caps, or mentions.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}No NSFW content, ` +
                    'offensive material, or excessive profanity.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}No Self-Promotion. ` +
                    'Do not advertise or promote other servers, social ' +
                    'media, or businesses without permission.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}Stay On Topic. Use ` +
                    'the appropriate channels for different discussions.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}No Illegal ` +
                    'Activities. Do not share pirated content, hacking ' +
                    'tools, or anything illegal.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}No Impersonation. ` +
                    'Do not pretend to be someone else, including staff ' +
                    'members.\n' +
                    `${process.env.EMOJI_SMALL_WHITE_DASH}Listen to Staff. ` +
                    'Follow the instructions of moderators and admins.\n\n' +
                    '### Breaking these rules may result in warnings, ' +
                    'timeouts, or bans. Enjoy your stay! ' +
                    `${process.env.EMOJI_MIXED_STARS}`);

        const image2Path = path
            .join(__dirname, '../../images/container/rules-image-2.gif');

        const image2 = new AttachmentBuilder(
            image2Path,
            { name: 'rules-image-2.gif' },
        );

        const thumbnailSection1 = new ThumbnailBuilder()
            .setURL('attachment://rules-image-2.gif');

        const section1 = new SectionBuilder()
            .addTextDisplayComponents(textSection1)
            .setThumbnailAccessory(thumbnailSection1);

        // * Container.
        const container = new ContainerBuilder()
            .setAccentColor(0x3498DB)
            .addMediaGalleryComponents(mediaGallery1)
            .addTextDisplayComponents(header1)
            .addSeparatorComponents(separator1)
            .addSectionComponents(section1);

        // * Sends the container to the #rules channel.
        const channel = interaction.client.channels.cache
            .get(process.env.DISCORD_RULES_CHANNEL_ID);
        
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
