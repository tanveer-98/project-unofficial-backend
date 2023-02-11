const express = require('express');
router = express.Router();
const app = express();

// app.use(express.json())

const {sendMessageEmail}  = require( '../emails/accounts')

router.post('/sendEmail', (req,res)=>{
    // console.log(req.body);
    console.log(req.body)
    if(!req.body) return res.status(404).send('Body empty')
    const {fname,lname,mobile,email,message} = req.body;
    // console.log(email)
    try{
    
        sendMessageEmail(req.body)
        return res.status(200).send({message:'Message successfully sent'})
    }
    catch(err){
      return res.status(404).send(err.message)
    }
  })

  module.exports = router;