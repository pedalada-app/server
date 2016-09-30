module.exports = {
	facebookAuth: {
		clientID: process.env.FacebookClientId, // your App ID
		clientSecret: process.env.FacebookClientSecret // your App Secret
	}
};

module.exports.superSecret = process.env.SuperSecret || "123456789";

module.exports.liveSecret = process.env.LiveSecret || "333";