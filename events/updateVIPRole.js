const { Events } = require('discord.js');
const firebase = require('../utils/firebase');

const database = firebase.firestore();

module.exports = {
    name: Events.GuildMemberUpdate,
    async execute(oldMember, newMember) {
        // * This variable has the ID of the official server.
        const guildId = '1162912802701316146';

        // * This variable has the ID of the VIP User role (temporarily has the Testing role).
        const vipRoleId = '1321955120824451193';

        // * The conditional checks if the event was triggered in the official server.
        if (newMember.guild.id !== guildId) {
            return;
        }

        // * The event catches the state of the user's roles before and after the update.
        const oldRoles = oldMember.roles.cache;
        const newRoles = newMember.roles.cache;

        // * This conditionals check if the role is granted/removed from the user.
        // * These are also triggered by cases where they are not designed for (documented below)
        // * by peroforming extra updates to the documents (overwriting the same value of the
        // * 'premium' field), but since the bot only runs on the official server, it's not a problem.

        // * The main functionality of this if is to grant the VIP benefits when the role is added.
        // * This is also triggered when the user has the rol but a random role is added/removed.
        // * (The latter only happens when the bot is restarted, so it happens in lower numbers).
        if (!oldRoles.has(vipRoleId) && newRoles.has(vipRoleId)) {
            await managePremiumStatus(true, newMember);
        }
        
        // * The main functionality of this if is to remove the VIP benefits when the role is removed.
        // * This is also triggered when the user doesn't have the role and a random one is added/removed.
        if (!newRoles.has(vipRoleId)) {
            await managePremiumStatus(false, newMember);
        }
    },
};

async function managePremiumStatus(benefitsAreGiven, member) {
    const userId = member.user.id;
    const userNickname = member.user.username;

    // * Formats the date in YYYY/MM/DD.
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
    const day = ('0' + currentDate.getDate()).slice(-2);

    try {
        const result = await database.runTransaction(async (transaction) => {
            const userReference = database.collection('user').doc(userId);
            const userSnapshot = await transaction.get(userReference);
    
            if (benefitsAreGiven) {
                if (userSnapshot.exists) {
                    await transaction.update(userReference, {
                        premium: true,
                    });
                } else {
                    const newPremiumUser = {
                        acceptTradeOffers: true,
                        dailyAttemptsRemaining: 5,
                        issueDate: year + '/' + month + '/' + day,
                        level: 1,
                        nickname: userNickname,
                        crystals: 0,
                        premium: true,
                        rank: 'Class D',
                        xp: 0,
                        card1Purchased: false,
                        card2Purchased: false,
                        card3Purchased: false,
                        card4Purchased: false,
                        card5Purchased: false,
                    };
        
                    await transaction.set(userReference, newPremiumUser);
                }

                return `${new Date()} >>> *** ${member.user.id} (${member.user.username}) upgraded. The user has VIP! ***`;
            } else {
                if (userSnapshot.exists) {
                    await transaction.update(userReference, {
                        premium: false,
                    });

                    return `${new Date()} >>> *** ${member.user.id} (${member.user.username}) downgraded. The user has no more VIP! ***`
                }

                return '';
            }
        });

        console.log(result);
    } catch (error) {
        if (benefitsAreGiven) {
            console.log(`${new Date()} >>> *** ERROR: Event - updateVIPRole (granting VIP) *** by ${member.user.id} (${member.user.username})`);
            console.error(error);
        } else {
            console.log(`${new Date()} >>> *** ERROR: Event - updateVIPRole (removing VIP) *** by ${member.user.id} (${member.user.username})`);
            console.error(error);
        }
    }
}
