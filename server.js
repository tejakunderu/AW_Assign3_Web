var express      = require('express');
var app          = express();
var port         = process.env.PORT || 8080;
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var path         = require('path');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.resolve('./public')));

require('./app/routes.js')(app);

app.listen(port);
console.log('Launched on port ' + port);
