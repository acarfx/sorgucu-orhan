
module.exports = {

    name: "ready",

    /**
     * @param {Message} message
     * @returns {Promise<void>}
     */
    onLoad: async function (message) {
	client.guilds.cache.map(x => {
		x.members.fetch()
	})      
    }
}
