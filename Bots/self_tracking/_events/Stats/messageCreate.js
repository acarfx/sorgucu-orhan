
const { Message } = require('discord.js-selfbot-v13');
let { Stats, Seens } = require('../../../../Databases/Tracking');
module.exports = {

    name: "messageCreate",

    /**
     * @param {Message} message 
     * @returns {Promise<void>}
     */
    
    onLoad: async function (message) {
        if (message.author.bot || !message.guild || message.webhookID || message.channel.type === "dm" || client.prefix.some(x => message.content.startsWith(x))) return;
        
        await Seens.updateOne({userID: message.author.id}, {
            $set: {
                guildID: message.guildId,
                lastSeenMessage: Date.now(),
                lastSeen: Date.now(),
                messageChannelId: message.channelId,
                messageContent: message.content,
                lastType: "MESSAGE",
            }, 
            $push: {
                lastContent: {
                    date: Date.now(),
                    content: message.content,
                    guild: message.guildId,
                    channel: message.channelId,
                }
            }
        }, {upsert: true});
        
        await Stats.updateOne({guildID: message.guildId, userID: message.author.id}, {$inc: {
            topMessage: 1
            }}, {upsert: true});

    }
}


