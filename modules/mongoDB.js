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
            const db = client.db('sensorValues');
            const tempCollection = db.collection('th');
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
});

main.app.get("/db/tageshoch", (req, res) => {
    let a = new Date();
    let today = new Date().toISOString();
    console.log("DB Anfrage");
    const collection = main.app.locals.collection;
    //Alle werte heute nach tag gesucht absteigend nach temperatur sortiert,nur der erste Wert
    collection.find({ date: today }).sort({temperatur: -1}).toArray()
        .then(response => res.status(200).json(response[0].temperatur))
        .catch(error => console.error(error));
});
