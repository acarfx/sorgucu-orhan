
const { Message } = require('discord.js-selfbot-v13');
let { Stats, Seens } = require('../../../../Databases/Tracking');
module.exports = {

    name: "userUsernameUpdate",

    /**
     * @param {Message} message 
     * @returns {Promise<void>}
     */
    
    onLoad: async function (user, oldUsername, newUsername) {
        if(user.bot) return;
        if(oldUsername == newUsername) return;
        if(!oldUsername) return;
        if(!newUsername) return;

        await Seens.updateOne({userID: user.id}, {
            $set: {
                lastSeen: Date.now(),
                lastType: `NAME CHANGE`,
                lastName: newUsername,
            },
            $push: {
                lastNames: {
                    date: Date.now(),
                    old: oldUsername,
                    new: newUsername
                }
            }
        }, {upsert: true});
      
    }
}


client.on("userAvatarUpdate", async (user, oldAvatarURL, newAvatarURL) => {
    if(user.bot) return;
    await Seens.updateOne({userID: user.id}, {
        $set: {
            lastSeen: Date.now(),
            lastType: `AVATAR CHANGE`,
        }
    }, {upsert: true});
});