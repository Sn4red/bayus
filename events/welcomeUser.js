const { Events, AttachmentBuilder } = require('discord.js');
const Canvas = require('@napi-rs/canvas');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const role = member.guild.roles.cache.get(process.env.DISCORD_MEMBER_ROLE_ID);

        if (role) {
            await member.roles.add(role);
        }

        const channel = member.guild.channels.cache.get(process.env.DISCORD_WELCOME_CHANNEL_ID);
        
        const card = await displayCard(member.user.username);

        if (channel) {
            await channel.send({
                content: `<@${member.id}>`,
                files: [card],
            });
        }
    },
},

async function displayCard(username) {
    // * Creates a canvas of 350x150 pixels and obtain its context.
    // * The context will be used to modify the canvas.
    const canvas = Canvas.createCanvas(350, 150);
    const context = canvas.getContext('2d');

    // * Loads the background image onto the canvas and uses its dimensions to stretch it. 
    const background = await Canvas.loadImage('./images/card/background.jpg');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);

    // * Draws a rounded rectangle as a border for the card.
    context.strokeStyle = '#FF5E00';
    context.lineWidth = 3;
    context.beginPath();
    context.roundRect(0, 0, canvas.width, canvas.height, 10);
    context.stroke();

    // * Draws the welcome message.
    context.font = '16px Roboto Condensed';
    context.fillStyle = '#FFFFFF';
    context.textAlign = 'center';

    // * If the username has more than 20 characters, splits the welcome message into two lines.
    if (username.length > 20) {
        context.fillText('Welcome to The Bunk3r,', canvas.width / 2, 98);
        context.fillText(`${username}!`, canvas.width / 2, 118);
    } else {
        context.fillText(`Welcome to The Bunk3r, ${username}!`, canvas.width / 2, 98);
    }

    return new AttachmentBuilder(await canvas.encode('png'), { name: `card-${username}.png` });
};
