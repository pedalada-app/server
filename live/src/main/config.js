module.exports.apiKey = "7496a844b5b8451fb53526e5d7c650d3";
module.exports.backendFixureUpdateResource = 'http://localhost:8080/update/fixture/finish';

module.exports.dataDatabaseUrl = "mongodb://admin:robinho@ds033126.mlab.com:33126/pedaladadb";

module.exports.backendSecret = process.env.backendSecret || "123456789";

module.exports.competitionsUpdateFrequency = '*/10 * * * * *';
module.exports.fixturesUpdateFrequency = '*/10 * * * * *';