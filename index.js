const express = require('express')
const app = express()
const port = 5000

const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// application/x-www-from-rulencoded => url의 정보를 분석
app.use(bodyParser.urlencoded({extended: true}));
// applcation/json => json 정보를 분석
app.use(bodyParser.json());

app.use(cookieParser())


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
    // 회원 가입 할 때 필요한 정보들을 client에서 가져와서 데이터베이스에 넣어준다.

    // 클라이언트가 보낸 정보를 req.body를 통해서 받는다.
    const user = new User(req.body);

    // save는 mongodb에서 오는 method임
    user.save((err, userInfo) => {
        console.log('step00')
        if(err) {
          console.log("MongoDB Error");
          console.log(err);
          return res.json({success: false, err});
        };
        console.log(userInfo);
        return res.status(200).json({ // 200은 성공했을 때,
            success: true, data: userInfo
        });
    })
 })

app.post('/api/user/login', (req, res) => {

  // 요청된 이메일을 데이터베이스에서 찾기
  // findOne이라는 함수에 email을 인자로 넣고, err, user를 받아와서 화살표 함수에서 활용
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }

    console.log(req.body);
  
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."});

      // 비민번호가 맞다면 토큰을 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // token을 저장한다. 어디에? 쿠키 or local storage or session
        // 여기에서는 쿠키에 저장한다. (어디가 안전한지는 논란이 있다.)
        // 쿠키에 저장하기 위해 library 설치, npm install cookie-parser --save
        res.cookie("x_auth", user.token)  
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
      })

    })

  })

})


// 아 좀 복잡하네... 하고 시작하자
// auth 미들웨어 만들기
app.get('api/users/auth', auth, (req, res) => {

  // 미들웨어를 통과해 왔다면, Authentication이 True라는 의미
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image

  })

})


app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id },
    { token: "" }
    , (err, user) => {
      if(err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true
      })
    })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})