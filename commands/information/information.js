const path = require('node:path');
const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 1,
    data: new SlashCommandBuilder()
        .setName('information')
        .setDescription('Information about The Bunk3r server.'),
    async execute(interaction) {
        // * Notify the Discord API that the interaction was received successfully and set a maximun timeout of 15 minutes.
        await interaction.deferReply();

        const thumbnailPath = path.join(__dirname, '../../images/embed/information-thumbnail.gif');

        const thumbnail = new AttachmentBuilder(thumbnailPath);

        const embed = new EmbedBuilder()
            .setColor(0x3498DB)
            .setTitle('Welcome to the Official SCP Collector Discord Server!')
            .setDescription('This server is a place for users of SCP Collector to connect, collect and trade cards. You can collect not only by making shots but also by exchanging cards ' +
                            'with others—feel free to use the designated channels for these activities.\n\n' +
                            '<a:pin:1230368962496434338>  **Please read the [#rules](https://discord.com/channels/1162912802701316146/1319794997695873105) and enjoy your stay!**')
            .setFields(
                { name: '<a:light_bulb:1337861171876986991>  Feedback & Issues:', value: 'Have any suggestions or problems with SCP Collector? Let me know by filling out this form: [Google Form](https://bit.ly/SCPCollector)'},
                { name: '<:clip:1337492530308190279>  Important Links:', value: '- Discord Server Invite: [The Bunk3r](https://discord.gg/PrfWkJchZg)\n' +
                        '- Official Patreon: [patreon.com/Sn4red](https://www.patreon.com/Sn4red/)'},
                { name: '<a:stop:1243398806402240582>  New to SCP Collector?', value: 'If this is your first time using SCP Collector, you won’t be able to use commands until you run /`card`. This will register you in the system. ' +
                        'Feel free to explore the information commands such as /`commands`.' },
                { name: '<a:kiiroitori_question:1337862617682935910>  FAQs:', value: 'For frequently asked questions, use /`faq`.\n\n' +
                        '**Secure, Contain, Protect**  <:scp:1337863934211784715>'},
            )
            .setThumbnail('attachment://information-thumbnail.gif')

        // * Sends the embed to the #information channel.
        const channel = interaction.client.channels.cache.get('1319800124922269748');
        if (channel) {
            await channel.send({ embeds: [embed], files: [thumbnail] });
        }

        // * Deletes the interaction reply.
        await interaction.deleteReply();
    },
};
