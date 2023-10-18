//importing required dependencies
const express=require('express')
const authDoctor = require('../authenticaton/authDoctor')
const bc=require('bcrypt')
const db = require('../config/database')

const router=express.Router()


//get routes for register and login
router.get('/register',async (req,res)=>{
    res.render('registrationDoctor')
})

router.get('/login',async (req,res)=>{
    res.render('logindoctor')
})

//registering doctor
router.post('/register',async (req,res)=>{
    try{
    //hashing password
    var hashpw=await bc.hash(req.body.password,10)
    //running sql query
    var q={ name:req.body.name,
        specialization:req.body.specialization,
        uprn:req.body.uprn,
        email:req.body.email,
        password:hashpw,
        phone:req.body.phone,
        address:req.body.address,
        experience:req.body.experience,
        education:req.body.education,
        }
    var sql='INSERT INTO doctor_info SET ?'
    db.query(sql,q,(error,result)=>{
        if(error) throw error
        req.session.mail=req.body.email
        res.redirect('/doctor/login')
    })
    }
    catch(err){
        res.send(err)
    }
    })


//login as doctor
router.post('/login', (req,res)=>{
    var sql=`SELECT * FROM doctor_info WHERE email='${req.body.email}'`
    db.query(sql, (err,result)=>{
        if(err) throw err
        if(!result)
        res.send('record not found')
        //decrypt password and compare
        bc.compare(req.body.password,result[0].password,(er,re)=>{
            if(er) throw er
            if(re){
                //store values in session
                req.session.docid=result[0].id;
                req.session.email=req.body.email;
                req.session.isDoctor=true;
                res.redirect('/doctor/dashboard');
            }
            else{
                res.send('invalid email or password')
            }
            })
        
    })
})


//dashboard route
router.get('/dashboard',authDoctor, (req,res)=>{
    var sql=`SELECT * FROM patient_app WHERE doctor_id='${req.session.docid}' AND flag='pending'`
    db.query(sql, (err,result)=>{
        if(err) throw err
        var q=`SELECT * FROM doctor_info WHERE id='${req.session.docid}'`
        db.query(q, (er,re)=>{
        if(er) throw er
        console.log(req.session.docid);
        res.render('doctorDashboard',{patient:result,doctor:re[0]})
    })
    })
})

router.get('/app/:id',authDoctor, (req,res)=>{
    var sql=`SELECT * FROM patient_app WHERE id='${req.params.id}'`
    db.query(sql, (err,result)=>{
        if(err) throw err
        var q=`SELECT * FROM doctor_info WHERE id='${req.session.docid}'`
        db.query(q, (er,re)=>{
        if(er) throw er
        // console.log(req.session.docid);
        res.render('doctorDashboard',{patient:result,doctor:re[0]})
    })
    })
})

router.get('/done/:id',authDoctor, (req,res)=>{
    var sql=`UPDATE patient_app SET flag='done' WHERE id='${req.params.id}'`
    db.query(sql, (err,result)=>{
        if(err) throw err
        var q=`SELECT * FROM doctor_info WHERE id='${req.session.docid}'`
        db.query(q, (er,re)=>{
        if(er) throw er
        // console.log(re[0]);
        res.redirect('/doctor/dashboard')
    })
    })
})

router.get('/notes/:id',authDoctor, (req,res)=>{
    var sql=`UPDATE patient_app SET flag='done' WHERE id='${req.params.id}'`
    db.query(sql, (err,result)=>{
        if(err) throw err
        var q=`SELECT * FROM doctor_info WHERE id='${req.session.docid}'`
        db.query(q, (er,re)=>{
        if(er) throw er
        // console.log(re[0]);
        res.render('doctorDashboard',{patient:result,doctor:re[0]})
    })
    })
})

//exporting router
module.exports = router;


