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
        .setName('rules')
        .setDescription('Rules for The Bunk3r server.')
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received
        // * successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        // * Banner Image.
        const bannerImagePath = path
            .join(__dirname, '../../images/container/rules-image-1.jpg');

        const bannerImageBuffer = await sharp(bannerImagePath)
            .resize(570, 70)
            .toBuffer();

        const bannerImage = new AttachmentBuilder(
            bannerImageBuffer,
            { name: 'rules-image-1.jpg' },
        );

        // * Thumbnail Image.
        const thumbnailImagePath = path
            .join(__dirname, '../../images/container/rules-image-2.gif');

        const thumbnailImage = new AttachmentBuilder(
            thumbnailImagePath,
            { name: 'rules-image-2.gif' },
        );

        // * Banner.
        const bannerMediaGalleryItem = new MediaGalleryItemBuilder()
            .setURL('attachment://rules-image-1.jpg');

        const bannerMediaGallery = new MediaGalleryBuilder()
            .addItems(bannerMediaGalleryItem);

        // * Header.
        const header = new TextDisplayBuilder()
            .setContent(`## ${process.env.EMOJI_RULES}  Rules`);

        // * Separator.
        const separator = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        // * Section.
        const textSection = new TextDisplayBuilder()
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

        const thumbnailSection = new ThumbnailBuilder()
            .setURL('attachment://rules-image-2.gif');

        const section = new SectionBuilder()
            .addTextDisplayComponents(textSection)
            .setThumbnailAccessory(thumbnailSection);

        // * Container.
        const container = new ContainerBuilder()
            .setAccentColor(0x3498DB)
            .addMediaGalleryComponents(bannerMediaGallery)
            .addTextDisplayComponents(header)
            .addSeparatorComponents(separator)
            .addSectionComponents(section);

        // * Sends the container to the #rules channel.
        const channel = interaction.client.channels.cache
            .get(process.env.DISCORD_RULES_CHANNEL_ID);
        
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
