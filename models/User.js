const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; // 10글자를 이용해서 salt를 이용해서 비밀번호를 암호화 해야하며, salt를 먼저 생성한다.
const jwt = require('jsonwebtoken');

// 스키마
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // john ahn@naver.com 에서 space를 자동으로 제거해 줌
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

// pre : db에 저장하기 전에 function 처리를 하는 함수
// bcrypt를 처리할 것이다.
userSchema.pre('save', function( next ){
    var user = this; // user schema를 가져온다.

    // 변경시에는 password만 암호화한다.
    if(user.isModified('password')) {

        // 비밀번호를 암호화 시키니다.
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err) //error 발생하면 save 함수를 사용하는 곳으로 전달 (index.js의 register post)
            
            bcrypt.hash(user.password, salt, function(err, hash){
                if (err) return next(err)
                user.password = hash
                console.log('step3')
                next() // 완료 후 되돌아 간다.
                console.log('step4')
            })
        })
    }
    else // 비밀번호가 아닐 경우, 이 else가 없으면 pre function에 머물게 된다.
    {
        console.log('step1')
        next()
        console.log('step2')
    }
    //next() // 이 next가 들어가면 bcrypt 안된 db가 넘어간다.
});

// schema methods
userSchema.methods.comparePassword = function(plainPassword, cb) {

    // plainPassword: 로그인할 때 입력받은 패스워드
    // 암호화된 비밀번호 ~~~
    console.log('plain:', plainPassword);
    console.log('this:', this.password);
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb) {

    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    
    // 인코드
    // user._id + 'secretToken' = token
    // ->
    // 디코드
    // 'secretToken' => user._id

    user.token = token 
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user)
    })
}

// cb는 콜백이고, 여기에서 처리된 결과를 전달하는 역할
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    console.log('findByToken---------------------');

    // user._id + '' = token
    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가져온 토큰과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user) {
            if (err) return cb(err);
            cb(null, user);
        });
    });

}


// 모델로 만들어 준다. 여기에서는 user 스키마를 'User'로 감싸고 있음
const User = mongoose.model('User', userSchema)

// 이 모델을 다른 곳에서 사용할 수 있도록 한다.
module.exports = { User }