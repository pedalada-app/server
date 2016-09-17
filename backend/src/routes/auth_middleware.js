'use strict';

var authConfig = require('../../config/auth');
var jwt = require('jsonwebtoken');

var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	if (token) {
		jwt.verify(token, authConfig.superSecret, function (err, decoded) {
			req.athonticate = {
				err: err,
				decoded: decoded
			};
			next();
		})
	}
});