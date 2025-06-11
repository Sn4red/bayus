const path = require('node:path');
const sharp = require('sharp');
const {
    SlashCommandBuilder,
    AttachmentBuilder,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
    MediaGalleryItemBuilder,
    MediaGalleryBuilder,
    SectionBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('braindump')
        .setDescription('Personal resources for Sn4red.')
        .setContexts(['Guild']),
    async execute(interaction) {
        // * Notifies the Discord API that the interaction was received
        // * successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        // * Image 1.
        const image1Path = path
            .join(__dirname, '../../images/container/brain-dump-image-1.jpg');

        const buffer1 = await sharp(image1Path)
            .resize(320, 70)
            .toBuffer();

        const image1 = new AttachmentBuilder(
            buffer1,
            { name: 'brain-dump-image-1.jpg' },
        );

        const mediaGalleryItem1Component1 = new MediaGalleryItemBuilder()
            .setURL('attachment://brain-dump-image-1.jpg');

        const mediaGallery1 = new MediaGalleryBuilder()
            .addItems(mediaGalleryItem1Component1);

        // * Header 1.
        const header1 = new TextDisplayBuilder()
            .setContent('## Sn4red\'s Brain Dump');

        // * Separator 1.
        const separator1 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        // * Header 2.
        const header2 = new TextDisplayBuilder()
            .setContent('### Leisure');

        // * Leisure Sections.
        const sectionComponentAnime = sectionContainer(
            `${process.env.EMOJI_ANIME_BLANKET}  Anime`,
            process.env.GOOGLE_DRIVE_ANIME_URL,
        );
        const sectionComponentMovies = sectionContainer(
            `${process.env.EMOJI_MOVIE}  Movies`,
            process.env.GOOGLE_DRIVE_MOVIES_URL,
        );
        const sectionComponentMusic = sectionContainer(
            `${process.env.EMOJI_MUSIC}  Music`,
            process.env.GOOGLE_DRIVE_MUSIC_URL,
        );
        const sectionComponentSeries = sectionContainer(
            `${process.env.EMOJI_POPCORN}  Series`,
            process.env.GOOGLE_DRIVE_SERIES_URL,
        );

        // * Header 3.
        const header3 = new TextDisplayBuilder()
            .setContent('### Essentials');

        // * Essentials Sections.
        const sectionComponentFirebase = sectionContainer(
            `${process.env.EMOJI_FIREBASE}  Firebase`,
            process.env.FIREBASE_URL,
        );
        const sectionComponentDiscordDeveloperPortal = sectionContainer(
            `${process.env.EMOJI_DISCORD}  Discord Developer Portal`,
            process.env.DISCORD_DEVELOPER_PORTAL_URL,
        );
        const sectionComponentAWS = sectionContainer(
            `${process.env.EMOJI_AWS}  AWS`,
            process.env.AWS_URL,
        );
        const sectionComponentGitHub = sectionContainer(
            `${process.env.EMOJI_GITHUB}  GitHub`,
            process.env.GITHUB_URL,
        );

        // * Container.
        const container = new ContainerBuilder()
            .setAccentColor(0x3498DB)
            .addMediaGalleryComponents(mediaGallery1)
            .addTextDisplayComponents(header1)
            .addSeparatorComponents(separator1)
            .addTextDisplayComponents(header2)
            .addSectionComponents(sectionComponentAnime)
            .addSectionComponents(sectionComponentMovies)
            .addSectionComponents(sectionComponentMusic)
            .addSectionComponents(sectionComponentSeries)
            .addTextDisplayComponents(header3)
            .addSectionComponents(sectionComponentFirebase)
            .addSectionComponents(sectionComponentDiscordDeveloperPortal)
            .addSectionComponents(sectionComponentAWS)
            .addSectionComponents(sectionComponentGitHub);

        // * Sends the container to the #brain-dump channel.
        const channel = interaction.client.channels.cache
            .get(process.env.DISCORD_BRAIN_DUMP_CHANNEL_ID);

        if (channel) {
            await channel.send({
                components: [container],
                files: [image1],
                flags: MessageFlags.IsComponentsV2,
            });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};

function sectionContainer(text, url) {
    const textSection = new TextDisplayBuilder()
        .setContent(text);

    const buttonSection = new ButtonBuilder()
        .setURL(url)    
        .setLabel('Open')
        .setStyle(ButtonStyle.Link);

    const section = new SectionBuilder()
        .addTextDisplayComponents(textSection)
        .setButtonAccessory(buttonSection);
        
    return section;
}
