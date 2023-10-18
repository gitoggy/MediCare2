const mysql=require('mysql')

//connecting to database
const db=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'MediCare'
})

db.connect((err)=>{
    if(err) throw err
    console.log('database connected')
})

//exporting database connection
module.exports=db;