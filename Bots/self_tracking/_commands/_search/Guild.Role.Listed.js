let Discord = require('discord.js-selfbot-v13');
let { Stats, Seens } = require('../../../../Databases/Tracking');
let { MessageEmbed } = require('discord.js');
const util = require('util');
module.exports = {
    name: "rolsırala",
    aliases: ["sırala","rollistele"],
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
        let guild = client.guilds.cache.find(x => x.name.includes(args[0]) || x.id == args[0])
        if(!guild) return message.reply("Sunucu bulunamadı.").then((msg) => {
            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 7500);
        })
        let roles = guild.roles.cache.map((x , index)=> ` ${x.id} | ${x.name}`).join("\n")
        message.channel.send({content: `\`\`\`${roles}\`\`\``}).catch(err => {
            const arr = Discord.Util.splitMessage(`${roles}`, { maxLength: 1950, char: "\n" });
            arr.forEach(element => {
                message.channel.send({content: `\`\`\`${element}\`\`\``});
            });
        })
    }
}