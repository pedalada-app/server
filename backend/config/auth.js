module.exports = {
	facebookAuth: {
		clientID: process.env.FacebookClientId || '1161779517200969', // your App ID
		clientSecret: process.env.FacebookClientSecret || '81e1acc9a5901eb020a967704dbd0516'// your App Secret
	}
};

module.exports.superSecret = process.env.SuperSecret || "123456789";

module.exports.liveSecret = process.env.LiveSecret || "333";