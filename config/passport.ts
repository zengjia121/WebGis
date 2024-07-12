/** @format */

// const JwtStrategy = require('passport-jwt').Strategy,
//       ExtractJwt = require('passport-jwt').ExtractJwt;
// const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
const mongoose = require("mongoose");
const User = mongoose.model("users");
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

// 假设你有一个用于签名和验证JWT的密钥
const SECRET_KEY = "secret";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET_KEY,
};

export default (passport) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      //console.log(jwt_payload)
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};
