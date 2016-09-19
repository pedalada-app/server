'use strict';

module.exports.errorHandler = function (res) {
    return function(err) {
        console.error(err);
        res.status(500);
        res.json({msg: "internal error", error: err});
    }
};