const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const ejs = require('ejs');


app.use(express.static("public"))
app.use('/',function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
    next()
})
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.listen(3001, () => {
  console.log('Express app listening on port 3001');
});

app.set("view engine","ejs");

app.get("/login",(req,res) => {
  res.render("login")
})
let users = [{ "username": "user1", "role": "admin", "password": "p", "AppId": ["1", "2"] },
{ "username": "user2", "role": "user", "password": "p", "AppId": ["2"] },
{ "username": "user3", "role": "operator", "password": "p", "AppId": ["2"] },
{ "username": "user4", "role": "admin", "password": "p", "AppId": ["1", "2"] },
{ "username": "user5", "role": "user", "password": "p", "AppId": ["1"] }]

function generateJWT(username,AppUrl,AppId,req, res){
  let userexists = users.some(user => user.username == username && user.AppId.includes(AppId));
  
  if(userexists){
    let user = users.filter(user => user.username == username);
  let userAppId = user[0].AppId;
  let role = user[0].role;
  const payload = {username,AppId:userAppId, role};
  const token = jwt.sign(payload, "secret-key");
  console.log('token created -',token, AppUrl);
  console.log(`userAppId ${user[0].AppId}`);
    res.cookie('token', token,{maxAge: 1*30*1000});
    res.status(200).send({ "message": "Login successfull","code":200,"token":token,"AppId":user[0].AppId,"redirectUrl":AppUrl});
  }else{
    res.status(200).send({"message":username+" doesn't have access!","code":404})
  }
 }



app.post('/api/login', (req, res) => {
  let { username, password } = req.body;
  let AppUrl = req.query.service;
  let AppId = req.body.AppId;
  console.log('login', req.cookies.token)
  
  // Validate the username and password
  if(req.cookies.token != undefined){
    let decodedToken =  jwt.decode(req.cookies.token, "secret-key");
     console.log(`payload ${JSON.stringify(decodedToken)}`);
     let JWTAppId = decodedToken.AppId;
     console.log('--------',JWTAppId.includes(AppId))
     if(JWTAppId.includes(AppId)){
      res.status(200).send({ "message": "Login successfull","token":req.cookies.token,"redirectUrl":AppUrl});
     }else{
      generateJWT(username, AppUrl,AppId, req, res);
     }
  }else if (username && password) {
    console.log('username',username)
    // const sessionId = Math.random().toString(36).substring(2);
    console.log('AppUrl',AppUrl)
    generateJWT(username, AppUrl,AppId, req, res);
  } else {
    res.send('Login failed');
  }
});


