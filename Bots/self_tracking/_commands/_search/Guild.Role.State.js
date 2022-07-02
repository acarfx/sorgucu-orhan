let Discord = require('discord.js-selfbot-v13');
let { Stats, Seens } = require('../../../../Databases/Tracking');
let { MessageEmbed } = require('discord.js');
const util = require('util');
module.exports = {
    name: "rolbilgi",
    aliases: ["roldenetim","denetim"],
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
        let roles = guild.roles.cache.find(x => x.name.includes(args[1]) || x.id == args[1])
        if(!roles) return message.reply("Rol bulunamadı.").then((msg) => {
            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 7500);
        })
        message.channel.send(`Aşağıda **\` @${roles.name} \`** isimli rolün bilgileri sıralanmaktadır.
**\` ❯ \`** **Rol ID**: \` ${roles.id} \`
**\` ❯ \`** **Rol Adı**: \` ${roles.name} \`
**\` ❯ \`** **Rol Rengi**: \` ${roles.hexColor} \`
**\` ❯ \`** **Rol'ün Sunucusu**: \` ${guild.name} \`
**\` ❯ \`** **Rol Görünüm**: \` ${roles.hoist ? "Açık" : "Kapalı"} \`
**\` ❯ \`** **Rol Sıralaması**: \` ${roles.position} \`
**\` ❯ \`** **Rol Üye Sayısı**: \` ${roles.members.size} \``)
        message.channel.send({content: `Aşağıda **\` @${roles.name} \`** isimli rolün kullanıcıları sıralanmaktadır.
\`\`\`${roles.members.map(x => x.id).join("\n")}\`\`\``}).catch(err => {
            const arr = Discord.Util.splitMessage(`${roles.members.map(x => x.id).join("\n")}`, { maxLength: 1950, char: "\n" });
            arr.forEach(element => {
                message.channel.send({content: `\`\`\`${element}\`\`\``});
            });
        })
    }
}