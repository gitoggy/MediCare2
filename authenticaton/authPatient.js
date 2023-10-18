//exporting middleware for patient authentication
module.exports=(req,res,next)=>{
    if(req.session.isPatient){
        next();
        }
        else{
            return res.send('sign in first')
        }
}