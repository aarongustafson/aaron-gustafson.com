import dotenv from "dotenv";
dotenv.config();

const clients = process.env.MY_CLIENTS.split("::");

function objectify(client_list) {
	return client_list.sort().map((client) => {
		let name = client,
			chars = /[\s\.\|]/g;
		return {
			name: name,
			logo: name.toLocaleLowerCase().replace(chars, "-") + ".svg",
		};
	});
}

export default objectify(clients);
