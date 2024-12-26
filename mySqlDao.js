var pmysql = require('promise-mysql')//Importing promise

var pool

//Connecting to database
pmysql.createPool({//Returning promise
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'proj2024mysql'
    })
    .then((p) => {//If connected to db
    pool = p
    })
    .catch((e) => {
    console.log("pool error:" + e)
   })

   //Function to get all students from collection
   var getStudents = function(){
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM student')
                .then((data) => {
                    console.log(data)
                    resolve(data)
                })
                .catch((error) => {
                    console.log(error)        
                    reject(error)   
            })   
        })
    }

    //Function to add student
    var addStudent = function(student){
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO student (sid, name, age) VALUES (?, ?, ?)';
            const elements = [student.sid, student.name, student.age];
            pool.query(query, elements) //Query to insert a student    
            .then((result) => {
                    console.log(result)
                    resolve(result)
                })
                .catch((error) => {
                    console.log(error)        
                    reject(error)   
            })   
        })
    }


module.exports = {getStudents, addStudent}
        


