var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { initialize } = require('express-openapi')
const swaggerUi = require('swagger-ui-express')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
//app.use('./api/paths', myRouter)



app.listen(2002)

initialize({
    app,
    apiDoc: require('./api/api-doc'),
    paths: "./api/paths"
})

app.use(
    "/api-documentation",
    swaggerUi.serve,
    swaggerUi.setup(
        null,
        {
            swaggerOptions: {
                url: "http://localhost:9042/api-docs"
            }
        }
    )

)


module.exports = app;
