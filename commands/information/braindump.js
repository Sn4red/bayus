const path = require('node:path');
const sharp = require('sharp');
const {
    SlashCommandBuilder,
    AttachmentBuilder,
    MessageFlags,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize,
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
        // * Notifies the Discord API that the interaction was received successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        const backgroundPath = path.join(__dirname, '../../images/embed/brain-dump-image-1.jpg');

        const buffer = await sharp(backgroundPath)
            .resize(320, 70)
            .toBuffer();

        const background = new AttachmentBuilder(buffer, { name: 'brain-dump-image-1.jpg' });

        const MediaGalleryComponent = new MediaGalleryBuilder()
            .addItems(
                (mediaGalleryItem) => mediaGalleryItem
                    .setURL('attachment://brain-dump-image-1.jpg'),
            );

        const header = new TextDisplayBuilder()
            .setContent('## Sn4red\'s Brain Dump');

        const separator = new SeparatorBuilder()
            .setSpacing(SeparatorSpacingSize.Small);

        const leisureHeader = new TextDisplayBuilder()
            .setContent('### Leisure');

        const sectionComponentAnime = sectionContainer(`${process.env.EMOJI_ANIME_BLANKET}  Anime`, process.env.GOOGLE_DRIVE_ANIME_URL);
        const sectionComponentMovies = sectionContainer(`${process.env.EMOJI_MOVIE}  Movies`, process.env.GOOGLE_DRIVE_MOVIES_URL);
        const sectionComponentMusic = sectionContainer(`${process.env.EMOJI_MUSIC}  Music`, process.env.GOOGLE_DRIVE_MUSIC_URL);
        const sectionComponentSeries = sectionContainer(`${process.env.EMOJI_POPCORN}  Series`, process.env.GOOGLE_DRIVE_SERIES_URL);

        const essentialsHeader = new TextDisplayBuilder()
            .setContent('### Essentials');

        const sectionComponentFirebase = sectionContainer(`${process.env.EMOJI_FIREBASE}  Firebase`, process.env.FIREBASE_URL);
        const sectionComponentDiscordDeveloperPortal = sectionContainer(`${process.env.EMOJI_DISCORD}  Discord Developer Portal`, process.env.DISCORD_DEVELOPER_PORTAL_URL);
        const sectionComponentAWS = sectionContainer(`${process.env.EMOJI_AWS}  AWS`, process.env.AWS_URL);
        const sectionComponentGitHub = sectionContainer(`${process.env.EMOJI_GITHUB}  GitHub`, process.env.GITHUB_URL);

        const brainDumpContainer = new ContainerBuilder()
            .setAccentColor(0x3498DB)
            .addMediaGalleryComponents(MediaGalleryComponent)
            .addTextDisplayComponents(header)
            .addSeparatorComponents(separator)
            .addTextDisplayComponents(leisureHeader)
            .addSectionComponents(sectionComponentAnime)
            .addSectionComponents(sectionComponentMovies)
            .addSectionComponents(sectionComponentMusic)
            .addSectionComponents(sectionComponentSeries)
            .addTextDisplayComponents(essentialsHeader)
            .addSectionComponents(sectionComponentFirebase)
            .addSectionComponents(sectionComponentDiscordDeveloperPortal)
            .addSectionComponents(sectionComponentAWS)
            .addSectionComponents(sectionComponentGitHub);

        await interaction.editReply({
            components: [brainDumpContainer],
            files: [background],
            flags: MessageFlags.IsComponentsV2,
        });
    },
};

function sectionContainer(text, url) {
    const textSection = new TextDisplayBuilder()
        .setContent(text);

    const buttonSection = new ButtonBuilder()
        .setURL(url)    
        .setLabel('Open')
        .setStyle(ButtonStyle.Link);

    const sectionComponent = new SectionBuilder()
        .addTextDisplayComponents(textSection)
        .setButtonAccessory(buttonSection);
        
    return sectionComponent;
}
