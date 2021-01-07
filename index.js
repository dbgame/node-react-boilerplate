const express = require('express')
const app = express()
const port = 5000

const config = require("./config/key");

const { User } = require("./models/User");

const bodyParser = require('body-parser');

// application/x-www-from-rulencoded => url의 정보를 분석
app.use(bodyParser.urlencoded({extended: true}));
// applcation/json => json 정보를 분석
app.use(bodyParser.json());


const mongoose = require('mongoose')
// 통상적인 코드
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}).then(() => console.log('MongoDB Connected...'))
 .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! 마무리해 보자~~ 가즈아~~')
})

app.post('/register', (req, res) => {
    // 회원 가입 할 때 필요한 저보들을 client에서 가져와서 데이터베이스에 넣어준다.

    // 클라이언트가 보낸 정보를 req.body를 통해서 받는다.
    const user = new User(req.body);

    // save는 mongodb에서 오는 method임
    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({ // 200은 성공했을 때,
            success: true
        })
    })
 })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})