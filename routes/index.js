// const plateformService = require('./plateformSrvc');
const router = require('express').Router();
const userModel = require('../models/user');
const pollsModel = require('../models/polls')
const mongoose = require('mongoose');

const init = (server) => {
    server.get('*', function (req, res, next) {
        console.log('[Request] : ' + req.originalUrl);
        return next();
    });

    server.get('/', (req, res) => {
        res.render('index', {
            title: 'Polling',
            user: (typeof req.session.user == 'undefined') ? '' : req.session.user
        });
    });
    server.get('/login', (req, res) => {
        res.render('login', {
            title: 'Voting App',
            user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
            status: ''
        });
    });
    server.get('/signup', (req, res) => {
        res.render('signup', {
            title: 'Sign Up',
            user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
            status: ''
        });
    });
    server.post('/signup', (req, res) => {
        if (req.body.password !== req.body.cpassword) {
            res.render('signup', {
                title: 'Sign Up',
                user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                status: 'Password Doesn\'t Matched !!'
            });
        }
        const user = new userModel({
            email: req.body.email,
            password: req.body.password,
            role: 'user'
        });
        user.save().then(result => {
            console.log('result ', result)
            res.render('login', {
                title: 'Sign Up',
                user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                status: 'User Created'
            });
        }).catch(err => {
            console.log('err ', err)
            res.render('signup', {
                title: 'Sign Up',
                user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                status: 'Failed !!'
            });
        });
    });
    server.post('/login', (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        userModel.findOne({ 'email': email, 'password': password })
            .then(user => {
                if (!user) {
                    res.render('login', {
                        title: 'Sign In',
                        user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                        status: 'Login Failed. Please Check Username And Password!'
                    });
                }
                else {
                    req.session.user = user.email.substring(0, user.email.indexOf('@'));
                    req.session.role = user.role;
                    if (req.session.role === 'admin') {
                        res.redirect('/dashboard');
                    }
                    res.redirect('/polls');
                }
            })
            .catch(err => {
                console.log(err)
                res.render('login', {
                    title: 'Sign In',
                    user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                    status: 'Login Failed'
                });
            });
    });
    server.get('/polls', (req, res) => {

        pollsModel.find()
            .then(polls => {
                res.render('polls', {
                    title: 'Polls',
                    user: req.session.user,
                    polls: polls
                });

            })
            .catch(err => {
                res.render('error', {
                    title: 'Polls',
                    user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                    error: 'Some Error Occured !'
                });
            });
    });
    server.post('/votepoll/:pollId', (req, res) => {

        let voter = req.session.user;
        let pollID = req.params.pollId;
        let candidate = req.body.candidate;
        // res.redirect('/polls');
        console.log('req data', req.body.option, req.params.pollId);
        pollsModel.findOne({ _id: pollID })
            .then((poll) => {
                console.log('poll ', poll, voter)
                if (poll.voters.includes(voter)) {
                    res.redirect('/polls');
                } else {
                    poll.voters.push(voter);
                    poll.options = poll.options.map((el) => {
                        if (el.candidate === candidate) {
                            return {
                                candidateId: el.candidateId,
                                candidate: el.candidate,
                                votes: el.votes + 1
                            }
                        } else {
                            return el;
                        }
                    });
                    let newpoll = {
                        pollName: poll.pollName,
                        options: poll.options,
                        voters: poll.voters
                    }
                    pollsModel.findByIdAndUpdate({ _id: pollID }, newpoll, { new: true })
                        .then(result => {
                            console.log('save poll result ', result)
                            res.redirect('/polls');
                        }).catch(err => {
                            console.log('save poll err', err)
                            res.redirect('/polls');
                        });

                }
            }).catch(err => {
                console.log('get poll err', err)
                res.redirect('/polls');
            })
        // res.redirect('/polls');
    })
    server.get('/dashboard', (req, res) => {
        if (req.session.role !== 'admin') {
            res.render('error', {
                title: 'Error',
                user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                error: 'Authorization Error !'
            });
        }
        pollsModel.find()
            .then(polls => {
                res.render('dashboard', {
                    title: 'Dashboard',
                    user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                    polls: polls
                });

            })
            .catch(err => {
                res.render('error', {
                    title: 'Dashboard',
                    user: (typeof req.session.user == 'undefined') ? '' : req.session.user,
                    error: 'Some Error Occured !'
                });
            });
    })

    server.get('/logout', (req, res) => {
        req.session.destroy(function (err) {
            res.redirect('/');
        })
    })




    server.use(router)
}
module.exports = {
    init: init
};