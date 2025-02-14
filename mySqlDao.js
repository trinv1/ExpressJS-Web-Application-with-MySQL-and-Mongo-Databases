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
            pool.query('SELECT * FROM student')//Query to return all students
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
            pool.query('INSERT INTO student (sid, name, age) VALUES (?, ?, ?)', [student.sid, student.name, student.age]) //Query to insert a student    
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

    //Function to get student id
    var getStudentByID = function(sid){
        return new Promise((resolve, reject) => {
            pool.query('SELECT * FROM student WHERE sid = ?', [sid]) //Query to get student id
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

     //Function to update student
     var editStudent = function(sid, student){
        return new Promise((resolve, reject) => {
            pool.query('UPDATE student SET name = ?, age = ? WHERE sid = ?', [student.name, student.age, sid]) //Query to set student updates
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

   //Function to get all grades from collection
   var getGrades = function(){
    return new Promise((resolve, reject) => {
        //Query to return all grades, module name and student name, in ascending order by grade and student name
        pool.query('SELECT student.name AS student_name, module.name AS module_name, grade.grade FROM grade INNER JOIN student ON grade.sid = student.sid INNER JOIN module ON grade.mid = module.mid order by student.name, grade.grade asc;')
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

    //Function to check if a lecturer is associated with a module
    var checkIfLecturerHasModule = function(lecturerID){
        return new Promise((resolve, reject) => {
            //Query to check if lecturer has a module
            pool.query('SELECT * from module where lecturer = ?', [lecturerID])
                .then((data) => {
                    console.log(`Checking modules for lecturer ID: ${lecturerID}`);
                    resolve(data)
                })
                .catch((error) => {
                    console.log(error)        
                    reject(error)   
            })   
        })
    }


module.exports = {getStudents, addStudent, getStudentByID, editStudent, getGrades, checkIfLecturerHasModule}
        


