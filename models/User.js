const mongoose = require('mongoose');

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

// 모델로 만들어 준다. 여기에서는 user 스키마를 'User'로 감싸고 있음
const User = mongoose.model('User', userSchema)

// 이 모델을 다른 곳에서 사용할 수 있도록 한다.
module.exports = { User }