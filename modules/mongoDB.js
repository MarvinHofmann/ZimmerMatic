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

function storeTempVal(valObj) {
    main.app.locals.collection.insertOne(valObj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
    });

    const collection = main.app.locals.collection;
    collection.find({}).toArray()
    .then(response => console.log(json(response)));
}
exports.storeTempVal = storeTempVal;

main.app.get("/store", (req,res) =>{
    let obj = {sensor: "bett", temp: 22, hum: 46};
    storeTempVal(obj);
    res.sendStatus(200);
});