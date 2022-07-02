
module.exports = {

    name: "messageCreate",

    /**
     * @param {Message} message
     * @returns {Promise<void>}
     */
    onLoad: async function (message) {
        if (message.author.bot || !client.prefix.some(x => message.content.startsWith(x)) || !message.channel) return;
        let args = message.content.substring(client.prefix.some(x => x.length)).split(" ");
        let command = args[0].toLocaleLowerCase()
        let acar = message.client;
        args = args.splice(1);
    
        let uye = message.guild ? message.guild.members.cache.get(message.author.id) : message.author;
        if(!uye) return;
    
    
        if(acar.commands.has(command) || acar.aliases.has(command)) {
            let run = acar.commands.get(command) || acar.aliases.get(command);
            if(run.permissions && run.permissions.length) {
                if(run.permissions.includes("OWNER")) {
                    if(!client.owners.includes(message.author.id)) return message.reply({content: `Yeterli yetkiye sahip değilsiniz.`})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete().catch(err => {})
                        }, 7500);
                    })
                } else {
                    if(message.guild && !client.owners.includes(message.author.id) && !run.permissions.some(x => uye.roles.cache.has(x)) && !uye.permissions.has('ADMINISTRATOR')) {
                        return message.reply({content: `Bu komutu kullanabilmek için ${run.permissions.map(x => message.guild.roles.cache.get(x)).join(', ')} rollerine sahip olmalısın.`})
                        .then((msg) => { 
                            setTimeout(() => {
                                msg.delete().catch(err => {})
                            }, 7500);
                        });
                    }
                    if(!message.guild) return message.reply({content: `Bu komutu kullanabilmek için sunucuda bulunmalısın.`})
                    .then((msg) => {
                        setTimeout(() => {
                            msg.delete().catch(err => {})
                        }, 7500);
                    });
                }
            }
      
            run.onRequest(message.client, message, args)
        }
    }
}
