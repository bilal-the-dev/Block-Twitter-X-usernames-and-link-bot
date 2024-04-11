const { EmbedBuilder } = require("discord.js");
const { usernames } = require("./data.json");
async function extractTwitterLinks(content, message) {
	const twitterRegex =
		/(http(?:s)?:\/\/(?:twitter|x)\.com\/(?:#!\/)?(\w+)\/status\/(\d+))/g;

	const twitterUsernames = [];

	let match;
	while ((match = twitterRegex.exec(content)) !== null) {
		twitterUsernames.push(match[2]);
	}

	// let isBlocked = "";

	// for (const target of twitterUsernames) {
	// 	if (usernames.includes(target)) {
	// 		isBlocked = target;
	// 		break;
	// 	}
	// }

	const isBlockedUsername = twitterUsernames.some((username) =>
		usernames.includes(username)
	);

	if (twitterUsernames.length === 0 || !isBlockedUsername) return;

	await message.delete();

	await sendLogs(message);
}

const sendLogs = async function (message) {
	const { guild, author, content } = message;
	const logsChannel = await guild.channels.fetch(process.env.LOGS_CHANNEL_ID);

	const embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("Detected Blocked Twitter ⛔")
		.setDescription(`**User** : ${author}\n\n**Content:** ${content}`)

		.setThumbnail(author.displayAvatarURL())

		.setTimestamp();

	await logsChannel.send({ embeds: [embed] });
};
module.exports = { extractTwitterLinks };
