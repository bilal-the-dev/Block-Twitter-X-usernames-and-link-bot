const {
	Client,
	Events,
	GatewayIntentBits,
	PermissionFlagsBits,
} = require("discord.js");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { extractTwitterLinks } = require("./twitterUtil");
const {
	handleTwitterUsernames,
	addUsername,
	removeUsername,
	viewUsernames,
} = require("./handleTwitterUsername");

const { TOKEN } = process.env;
const prefixes = {
	"!add": addUsername,
	"!remove": removeUsername,
	"!view": viewUsernames,
};

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
	],
});

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
	const { content, author, member, guild } = message;
	try {
		if (author.bot || !guild) return;

		const [prefix] = content.split(" ");
		if (!(prefix in prefixes)) return console.log("not found");

		await isAdmin(member);

		const username = content.replace(/^\S+\s+/, "");

		await prefixes[prefix](message, username);
	} catch (error) {
		console.log(error);
		await message.reply(`Err! \`${error.message}\`.`);
	}
});

client.on(Events.MessageCreate, async (message) => {
	const { content, author, guild } = message;

	if (author.bot || !guild) return;

	await extractTwitterLinks(content, message).catch((e) => console.log(e));
});

async function isAdmin(member) {
	if (!member.permissions.has(PermissionFlagsBits.Administrator))
		throw new Error("Admin only");
}

client.login(TOKEN);
