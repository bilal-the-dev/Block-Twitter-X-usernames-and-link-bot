const fs = require("fs");
const { usernames } = require("./data.json");

const addUsername = async function (message, username) {
	if (usernames.includes(username)) throw new Error("Username already added");
	usernames.push(username);

	await writeToJson(usernames);
	await message.reply(`Success! added the username \`${username}\``);
};

const removeUsername = async (message, username) => {
	if (!usernames.includes(username)) throw new Error("Username is not added");
	usernames.splice(usernames.indexOf(username), 1);

	await writeToJson(usernames);
	await message.reply(`Success! removed the username \`${username}\``);
};

const viewUsernames = async (message) => {
	const usernameStr = usernames.reduce(
		(acc, cur, i) => `${acc}${i + 1} - \`${cur}\`\n`,
		""
	);
	await message.reply(usernameStr ?? "No username added yet.");
};

const writeToJson = async function (data) {
	const stringified = JSON.stringify({ usernames: data });
	return new Promise((resolve, reject) => {
		fs.writeFile("./data.json", stringified, (err) => {
			if (err) reject(err);
			resolve("success");
		});
	});
};

module.exports = { viewUsernames, addUsername, removeUsername };
