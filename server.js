const express = require('express');
const path = require('path');
const app = express();
const jwt = require('jsonwebtoken');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();

});

const { expressjwt: exjwt } = require('express-jwt');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const secretKey = 'DR6KLY8'
const port = 3000;
let users = [
    {
        id: 1,
        username: 'todd',
        password: '1234'
    },
    {
        id: 2,
        username: 'james',
        password: 'dog'
    }
]

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});


app.post('/api/login',(req,res) => {
    const {username, password} = req.body;
    let token;
    for (let user of users){
        if (username == user.username && password == user.password){
            token = jwt.sign({id: user.id, username:user.username}, secretKey, {expiresIn:180})      
            break;
        }
     
    }

    if (token){
        res.json({success:true, err:null, token});
    }else{
        res.json({success:false, err:'Username or password is incorrect', token:null});
    }
    

    
 });

 app.get('/api/dashboard',jwtMW,(req,res) => {
    
    res.json({success:true, myContent: "You found the hidden place"});
    
 });


 app.get('/api/settings',jwtMW,(req,res) => {
   
    res.json({success:true, myContent: "<br><h3>Settings</h3><br>Quality = Awesome<br>FPS = 1000<br>Stuff = Things"});
    
 });


app.get('/',(req,res) => {
   res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err, req, res, next){
    if (err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            err
        })
    }
    else{
        next(err);
    }
    
});


app.listen(port, () => {
    console.log(`Server listening on port${port}`);
});