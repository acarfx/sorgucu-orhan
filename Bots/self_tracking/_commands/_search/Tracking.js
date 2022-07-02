const Discord = require('discord.js');
const util = require('util')
let { Stats, Seens, Identitys } = require('../../../../Databases/Tracking');
let { MessageEmbed } = require('discord.js');

module.exports = {
    name: "sorgu",
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
        if(!args[0]) return message.reply({content: `Lütfen kullanıcı belirleyin.`}).then((msg) => {
            setTimeout(() => {
                msg.delete().catch(err => {})
            }, 7500);
        });
        let uye = client.users.cache.get(args[0]) || uyeBul(args[0]);
        if(!uye) return message.reply({content: `Belirtilen kullanıcı bulunamadı.`}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500);
        })
        if(uye && args[0] && (await client.api.users[args[0]].get())) {
            uye = {
                id: args[0],
                tag: `${(await client.api.users[args[0]].get()).username}#${(await client.api.users[args[0]].get()).discriminator}`,
            }
        }
        let stats = await Stats.find({userID: uye.id});
        if(!stats) return message.reply({content: `Belirtilen kullanıcının verileri bulunamadı.`}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500);
        })

        let seens = await Seens.findOne({userID: uye.id});
        if(!seens) return message.reply({content: `Belirtilen kullanıcının verileri bulunamadı.`}).then(x => {
            setTimeout(() => {
                x.delete().catch(err => {})
            }, 7500);
        })

        let SunucuVerisi = stats.filter(x => client.guilds.cache.get(x.guildID))
        .sort((a, b) => b.topVoice - a.topVoice)
        .map((x, index) => `\` ${index + 1} \` **${client.guilds.cache.get(x.guildID) ? client.guilds.cache.get(x.guildID).name : "Bilinmeyen Sunucu!"}**: \` ${client.timing(x.topVoice)} \``)
        .join("\n")

        let SunucuMesajVerisi = stats.filter(x => client.guilds.cache.get(x.guildID))
        .sort((a, b) => b.topMessage - a.topMessage)
        .map((x, index) => `\` ${index + 1} \` **${client.guilds.cache.get(x.guildID) ? client.guilds.cache.get(x.guildID).name : "Bilinmeyen Sunucu!"}**: \` ${x.topMessage ? x.topMessage : 0} mesaj \``)
        .join("\n")

        let IsimVerisi = seens.lastNames
        .sort((a, b) => b.date - a.date)
        .map((x, index) => `\` ${index + 1} \` ${x.new} (<t:${String(x.date).slice(0, 10)}:R>)`)
        .join("\n")


        let detay = ``
        if(seens.lastType == "JOIN VOICE") {
            detay = `**\` ❯ \`** **Son Durum**: \` Ses kanalına katıldı. \`
**\` ❯ \`** **Ses Kanal Bilgisi**: ${seens.newChannelId ? client.channels.cache.get(seens.newChannelId) ? `\` ${client.channels.cache.get(seens.newChannelId).name} \`` : "Bilinmeyen Ses Kanalı!" : "Bilinmeyen Ses Kanalı!"}`
        }
        if(seens.lastType == "LEAVE VOICE") {
            detay = `**\` ❯ \`** **Son Durum**: \` Ses kanalından ayrıldı. \`
**\` ❯ \`** **Ses Kanal Bilgisi**: ${seens.oldChannelId ? client.channels.cache.get(seens.oldChannelId) ? `\` ${client.channels.cache.get(seens.oldChannelId).name} \`` : "Bilinmeyen Ses Kanalı!" : "Bilinmeyen Ses Kanalı!"}`
        }
        if(seens.lastType == "CHANGE VOICE") {
            detay = `**\` ❯ \`** **Son Durum**: \` Ses kanalı değiştirildi. \`
**\` ❯ \`** **Yeni Kanal Bilgisi**: ${seens.newChannelId ? client.channels.cache.get(seens.newChannelId) ? `\` ${client.channels.cache.get(seens.newChannelId).name} \`` : "Bilinmeyen Ses Kanalı!" : "Bilinmeyen Ses Kanalı!"}
**\` ❯ \`** **Eski Kanal Bilgisi**: ${seens.oldChannelId ? client.channels.cache.get(seens.oldChannelId) ? `\` ${client.channels.cache.get(seens.oldChannelId).name} \`` : "Bilinmeyen Ses Kanalı!" : "Bilinmeyen Ses Kanalı!"}`
        }
        if(seens.lastType == "MESSAGE") {
            detay = `**\` ❯ \`** **Son Durum**: \` Metin kanalına mesaj gönderildi. \`
**\` ❯ \`** **Metin İçeriği**: ${seens.messageContent}
**\` ❯ \`** **Metin Kanal Bilgisi**: ${seens.messageChannelId ? client.channels.cache.get(seens.messageChannelId) ? `\` #${client.channels.cache.get(seens.messageChannelId).name} \`` : "Bilinmeyen Metin Kanalı!" : "Bilinmeyen Metin Kanalı!"}`
        }
        if(seens.lastType == "NAME CHANGE") {
            detay = `**\` ❯ \`** **Son Durum**: \` Kullanıcı adı güncellendi. \`
**\` ❯ \`** **Yeni Kullanıcı Adı**: \` ${seens.lastName} \``
        }
        if(seens.lastType == "AVATAR CHANGE") { 
            detay = `**\` ❯ \`** **Son Durum**: \` Avatar güncellendi. \``
        }

        let Kimlik = await Identitys.findOne({userID: uye.id})

        let mesajVerisi = seens.lastContent.sort((a, b) => b.date - a.date).splice(0, 10).map((x ,index) => {
            return `\` ${index + 1} \` ${x.content} (<t:${String(x.date).slice(0, 10)}:R>) [**${client.channels.cache.get(x.channel) ? `#${client.channels.cache.get(x.channel).name}` : "#deleted-channel"}** | **${client.guilds.cache.get(x.guild) ? client.guilds.cache.get(x.guild).name : "Bilinmeyen Sunucu!"}**]`
        }).join("\n") 
