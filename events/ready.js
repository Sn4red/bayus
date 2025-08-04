const { Events } = require('discord.js');
const fs = require('fs');
const path = require('path');
const firebase = require('../utils/firebase');

const database = firebase.firestore();

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(
            `${new Date()} >>> *** Functional bot ${client.user.tag} ***`,
        );

        const bannerPath = path.join(__dirname, '../utils/asciiArt.txt');
        const banner = fs.readFileSync(bannerPath, 'utf8');

        console.log(banner + '\n');

        // * This obtains The Bunk3r server and the Member role.
        const guild = client.guilds.cache.get(process.env.DISCORD_SERVER_ID);
        const memberRole = guild.roles.cache
            .get(process.env.DISCORD_MEMBER_ROLE_ID);

        // * Obtains the channels.
        const memberCountChannel = guild.channels.cache
            .get(process.env.DISCORD_MEMBER_COUNT_CHANNEL_ID);

        const scpUsersOnlineChannel = guild.channels.cache
            .get(process.env.DISCORD_SCP_USERS_ONLINE_CHANNEL_ID);

        // * The function is executed every 10 minutes to get the total amount
        // * of users in the server with the Member role, and update the channel
        // * name with the new amount, as well as the total amount of users
        // * in the firestore database.
        setInterval(async () => {
            try {
                // * This loads all members to the cache, so the Discord API can
                // * retrieve the most recent data, and waits up to 30 seconds
                // * to avoid timeouts.
                await guild.members.fetch({ time: 30000 });

                const memberCount = memberRole.members.size;
                const userCount = await getUserCount();

                memberCountChannel
                    .setName(`Member Count: ${memberCount.toLocaleString()}`);
                scpUsersOnlineChannel
                    .setName(`SCP Users Online: ${userCount.toLocaleString()}`);
            } catch (error) {
                console.log(`${new Date()} >>> *** ERROR: ready.js ***`);
                console.error(error);
            }
        }, 600000);
    },
};

// * This function obtains the total amount of users in the database.
async function getUserCount() {
    const userReference = database.collection('user');
    const userSnapshot = await userReference.count().get();
    const userCount = userSnapshot.data().count;

    return userCount;
}
