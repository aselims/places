
var express = require('express'),
    //path = require('path'),
    http = require('http'),
    placesdb = require('./routes/placesdb');

var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
var port    = process.env.OPENSHIFT_NODEJS_PORT || '3000';

var app = express();

app.configure(function () {
    app.set('port', port);
    app.set('ip', ip_addr);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
        //app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/places', placesdb.findAll);
app.post('/place', placesdb.addOneplace);
app.get('/place/:id', placesdb.findOneplace);
app.put('/place/:id', placesdb.updateplace);
app.delete('/place/:id', placesdb.deleteplace);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
