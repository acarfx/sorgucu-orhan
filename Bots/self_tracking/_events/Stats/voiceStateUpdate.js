
const { VoiceState } = require('discord.js-selfbot-v13');
let { Stats, Seens } = require('../../../../Databases/Tracking');
module.exports = {

    name: "voiceStateUpdate",

    /**
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     * @returns {Promise<void>}
     */
    
    onLoad: async function (oldState, newState) {
        if((oldState.member && oldState.member.user.bot) || (newState.member && newState.member.user.bot)) return;
        
        if(!oldState.channelId && newState.channelId) await Seens.updateOne({userID: newState.id}, {$set: {
            guildID: newState.guild.id,
            lastSeenVoice: Date.now(),
            lastSeen: Date.now(),
            newChannelId: newState.channelId,
            lastType: "JOIN VOICE",
        }}, {upsert: true});
       

        if(oldState.channelId && !newState.channelId) {
            let joinedAt = await Seens.findOne({userID: oldState.id})
            if(!joinedAt) return;
            const timing = Date.now() - joinedAt.lastSeenVoice;

            await Seens.updateOne({userID: oldState.id}, {$set: {
                guildID: oldState.guild.id,
                oldChannelId: oldState.channelId,
                lastSeen: Date.now(),
                lastType: "LEAVE VOICE",
            }}, {upsert: true});

            if(!isNaN(timing)) dataInit(oldState, timing)
        }


        if(oldState.channelId && newState.channelId && oldState.channelId != newState.channelId) {
            let joinedAt = await Seens.findOne({userID: oldState.id})
            if(!joinedAt) return;
            const timing = Date.now() - joinedAt.lastSeenVoice;
            
            await Seens.updateOne({userID: oldState.id}, {$set: {
                guildID: oldState.guild.id,
                lastSeenVoice: Date.now(),
                lastSeen: Date.now(),
                oldChannelId: oldState.channelId,
                newChannelId: newState.channelId,
                lastType: "CHANGE VOICE",
            }}, {upsert: true});

            if(!isNaN(timing)) dataInit(newState, timing)
        }

    }
}


async function dataInit(member, data) {
    await Stats.updateOne({guildID: member.guild.id, userID: member.id}, {$inc: {
        topVoice: data
        }}, {upsert: true});
}