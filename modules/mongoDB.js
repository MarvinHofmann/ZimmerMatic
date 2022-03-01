const main = require("../index");

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = process.env.DB_URL;
console.log(uri);

const DBClient = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

MongoClient.connect(uri)
    .then(client => {
        try {
            const db = client.db('tempSensor');
            const tempCollection = db.collection('values');
            main.app.locals.collection = tempCollection;
            console.log("connection erfolgt");
        } catch (error) {
            console.log(error);
        }
    });

function store(valObj) {
    main.app.locals.collection.insertOne(valObj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
    const collection = main.app.locals.collection;
    collection.find({}).toArray()
        .then(response => console.log(response));
}
exports.store = store;

main.app.get("/db/tempValues", (req, res) => {
    const collection = main.app.locals.collection;
    collection.distinct("temperatur")
        .then(response => res.status(200).json(response))
        .catch(error => console.error(error));
    res.sendStatus(200);
});

main.app.get("/db/tageshoch", (req, res) => {
    
    res.sendStatus(200);
});