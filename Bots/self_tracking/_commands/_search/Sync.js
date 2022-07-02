let Discord = require('discord.js-selfbot-v13');
let { Stats, Seens, Guilds } = require('../../../../Databases/Tracking');
let { MessageEmbed } = require('discord.js');
const util = require('util');
const { resolveSoa } = require('dns');
let mongoose = require('mongoose');
let Model = Guilds
let sure = global.surecik = 5000
module.exports = {
    name: "sync",
    aliases: [],
    permissions: ["OWNER"],
    category: "",
    description: "",
    usage: "",

    onload: async function (client) {
        
    },

     /**
    * @param {Client} client 
    * @param {Message} message 
    * @param {Array<String>} args 
    */
    
    onRequest: async function (client, message, args) {
        console.log("BAŞLADI!")
       // await fetchAllMembers(message)
        let msg = await message.channel.send(`İşlem başlıyor.`)
        let timerId = setTimeout(function request() {
            getMemberSync(msg)
            timerId = setTimeout(request, Number(sure));
          }, Number(sure));
    }
}

/**
 * @param {Message} message
 * @returns {Promise<Message>}
 */

async function getMemberSync(message) {
    let members = message.guild.members.cache.filter(x => !x.roles.cache.has("982698739380658216") || !x.roles.cache.has("982698741301669928"))
    sure = global.surecik = Number(sure) == 0000 ? 5000 : parseInt(members.size*(500/1000)) + "000"
    message.edit(`
**${members.size}** Üye için senkronize başladı!
Senkronize edilecek rol(ler): <@&982698739380658216>, <@&982698741301669928>
Senkronize tahmini **${(members.size>1000 ? parseInt((members.size*(500/1000)) / 60)+" dakika" : parseInt(members.size*(500/1000))+" saniye")}** süre içinde tamamlanacak.
**Veri güncellenme süresi**: ${sure/1000} saniye.`)

    members.forEach(async (member) => {
        member.setNickname("• İsim | Yaş").catch(err => {})
        member.roles.add(["982698739380658216","982698741301669928"]).catch(err => {})
    })
}

/**
 * @param {Message} message
 * @returns {Promise<Message>}
 */

async function fetchAllMembers(message) {
    let Data = await Model.findOne({guildID: message.guild.id})
    let members = Data.Members || []
    members.forEach(async (id) => {
        await message.guild.members.fetch(id).then(async (member) => {
            console.log(member.id)
            member.setNickname("• İsim | Yaş").catch(err => {})
            member.roles.add(["982698739380658216","982698741301669928"]).catch(err => {})
        })
    })
}