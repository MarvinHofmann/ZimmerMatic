const main = require("../index");

const datenbank = require("nedb")
const db = new datenbank({filename: '../Datenbanken/tempDB.db'});
db.loadDatabase();

function store(json) {
    db.insert(json);
}
exports.store = store;

function getAll() {
    db.find({}, function (err, docs) {
        return docs;
    });
}
exports.getAll = getAll;

exports.getTagesHoch = function () {
    let a = new Date();
    db.find({date: String(a.getDate()) + String(a.getMonth()+1) + String(a.getUTCFullYear())}).sort({temperatur: -1}).limit(1).exec(function (err,docs) {
        console.log(docs);      
        console.log(docs.temperatur);        
        return(docs.temperatur);
    });
}
    
