var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongo')(session);
//const csrf = require('csurf');
//const flash = require('connect-flash');
//require('dotenv').config();


 
// var indexRouter = require('./routes/admin');
// var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var visitorRouter = require('./routes/visitor');
const { collection } = require('./models/admin');
// var hostRouter = require('./routes/host');


 
const MONGODB_URI =
  'mongodb+srv://obed:pinocchio577@cluster0.263vx.mongodb.net/visitorlog';
 
var app = express();
 
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: false, // don't create session until something stored
    resave: false, //don't save session if unmodified
    store: new MongoDBStore({
        url: MONGODB_URI
    }),
    cookie: {maxAge: 180 * 60 * 1000}
}));

app.use((req ,res ,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  next();
});
 
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(visitorRouter);
app.use('/', adminRouter);
// app.use(hostRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


 
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
 
  // render the error page
  res.status(err.status || 500);
  res.json('error');
});


 
mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(3000);
  //   app.listen(PORT, HOST, ()=> {
  //     console.log(`Listening to port ${PORT}`)   
  })
  .catch(err => {
    console.log(err);
  })


 
//   mongoose.connect("mongodb://localhost:27017/Visitorlog",
//  {useNewUrlParser: "true"})
// mongoose.connection.on("connected", () => {
//     console.log("Database connected successfully");
// });
 
mongoose.connection.on("disconnected", () => {
    console.log("Database not connected");
});
 
app.listen(8080)
module.exports = app;