let text = `**Merhaba!** ${message.author.tag}!
Belirtilmiş olan <@!${uye.id}> (${uye.tag ? uye.tag : uye.id}) üyesinin sunucu verileri ve detaylı görülme bilgileri aşağıda belirtilmiştir.
Aşağıda sisteme eklenmiş kimlik bilgileri veya Discord'a eklemiş olduğu telefon numarası ile API bağlantısı ile sorgu yapmaktadır eklenmedi ise gözükmeyecektir eklendiyse ve sorgu sisteminde çıkıyorsa otomatik olarak kimlik bilgileri eklenecektir.
──────────────────────
Aşağıda üyenin detaylı analiz bilgileri ve son durum bilgileri belirtilmiştir.
**\` ❯ \`** **Son Görülme**: <t:${String(seens.lastSeen).slice(0, 10)}:R> [**${seens.lastType}**]
**\` ❯ \`** **Son Görülen Sunucu**: \` ${client.guilds.cache.get(seens.guildID) ? client.guilds.cache.get(seens.guildID).name : "Bilinmeyen Sunucu"} \`
${seens.lastSeenVoice ? `**\` ❯ \`** **Son Seste Görülme**: <t:${String(seens.lastSeenVoice ? seens.lastSeenVoice : Date.now()).slice(0, 10)}:R>` : "**` ❯ `** **Son Seste Görülme**: ` Bulunamadı! `"}
${seens.lastSeenMessage ? `**\` ❯ \`** **Son Mesaj Görülme**: <t:${String(seens.lastSeenMessage ? seens.lastSeenMessage : Date.now()).slice(0, 10)}:R>` : "**` ❯ `** **Son Mesaj Görülme**: ` Bulunamadı! `"}
${detay ? detay : ""}
──────────────────────
Aşağıda son ses aktifliği sağladığı sunucuların verileri belirtilmiştir.
${SunucuVerisi ? SunucuVerisi : "**Veri bulunamadı.**"}
──────────────────────
Aşağıda son mesaj aktifliği sağladığı sunucuların verileri belirtilmiştir.
${SunucuMesajVerisi ? SunucuMesajVerisi : "**Veri bulunamadı.**"} 
──────────────────────
Aşağıda son güncel 10 mesajın bilgisi belirtilmiştir.
${mesajVerisi ? mesajVerisi : "**Veri bulunamadı.**"} 
──────────────────────
Aşağıda geçmiş isim bilgileri belirtilmiştir. 
${IsimVerisi ? IsimVerisi : "**Veri bulunamadı.**"}
──────────────────────
${Kimlik ? `${Kimlik.Identity ? `**\` ❯ \`** **Kimlik Resmi**: ${Kimlik.Identity} ` : ""}
${Kimlik.IdentityId ? `**\` ❯ \`** **T.C**: \` ${Kimlik.IdentityId} \`` : ""}
${Kimlik.Name ? `**\` ❯ \`** **İsim Soyisim**: \` ${Kimlik.Name} \`` : ""}
${Kimlik.Birthday ? `**\` ❯ \`** **Doğum Tarihi**: \` ${Kimlik.Birthday} \`` : ""}
${Kimlik.Phone ? `**\` ❯ \`** **Telefon Numarası**: \` ${Kimlik.Phone} \`` : ""}
${Kimlik.Email ? `**\` ❯ \`** **Email**: \` ${Kimlik.Email} \`` : ""}
${Kimlik.Description ? `**\` ❯ \`** **Açıklama**: \` ${Kimlik.Description} \`` : ""}
──────────────────────` : ``}`
        message.channel.send({content: `${text}`}).catch(err => {
    const arr = Discord.Util.splitMessage(`${text}`, { maxLength: 1950, char: "\n" });
    arr.forEach(element => {
        message.channel.send({content: `${element}`});
    });
})

    }
}

async function uyeBul(id) {
    return await client.api.users[id].get().catch(err => {
          return false
    })
}