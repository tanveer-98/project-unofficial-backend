const path = require('path')
const nodemailer = require("nodemailer")
const adminEmail = "tnvrahmed98@zohomail.in"
const sendMessageEmail = async (data)=>{
    const {email,fName,lName,mobile , message } = data;
    const output = `
    <p> You have a new Query Message</p>
    <h3> Contact Details</h3>
    <ul>
        <li> Name: ${fName} ${lName}</li>
        <li> Contact No : ${mobile}</li>
        <li> Email: ${email}</li>
    </ul>
    <h3> MESSAGE </h3>
    <p> ${message}</p>
`;

    let transporter = nodemailer.createTransport({
        host: "smtppro.zoho.in",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'tnvrahmed98@zohomail.in', // generated ethereal user
          pass: 'HGsRYHhR726X', // Make sure to generate Application-specific-password if 2FA is enabled
        },
        tls:{
            rejectUnauthorized: false // this must be set to false if the site is localhost or anything other than the domain
        }
      });
    
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `${fName} ${lName} tnvrahmed98@zohomail.in👻 `, // sender address
        to: "tnvrahmed98@zohomail.in", // list of receivers
        subject: `Message from ${fName+lName} `, // Subject line
        text: "Hello world?", // plain text body
        html: output, // html body
      });
}

module.exports = {
    sendMessageEmail
}


/*
 steps to enable Application Specific Password
    1.Login to Zoho Accounts
    2. From the left menu, navigate to Security and click App passwords
    3.Click Generate New Password.
 */


// Configuration steps for SMTP : https://www.zoho.com/mail/help/imap-access.html#:~:text=If%20your%20domain%20is%20hosted,format%20you%40yourdomain.com.