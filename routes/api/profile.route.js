const express = require("express");
const router = express.Router();
const Profile = require("../../models/Profile.model");
const Component = require("../../models/Component.model");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User.model");
const auth = require("../../middleware/auth.middleware");

//@route  GET api/profile/me
//@desc   get current user profile
//@access private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "avatar", "type"]);

		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}
		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
});

//@route  POST api/profile
//@desc  create or update user profile
//@access private
router.post(
	"/",
	[auth],
	async (req, res) => {

		let {
			website,
			location,
			bio,
			skills,
			links,
			company,
			hireable,
		} = req.body;

		//build profile object
		const new_info = {};

		if (website) new_info.website = website;
		if (location) new_info.location = location;
		if (bio) new_info.bio = bio;
		if (company) new_info.company = company;
		if (hireable) new_info.hireable = hireable;
		if (skills) {
			skills = skills.split(",").map((skill) => skill.trim().toUpperCase());
		}

		//build social object
		if (links) {
			links = [...links];
		}

		try {
			//update
			profile = await Profile.findOne({ user: req.user.id });

			profile.github_info = { ...profile.github_info, ...new_info };

			profile.skills = skills
			profile.links = links

			profile = await profile.save();

			res.send(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("server error");
		}
	}
);

//@route  GET api/profile
//@desc  get all profiles
//@access public
router.get("/", async (req, res) => {

	try {
		const profiles = await Profile.find().populate("user", [
			"name",
			"avatar",
			"type",
		]);
		res.json(profiles);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("server error");
	}
});

//@route  GET api/profile/:user_id
//@desc  get  profile  by user id
//@access public
router.get("/:profileid", async (req, res) => {
	try {
		const profile = await Profile.findOne({
			_id: req.params.profileid,
		}).populate("user", ["name", "avatar", "type"]);

		if (!profile) {
			return res.status(400).json({ msg: "there is no profile for this user" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		if (err.kind === "ObjectId") {
			return res.status(400).json({ msg: "there is no profile for this user" });
		}
		res.status(500).send("server error");
	}
});

//@route  Delete api/profile
//@desc  Delete profile ,user and component(Account)
//@access private
router.delete("/", auth, async (req, res) => {
	try {
		const profileId = await Profile.findById({ user: req.user.id })._id;

		//Delete component
		await Component.deleteMany({ profile: profileId });

		//delete profile
		await Profile.findOneAndRemove({
			user: req.user.id,
		});

		//delete user
		await User.findOneAndRemove({
			_id: req.user.id,
		});

		res.json({ msg: "User has been removed successfully" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("servre error");
	}
});

//@route  Put api/profile/experience
//@desc  add profile experience
//@access private
router.put(
	"/experience",
	[
		auth,
		[
			check("title", "title is required").not().isEmpty(),
			check("company", "company is required").not().isEmpty(),
			check("from", "from is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		} = req.body;

		const newExp = {
			title,
			company,
			location,
			from,
			to,
			current,
			description,
		};
		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.experience.unshift(newExp);
			await profile.save();
			res.json(profile);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("server error");
		}
	}
);

//@route  delete api/profile/experience/:exp_id
//@desc  delete particular expirence
//@access private
router.delete("/experience/:exp_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		//get remove index
		const removeIndex = profile.experience
			.map((item) => item.id)
			.indexOf(req.params.exp_id);

		profile.experience.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("server error");
	}
});

//@route  Put api/profile/education
//@desc  add profile education
//@access private
router.put(
	"/education",
	[
		auth,
		[
			check("school", "school is required").not().isEmpty(),
			check("degree", "degree is required").not().isEmpty(),
			check("from", "from is required").not().isEmpty(),
			check("fieldofstudy", "fieldofstudy is required").not().isEmpty(),
		],
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
		}

		const {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		} = req.body;

		const newEdu = {
			school,
			degree,
			fieldofstudy,
			from,
			to,
			current,
			description,
		};
		try {
			const profile = await Profile.findOne({ user: req.user.id });
			profile.education.unshift(newEdu);
			await profile.save();
			res.json(profile);
		} catch (error) {
			console.error(error.message);
			res.status(500).send("server error");
		}
	}
);

//@route  delete api/profile/education/:edu_id
//@desc  delete particular education
//@access private
router.delete("/education/:edu_id", auth, async (req, res) => {
	try {
		const profile = await Profile.findOne({ user: req.user.id });

		//get remove index
		const removeIndex = profile.education
			.map((item) => item.id)
			.indexOf(req.params.edu_id);

		profile.education.splice(removeIndex, 1);
		await profile.save();
		res.json(profile);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("server error");
	}
});


//@route  PUT api/profile/:id/follow
//@desc   follow developer
//@access private
router.put("/:id/follow", auth, async (req, res) => {
	try {
		const profile = await Profile.findById({ _id: req.params.id });

		let found = false;

		for (let i = 0; i < profile.followers.length; i++) {
			if (profile.followers[i].toString() === req.user.id) {
				profile.followers.splice(i, 1);
				found = true;
				break;
			}
		}

		if (!found) profile.followers.unshift(req.user.id);

		await profile.save();
		res.json(profile);
	} catch (error) {
		console.error(error.message);
		return res.status(500).send("server error");
	}
});


module.exports = router;
