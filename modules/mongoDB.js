const main = require("../index");
const time = require("./zeit")
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
            const db = client.db('sensorV');
            const tempCollection = db.collection('th');
            const medianTempColl = db.collection('median')
            main.app.locals.collection = tempCollection;
            main.app.locals.mediancoll = medianTempColl;
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
}
exports.store = store;

function storeMedian(valObj) {
    main.app.locals.mediancoll.insertOne(valObj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
    });
}
exports.storeMedian = storeMedian;


main.app.get("/db/tempValues", (req, res) => {
    const collection = main.app.locals.collection;
    collection.distinct("temperatur")
        .then(response => res.status(200).json(response))
        .catch(error => console.error(error));
});

main.app.get("/db/tageshoch", (req, res) => {
    let today = time.getDBFormat();
    console.log("DB Anfrage");
    const collection = main.app.locals.collection;
    //Alle werte heute nach tag gesucht absteigend nach temperatur sortiert,nur der erste Wert
    collection.find({ date: today }).sort({temperatur: -1}).toArray()
        .then(response => res.status(200).json(response[0].temperatur))
        .catch(error => console.error(error));
});


/*****************GRAFIKEN ABFRAGEN********************** */
main.app.get('/db/temp/medium', (req, res) => {
    console.log("DB Anfrage");
    const collection = main.app.locals.mediancoll;
    collection.find().toArray()
        .then(response => res.status(200).json(response))
        .catch(error => console.error(error));
});

main.app.get('/db/temp/sender1', (req, res) => {
    console.log("DB Anfrage");
    const collection = main.app.locals.collection;
    collection.find({sender: 0}).toArray()
        .then(response => res.status(200).json(response))
        .catch(error => console.error(error));
});

main.app.get('/db/temp/sender2', (req, res) => {
    console.log("DB Anfrage");
    const collection = main.app.locals.collection;
    collection.find({sender: 1}).toArray()
        .then(response => res.status(200).json(response))
        .catch(error => console.error(error));
});

main.app.get('/db/temp/sender3', (req, res) => {
    console.log("DB Anfrage");
    const collection = main.app.locals.collection;
    collection.find({sender: 2, date: "3:3:2022"}).toArray()
        .then(response => res.status(200).json(response))
        .catch(error => console.error(error));
});