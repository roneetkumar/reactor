const axios = require("axios");

module.exports = async function (req, res, next) {

    const { username, repo } = req.body;

    const gitRes = await axios.get(`https://api.github.com/repos/${username}/${repo}`)


    let images = []

    for (let i = 1; i <= 5; i++) {
        try {
            let img = await axios.get(`https://github.com/${username}/${repo}/blob/master/imgs/${i}.${"jpg"}?raw=true`)
            images.push(img.config.url.toString());
        } catch (error) {
            continue;
        }
    }

    if (gitRes.status === 200) {
        const { name, html_url, description } = gitRes.data;

        req.body.name = name;
        req.body.url = html_url;
        req.body.description = description;
        req.body.images = images;
    }

    next();
}
