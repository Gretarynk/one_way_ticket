const validateData=(schema)=>{
    return(req,res,next)=>{
        const {error} = schema.validate(req.body);
        if(error){
            console.log(error);
            res.status(400).json({message:"Validation Failed: Missing or invalid information. Please review and try again."});
        }else{
            next();
        }
    };

}
export default validateData;