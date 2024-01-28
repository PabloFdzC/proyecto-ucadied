const nodemailer = require('nodemailer');



async function enviarCorreo(html, asunto, emailPara){
    const emailDe = process.env.EMAIL_UCADIED;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: emailDe,
        pass: process.env.PASS_EMAIL_UCADIED
        }
    });
    
  const mailOptions = {
      from: emailDe,
      to: emailPara,
      subject: asunto,
      html: html,
  };
  return await transporter.sendMail(mailOptions);
}

module.exports = {
    enviarCorreo,
};