const axios = require("axios");
const Profile = require("../models/Profile.model");
module.exports = async function (req, res, next) {
	const profile = await Profile.findOne({ user: req.user.id });
	const gitRes = await axios.get(
		`https://api.github.com/repos/${profile.githubusername}/${req.body.repo}`
	);

	let images = [];

	for (let i = 1; i <= 5; i++) {
		try {
			let img = await axios.get(
				`https://github.com/${profile.githubusername}/${
				req.body.repo
				}/blob/master/imgs/${i}.${"jpg"}?raw=true`
			);
			images.push(img.config.url.toString());
		} catch (error) {
			continue;
		}
	}

	if (gitRes.status === 200) {
		const { name, html_url, description, size } = gitRes.data;

		req.body.name = name;
		req.body.url = html_url;
		req.body.description = description;
		req.body.images = images;
		req.body.size = size;
	}

	next();
};
