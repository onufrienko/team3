'use strict';

const fs = require('fs');
const handlebars = require('hbs').handlebars;
const layouts = require('handlebars-layouts');
const searcher = require('./searcher/searcher.js');

handlebars.registerHelper(layouts(handlebars));
handlebars.registerPartial('base', fs.readFileSync('./views/base.hbs', 'utf8'));

exports.index = (req, res) => {
    var template = handlebars.compile(fs.readFileSync('./views/main.hbs', 'utf8'));
    res.send(template(Object.assign({
        title: 'Layout Test',
        items: [
            'apple',
            'orange',
            'banana'
        ],
        currentUserID: req.user
    }, req.commonData)));
};

exports.error404 = (req, res) => {
    var data = {
        code: 404,
        error: 'not found'
    };
    res.render('error', Object.assign(req.commonData, data));
};

exports.searchCities = (req, res) => {
    var cb = function (objects) {
        res.send(objects);
    };
    if (req.query.word.length > 0) {
        searcher.getCities(cb, req.query.word);
    }
};

exports.searchTags = (req, res) => {
    var cb = function (objects) {
        res.send(objects);
    };
    if (req.query.word.length > 0) {
        searcher.getSimilarTags(cb, req.query.word);
    }
};

exports.getQuests = (req, res) => {
    var template;
    if (req.query.word) {
        template = handlebars.compile(fs.readFileSync('./views/pageQuests/part.hbs', 'utf8'));
    } else {
        template = handlebars.compile(fs.readFileSync('./views/pageQuests/questslist.hbs', 'utf8'));
    }
    var cb = function (quests) {
        res.send(template(Object.assign({
            quests: quests
        }, req.commonData)));
    };
    var geo = {};
    if (req.query.latitude) {
        geo.latitude = parseFloat(req.query.latitude);
        geo.longitude = parseFloat(req.query.longitude);
    }
    if (geo.latitude) {
        searcher.getQuests(cb, req.query.word, geo);
    } else {
        searcher.getQuests(cb, req.query.word);
    }
};
