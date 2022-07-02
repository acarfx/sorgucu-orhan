const { Client, Collection, Intents, Options } = require('discord.js-selfbot-v13');
const mongoose = require('mongoose');
const { bgBlue, black, green } = require("chalk");
const fs = require('fs');
const logs = require('discord-logs');

class ACAR extends Client {

    constructor(options) {
        super({
            options,
            intents: [32767, "GUILD_MEMBERS", new Intents(32767), Intents.FLAGS.GUILD_MEMBERS],
            fetchAllMembers: true,
            shard: "auto",
        }) 
        this.token = options.token
        this.MongoURI = options.MongoURI
        this.commands = new Collection()
        this.aliases = new Collection()
        this.prefix = options.prefix || ["."]
        this.owners = options.owners || ["327236967265861633"]
        logs(this) // Basitleştirilmiş logları ekler.
        this.on("guildUnavailable", async (guild) => { console.log(`[UNAVAIBLE]: ${guild.name}`) })
        .on("disconnect", () => console.log("Bot is disconnecting...", "disconnecting"))
        .on("reconnecting", () => console.log("Bot reconnecting...", "reconnecting"))
        .on("error", (e) => console.log(e, "error"))
        .on("warn", (info) => console.log(info, "warn"));

        process.on("unhandledRejection", (err) => { console.log(err, "caution") });
        process.on("warning", (warn) => { console.log(warn, "varn") });
        process.on("beforeExit", () => { console.log('Sistem kapatılıyor...'); });
        process.on("uncaughtException", err => {
            const hata = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
                console.error("Beklenmedik Hata: ", hata);
               // process.exit(1);
        });
        this.timing = (duration) => {  
            let arr = []
            if (duration / 3600000 > 1) {
              let val = parseInt(duration / 3600000)
              let durationn = parseInt((duration - (val * 3600000)) / 60000)
              arr.push(`${val} Saat`)
              arr.push(`${durationn} Dk.`)
            } else {
              let durationn = parseInt(duration / 60000)
              arr.push(`${durationn} Dk.`)
            }
            return arr.join(", ") 
        };
        
    }

   
    

    async fetchEvents(active = true) {
        if(!active) return;
        let dirs = fs.readdirSync('./_events', { encoding: "utf8" });
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./_events/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            files.forEach(file => {
                let referans = require(`../Bots/self_tracking/_events/${dir}/${file}`);
                this.on(referans.name, referans.onLoad);
            });
        });
     }

    async fetchCommands(active = true) {
        if(!active) return;
        let dirs = fs.readdirSync("./_commands", { encoding: "utf8" });
        console.log(`${black.bgHex('#D9A384')("SELF-TRACKING")} ${dirs.length} category in client loaded.`);
        dirs.forEach(dir => {
            let files = fs.readdirSync(`./_commands/${dir}`, { encoding: "utf8" }).filter(file => file.endsWith(".js"));
            console.log(`${black.bgHex('#D9A384')("SELF-TRACKING")} ${files.length} commands loaded in ${dir} category.`);
            files.forEach(file => {
                let referans = require(`../Bots/self_tracking/_commands/${dir}/${file}`);
                if(referans.onLoad != undefined && typeof referans.onLoad == "function") referans.onLoad(this);
                this.commands.set(referans.name, referans);
                if (referans.aliases) referans.aliases.forEach(alias => this.aliases.set(alias, referans));
            });
        });
    }
    
    async connect(token = this.token) {
        if(this.MongoURI) {
            await mongoose.connect(this.MongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }).then(async (a) => {
                console.log(`[MONGODB] Bağlantı Sağlandı: ${this.MongoURI}`);
                await this.login(token)
                .then(a => {
                    console.log(`[SELF] Bağlantı Sağlandı: ${this.user.tag}`);
                }).catch(err => {
                    console.log(`[SELF] Bağlantı Hatası: ${err}`);
                    process.exit();
                })
            }).catch(err => {
                console.log("[MONGODB] Bağlantı Hatası: " + err);
                process.exit();
            })
        }
    }
}

module.exports = { ACAR }