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
    ContainerBuilder,
} = require('discord.js');

const path = require('node:path');
const sharp = require('sharp');

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

        // * Banner Image.
        const bannerImagePath = path
            .join(__dirname, '../../images/container/brain-dump-image-1.jpg');

        const bannerImageBuffer = await sharp(bannerImagePath)
            .resize(320, 70)
            .toBuffer();

        const bannerImage = new AttachmentBuilder(
            bannerImageBuffer,
            { name: 'brain-dump-image-1.jpg' },
        );

        // * Banner.
        const bannerMediaGalleryItem = new MediaGalleryItemBuilder()
            .setURL('attachment://brain-dump-image-1.jpg');

        const bannerMediaGallery = new MediaGalleryBuilder()
            .addItems(bannerMediaGalleryItem);

        // * Header.
        const header = new TextDisplayBuilder()
            .setContent('## Sn4red\'s Brain Dump');

        // * Separator 1.
        const separator1 = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        // * Leisure Header.
        const headerLeisure = new TextDisplayBuilder()
            .setContent('### Leisure');

        // * Leisure Sections.
        const sectionAnime = createSection(
            `${process.env.EMOJI_ANIME_BLANKET}  Anime`,
            process.env.GOOGLE_DRIVE_ANIME_URL,
        );
        const sectionMovies = createSection(
            `${process.env.EMOJI_MOVIE}  Movies`,
            process.env.GOOGLE_DRIVE_MOVIES_URL,
        );
        const sectionMusic = createSection(
            `${process.env.EMOJI_MUSIC}  Music`,
            process.env.GOOGLE_DRIVE_MUSIC_URL,
        );
        const sectionSeries = createSection(
            `${process.env.EMOJI_POPCORN}  Series`,
            process.env.GOOGLE_DRIVE_SERIES_URL,
        );

        // * Essentials Header.
        const headerEssentials = new TextDisplayBuilder()
            .setContent('### Essentials');

        // * Essentials Sections.
        const sectionFirebase = createSection(
            `${process.env.EMOJI_FIREBASE}  Firebase`,
            process.env.FIREBASE_URL,
        );
        const sectionDiscordDeveloperPortal = createSection(
            `${process.env.EMOJI_DISCORD}  Discord Developer Portal`,
            process.env.DISCORD_DEVELOPER_PORTAL_URL,
        );
        const sectionAWS = createSection(
            `${process.env.EMOJI_AWS}  AWS`,
            process.env.AWS_URL,
        );
        const sectionGitHub = createSection(
            `${process.env.EMOJI_GITHUB}  GitHub`,
            process.env.GITHUB_URL,
        );
        const sectionFinances = createSection(
            `${process.env.EMOJI_PIXEL_CHART}  Finances`,
            process.env.GOOGLE_DRIVE_FINANCES_URL,
        );

        // * Container.
        const container = new ContainerBuilder()
            .setAccentColor(0x3498DB)
            .addMediaGalleryComponents(bannerMediaGallery)
            .addTextDisplayComponents(header)
            .addSeparatorComponents(separator1)
            .addTextDisplayComponents(headerLeisure)
            .addSectionComponents(sectionAnime)
            .addSectionComponents(sectionMovies)
            .addSectionComponents(sectionMusic)
            .addSectionComponents(sectionSeries)
            .addTextDisplayComponents(headerEssentials)
            .addSectionComponents(sectionFirebase)
            .addSectionComponents(sectionDiscordDeveloperPortal)
            .addSectionComponents(sectionAWS)
            .addSectionComponents(sectionGitHub)
            .addSectionComponents(sectionFinances);

        // * Sends the container to the #brain-dump channel.
        const channel = interaction.client.channels.cache
            .get(process.env.DISCORD_BRAIN_DUMP_CHANNEL_ID);

        if (channel) {
            await channel.send({
                components: [container],
                files: [bannerImage],
                flags: [MessageFlags.IsComponentsV2],
            });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};

function createSection(text, url) {
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
