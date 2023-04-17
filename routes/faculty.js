const express = require('express');

const routes = express.Router();

const facultycontroller = require('../controllers/facultycontroller');

const passport = require('passport');

routes.post('/facultyregisterdata',facultycontroller.registerdata);
routes.post('/facultylogindata',facultycontroller.facultylogindata);
routes.delete('/facultydelete',passport.authenticate('jwt', {session: false}),facultycontroller.deletefaculty);
routes.patch('/facultyProfileUpdate',passport.authenticate('jwt', {session: false}),facultycontroller.ProfileUpdate);
routes.post('/facultyforgotpass',passport.authenticate('jwt', {session: false}),facultycontroller.forgotpass);
routes.post('/facultyotp',passport.authenticate('jwt', {session: false}),facultycontroller.otp);
routes.post('/facultynewpass',passport.authenticate('jwt', {session: false}),facultycontroller.newpass);
routes.post('/datas',passport.authenticate('jwt', {session: false}),facultycontroller.datas);

module.exports = routes;
