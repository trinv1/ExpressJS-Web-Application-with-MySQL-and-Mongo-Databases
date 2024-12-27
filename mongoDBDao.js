const MongoClient = require('mongodb').MongoClient

//Connecting to mongo db
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
            .then((data) => {
                resolve(data);
            })
            .catch((error) => {
                reject(error); 
            });
    });
};

//Deleting lecturer from collection
var deleteLecturer = function (lecturerID) {
    return new Promise((resolve, reject) => {
        coll.deleteOne({ _id: lecturerID })
            .then((data) => {
                console.log(`Received lecturerID: ${lecturerID}`);
                resolve(data);
            })
            .catch((error) => {
                reject(error); 
            });
    });
};


module.exports = { findAll, deleteLecturer };

