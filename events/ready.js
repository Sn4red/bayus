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

        // * This obtains the SCP Collector ID, the Bot role ID and the Member Count channel ID.
        const guild = client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
        const botRole = guild.roles.cache.get(process.env.DISCORD_BOT_ROLE_ID);
        const memberCountchannel = guild.channels.cache.get(process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID);

        // * The function is executed every 10 minutes to get the total amount of users in the server,
        // * excluding the bots, and update the channel name with the new amount.
        setInterval(async () => {
            // * This loads all members to the cache, so the Discord API can retrieve the most recent data.
            await guild.members.fetch();

            let totalUserCount = 0;
            const userCount = guild.memberCount;
            const botCount = botRole.members.size;

            totalUserCount = userCount - botCount;

            memberCountchannel.setName(`Member Count: ${totalUserCount.toLocaleString()}`);
        }, 600000);
    },
};