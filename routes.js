'use strict';

const pages = require('./controllers/pages');
const auth = require('./controllers/auth');
const quest = require('./controllers/quest');
const profile = require('./controllers/profile');

module.exports = function (app, passport) {
    app.get('/', setLoggedFlag, pages.index);

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/login', onlyForNotAuth, setLoggedFlag, (req, res) => {
        var data = Object.assign({message: req.flash('loginMessage')}, req.commonData);
        res.render('auth/login', data);
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', onlyForNotAuth, setLoggedFlag, (req, res) => {
        var data = Object.assign({message: req.flash('signupMessage')}, req.commonData);
        res.render('auth/signup', data);
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/forgot', onlyForNotAuth, setLoggedFlag, (req, res) => {
        res.render('auth/forgot', req.commonData);
    });

    app.post('/forgot', auth.forgot);

    app.get('/reset/:token', onlyForNotAuth, setLoggedFlag, auth.reset);

    app.post('/reset/:token', auth.resetAction);

    app.get('/auth/facebook', onlyForNotAuth, passport.authenticate('facebook', {scope: 'email'}));

    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/auth/vkontakte', onlyForNotAuth, passport.authenticate('vkontakte'));

    app.get('/auth/vkontakte/callback', passport.authenticate('vkontakte', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/auth/twitter', onlyForNotAuth, passport.authenticate('twitter'));

    app.get('/auth/twitter/callback', passport.authenticate('twitter', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/auth/google', onlyForNotAuth, passport.authenticate('google', {scope: 'profile'}));

    app.get('/auth/google/callback', passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/addQuest', onlyForAuth, quest.addQuestPage);

    app.post('/addQuest', onlyForAuth, quest.createQuest, quest.addToMyQuests);

    app.get('/quest/:slug/edit', onlyForAuth, quest.editQuestPage);

    app.put('/quest/:slug/edit', onlyForAuth, quest.editQuest);

    app.delete('/quest/:slug/delete', onlyForAuth, quest.deleteQuest);

    app.get('/quest/:slug', setLoggedFlag, quest.getQuest);

    app.get('/search/cities', pages.searchCities);
    app.get('/search/tags', pages.searchTags);

    app.get('/profile/:id', profile.getProfile);

    app.get('/profile', profile.getProfile);

    app.get('/editProfile', onlyForAuth, profile.editProfile);

    app.put('/updateProfile', profile.updateProfile);

    app.post('/addToWishList', quest.addToWishList);

    app.put('/addPhotoComment', quest.addPhotoComment);

    app.put('/addQuestComment', quest.addQuestComment);

    app.put('/likeQuest', quest.likeAction);

    app.post('/sendUserPhoto', quest.loadUserPhoto, quest.sendUserPhoto);

    app.get('/quests', setLoggedFlag, pages.getQuests);

    app.all('*', pages.error404);

    app.use((err, req, res) => {
        console.error(err);
        res.sendStatus(500);
    });
};

function onlyForNotAuth(req, res, next) {
    if (req.isAuthenticated()) {
        var data = {
            code: 404,
            error: 'not found'
        };
        return res.render('error', Object.assign(req.commonData, data));
    }
    next();
}

function onlyForAuth(req, res, next) {
    if (!req.isAuthenticated()) {
        var data = {
            code: 401,
            error: 'authorization required'
        };
        return res.render('error', Object.assign(req.commonData, data));
    }
    next();
}

function setLoggedFlag(req, res, next) {
    if (!req.isAuthenticated()) {
        var data = {isNotLogged: true};
        req.commonData = Object.assign(data, req.commonData);
    }
    next();
}

