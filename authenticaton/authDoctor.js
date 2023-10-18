//exporting middleware for doctor authentication
module.exports=(req,res,next)=>{
    if(req.session.isDoctor){
        next();
        }
        else{
            return res.send('sign in first')
        }
}