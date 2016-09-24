'use strict';

module.exports.errorHandler = function (res, status) {
	status = status || 500;
	return function(err) {
        console.error(err);
        res.status(status);
        res.json({msg: "internal error", error: err});
    }
};