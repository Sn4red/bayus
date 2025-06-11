const { Events } = require('discord.js');
const firebase = require('../utils/firebase');

const database = firebase.firestore();

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(
            `${new Date()} >>> *** Functional bot ${client.user.tag} ***`,
        );

        console.log('\n.____...__..._.._.._.._..____.');
        console.log('(.._.\\./._\\.(.\\/.)/.)(.\\/.___)');
        console.log('.)._.(/....\\.)../.).\\/.(\\___.\\');
        console.log('(____/\\_/\\_/(__/..\\____/(____/\n\n');

        // * This obtains the total amount of users in the database.
        const userReference = database.collection('user');
        const userSnapshot = await userReference.count().get();
        const userCount = userSnapshot.data().count;

        // * This obtains The Bunk3r server and the Member role.
        const guild = client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
        const memberRole = guild.roles.cache
            .get(process.env.DISCORD_MEMBER_ROLE_ID);

        const memberCountChannel = guild.channels.cache
            .get(process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID);

        const scpUsersOnlineChannel = guild.channels.cache
            .get(process.env.DISCORD_SCP_USERS_ONLINE_CHANNEL_ID);

        // * The function is executed every 10 minutes to get the total amount
        // * of users in the server with the Member role, and update the channel
        // * name with the new amount.
        setInterval(async () => {
            // * This loads all members to the cache, so the Discord API can
            // * retrieve the most recent data.
            await guild.members.fetch();

            const memberCount = memberRole.members.size;

            memberCountChannel
                .setName(`Member Count: ${memberCount.toLocaleString()}`);
            scpUsersOnlineChannel
                .setName(`SCP Users Online: ${userCount.toLocaleString()}`);
        }, 600000);
    },
};
