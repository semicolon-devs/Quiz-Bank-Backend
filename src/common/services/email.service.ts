import * as nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_KEY,
  },
});

export const sendEmail = async (otp: string, to: string) => {
  var mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Password reset OTP',
    html: `<p>your otp : ${otp}</p>`,
  };

  console.log('otp : ' + otp);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    return info;
  });
};
