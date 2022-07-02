let { ACAR } = require('../../Clients/Global.Clients')

let client = global.client = new ACAR({
    token: "",
    MongoURI: "mongodb://127.0.0.1/Self",
    prefix: [".","!"],
    owners: ["327236967265861633","930839000816701461"]
})

client.on('ready', () => {
  client.guilds.cache.map(async (x) => {
    await x.members.fetch().then(guild => { })
  })
})

client.fetchCommands()
client.fetchEvents()
client.connect()