const express = require('express');

const routes = express.Router();

const studentcontroller = require('../controllers/studantcontroller');

const passport = require('passport');

routes.post('/studentregisterdata',studentcontroller.studentregister);
routes.post('/studentlogindata',studentcontroller.studentlogin);
routes.post('/addcategory',passport.authenticate('jwt',{session: false}),studentcontroller.addcategory);
routes.post('/viewcategory',passport.authenticate('jwt',{session: false}),studentcontroller.viewcategory);
routes.post('/studentdatashow',passport.authenticate('jwt',{session: false}),studentcontroller.studentdatashow);
routes.patch('/studentdataupdate',passport.authenticate('jwt',{session: false}),studentcontroller.studentdataupdate);
routes.post('/studentforgotpass',passport.authenticate('jwt',{session: false}),studentcontroller.forgotpass);
routes.post('/studentotp',passport.authenticate('jwt',{session: false}),studentcontroller.otp);
routes.post('/studentnewpass',passport.authenticate('jwt',{session: false}),studentcontroller.newpass);

module.exports = routes;
