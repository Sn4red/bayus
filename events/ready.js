const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`${new Date()} >>> *** Functional bot ${client.user.tag} ***`);

        console.log('\n.____...__..._.._.._.._..____.');
        console.log('(.._.\\./._\\.(.\\/.)/.)(.\\/.___)');
        console.log('.)._.(/....\\.)../.).\\/.(\\___.\\');
        console.log('(____/\\_/\\_/(__/..\\____/(____/\n\n');

        const guild = client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
        const channel = guild.channels.cache.get(process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID);

        setInterval(() => {
            const memberCount = guild.memberCount;

            channel.setName(`Member Count: ${memberCount.toLocaleString()}`);
        }, 600000);
    },
};