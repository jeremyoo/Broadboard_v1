const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const methodoverride = require('method-override')
const flash = require('connect-flash');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const boardRouter = require('./routes/boards');
const commentRouter = require('./routes/comments');

const connect = require('./models');

const passportConfig = require('./passport');

const logger = require('./logger');
const morgan = require('morgan');

const app = express();

connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 8001)

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('combined'));
    app.use(helmet());
    app.use(hpp());
} else {
    app.use(morgan('dev'));
}

app.use(morgan('dev'));
app.use(express.json());
app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(process.env.COOKIE_SECRET));

const host = process.env.REDIS_HOST;
const port = process.env.REDIS_PORT;
const password = process.env.REDIS_PASSWORD;
const redisClient = redis.createClient(port, host);
const redisConnectionResult = redisClient.auth(password, err => {
    if (err) console.log(err, " error has occured");
});
console.log("redis connection result? - ", redisConnectionResult);

const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    store: new RedisStore({
        client: redisClient,
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        logErrors: true
    }),
};

if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/boards', boardRouter);
app.use('/boards/:id/comments', commentRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    logger.info('hello');
    logger.error(err.message);
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
})

module.exports = app;
