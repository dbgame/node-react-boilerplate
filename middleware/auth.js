const { User } = require("../models/User");

let auth = (req, res, next) => {

    //인증 처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 토큰을 복호화하여 유저를 찾는다.
    // token을 전달하고 (err, user)를 받는다.
    User.findByToken(token, (err, user) => {
        if(err) throw err;
        if(!user) return res.json({ isAuth: false, error: true });

        req.token = token;
        req.user = user;
        next();
    });

    // 유저가 있으면 인증 ok
    

    // 유저가 없으면 인증 실패
}

module.exports = {auth};