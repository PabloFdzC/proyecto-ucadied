const nodemailer = require('nodemailer');



async function enviarCorreo(html, asunto, emailPara, emailDe){
    emailDe = emailDe && (typeof emailDe) === string ? emailDe :'sistemaucadied@gmail.com';
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: emailDe,
        pass: 'bxlumqofylsqxqjk'
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