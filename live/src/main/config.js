module.exports.apiKey = process.env.apiKey;
module.exports.backendFixureUpdateResource = process.env.backendResource;

module.exports.dataDatabaseUrl = process.env.dataDatabase;

module.exports.competitionsUpdateFrequency = process.env.competitionsUpdateFrequency || '*/23 * * * *';
module.exports.fixturesUpdateFrequency = process.env.fixturesUpdateFrequency || '*/61 * * * * *';