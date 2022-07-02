let Discord = require('discord.js-selfbot-v13');
let { Stats, Seens } = require('../../../../Databases/Tracking');
let { MessageEmbed } = require('discord.js');
const util = require('util');
module.exports = {
    name: "sıralama",
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
        let a = 0
        let sıralama = client.guilds.cache.filter(g => g.members.cache.filter(x => !x.user.bot && x.voice && x.voice.channel).size > 0)
        .sort((a, b) => {
            let bg = b.members.cache.filter(x => !x.user.bot && x.voice && x.voice.channel).size
            let ag = a.members.cache.filter(x => !x.user.bot && x.voice && x.voice.channel).size
            return bg - ag
        })
        .map((x, index) =>  {
            a++
            return `**\` ${a} \`** **${x.name}** **\` ${x.members.cache.filter(y => !y.user.bot && y.voice && y.voice.channel).size} \`**`
        })
        .join("\n")

        message.channel.send({content: `Aşağıda sıralama <t:${String(Date.now()).slice(0, 10)}:F> tarihinde sıralandırılmıştır.
${sıralama}`}).catch(err => {
            const arr = Discord.Util.splitMessage(`Aşağıda sıralama <t:${String(Date.now()).slice(0, 10)}:F> tarihinde sıralandırılmıştır.
${sıralama}`, { maxLength: 1950, char: "\n" });
            arr.forEach(element => {
                message.channel.send({content: `${element}`});
            });
        })
    }
}