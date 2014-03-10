/**
 * Created by aselims on 1/14/14.
 */
 
 
//var mongo = require('mongodb');

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Connect to the db
MongoClient.connect("mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/", function(err, db) {
  if(!err) {
    console.log("We are connected");
    db.authenticate(user, pw, function(err, db){
        if(!err){
            console.log("Authenticated")   
        }
    })
  }
});


//db.authenticate(username, password, function(err, db) { 
                callback(err, db); 
        }); 

//var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var DbName = 'placesDb';
//mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/

//var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db(DbName, server, {safe: true});


exports.findAll = function(req, res) {
    db.collection('places', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.findOneplace = function(req, res){
    var id = req.params.id;
    db.collection('places', function(err, collection){
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });

};

exports.addOneplace = function(req, res){
    var place = req.body;
    console.log("Inserting place: " + JSON.stringify(place));
    db.collection('places', function(err, collection) {
        //collection.insert(docs[[, options], callback])
        collection.insert(place, true, function(err, collection){
            collection.msg = 'success'
            res.send(collection);
            console.log("inserted:" + JSON.stringify(place));
        });
    });
}

exports.updateplace = function(req, res) {
    var id = req.params.id;
    var place = req.body;
    delete place._id;
    console.log('Updating place: ' + id);
    console.log(JSON.stringify(place));
    db.collection('places', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, place, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating place: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                result.msg = 'success';
                console.log(JSON.stringify(result))
                res.send(result);
            }
        });
    });
}

exports.deleteplace = function(req, res) {
    var id = req.params.id;
    console.log('Deleting place: ' + id);
    db.collection('places', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                result.msg = 'success';
                console.log(JSON.stringify(result))
                res.send(result);
                
            }
        });
    });
}


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var places = [
        {
            Title: "youcon",
            Description: "A conference for young people",
            Date: '10.2.15',
            Address: 'Osloerstr. 121, Berlin',
            TimeOfCreation: new Date(),
            User: "Selim"
        },
        {
            Title: "youshock",
            Description: "a paly",
            Date: '10.32.154',
            Address: 'hhhh. 121, Berlin',
            TimeOfCreation: new Date(),
            User: "Gold"
        },
        {
            Title: "tech",
            Description: "meeetup fo who dare",
            Date: '10.2.2023',
            Address: 'berlinerstr. 55, Berlin',
            TimeOfCreation: new Date(),
            User: "nilly"
        }
    
   ];

    db.collection('places', function(err, collection) {
        collection.insert(places, {safe:true}, function(err, result) {});
    });

}();


