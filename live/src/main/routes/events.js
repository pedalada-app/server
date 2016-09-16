"use strict";

var express = require('express');

var HandlerFactory = require('../handlers/handler_factory');
var factory = new HandlerFactory();

var app = express();

app.post('/', function (req, res, next) {

    let update = req.body;
    let handler = factory.getHandler(update['Resource']);

    if (handler) {
        handler.handle(update);
        res.send(200);
    } else {
        console.log("wrong resource - " + update['Resource']);
        res.send(404);
    }
});