module.exports.exampleUser = {
    id : 123456789,
    emails : [{value : "abc@def.com"}],
    displayName : "Ada Pdea",
    photos : [{value : "http://photo.photo"}]
};

module.exports.exampleForm = {

    bets : [{
        fixture : "507f1f77bcf86cd799439011",
        odd : 5,
        bet : 'x'
    }, {
        fixture : "507f1f77bcf86cd799439012",
        odd : 10,
        bet : '2'
    }, {
        fixture : "507f1f77bcf86cd799439013",
        odd : 15,
        bet : '1'
    }],
    pedaladas : 100,
    user : "507f1f77bcf86cd799439014",
    name: "good form",
    expectedWinning: 100*5*10*15

};

var assertFalse = function () {
    expect(false).to.be.true;
};

module.exports.assertFalse = assertFalse;

module.exports.errorHandler = function (error) {
    console.error(error);
    assertFalse();
};