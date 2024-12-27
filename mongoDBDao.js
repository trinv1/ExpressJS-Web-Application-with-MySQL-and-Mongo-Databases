const MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://127.0.0.1:27017')
.then((client) => {
db = client.db('proj2024')
coll = db.collection('lecturers')
})
.catch((error) => {
console.log(error.message)
})

//Fetching all documents from lecturers collection
var findAll = function () {
    return new Promise((resolve, reject) => {
        coll.find().sort({ _id: 1 }).toArray()//Query to get all documents and sort by id
            .then((documents) => {
                resolve(documents);
            })
            .catch((error) => {
                reject(error); 
            });
    });
};

module.exports = { findAll };

