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

   //Calls pool query, sends info down to db, db sends info or error back
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


module.exports = {getStudents}
        


