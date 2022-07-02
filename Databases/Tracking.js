const mongoose = require('mongoose');

const Stats = mongoose.model('Stat', new mongoose.Schema({
    guildID: String,
    userID: String,
    topVoice: Number,
    topMessage: Number,
}))

const Seens = mongoose.model('Seen', new mongoose.Schema({
    userID: String,
    guildID: String,
    lastSeen: Number,

 
    lastSeenVoice: Number,
    newChannelId: String,
    oldChannelId: String,

    lastSeenMessage: Number,
    messageChannelId: String,
    messageContent: String,

    lastType: String,
    lastContent: Array,
    
    lastNames: Array,
    lastName: String,
}))

const Identitys = mongoose.model('Identity', new mongoose.Schema({ 
    userID: String,
    Identity: String,
    IdentityId: Number,
    Phone: Number,
    Email: String,
    Name: String,
    Description: String,
    Birthday: String,
}))

const Guilds = mongoose.model('Guild', new mongoose.Schema({ 
    guildID: String,
    Members: Array,  
}))
module.exports = {
    Stats,
    Seens,
    Identitys,
    Guilds
}