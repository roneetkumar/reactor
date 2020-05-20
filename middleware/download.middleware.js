const axios = require("axios");

module.exports = async function (req, res, next) {
  const { username, repo } = req.body;
  const gitRes = await axios.get(
    `https://www.github.com/${username}/${repo}/archive/master.zip`
  );

  if (gitRes.status === 200) {
    req.body.downloaded = true;
  } else {
    req.body.downloaded = false;
  }

  next();
};
