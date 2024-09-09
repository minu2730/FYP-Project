const sendEmail = require("./mailer");

const sendVerificationEmail = async (email, code) => {
  const message = ` <div style="max-width: 700px; margin: auto;border-radius:10px; padding: 50px 20px; font-size: 110%; text-align: center; background-image:  linear-gradient(
      to bottom left,
      #29084d,
      #830d5c80,
      #191919
    ); font-family: 'Poppins', sans-serif; color: #ffffff;">
    <h2 style="color: white;font-size:2.2rem">Welcome to the MLM Management System</h2>
    <p  style="color: white;font-size:1rem">
        Your Account Verification Code is
    </p>
    <h1 style="color: white;font-size:2.5rem">${code}</h1>
    </div>`;

  

  sendEmail({
    to: email,
    subject: "Account Verification Code",
    html: message,
  });
};

module.exports = sendVerificationEmail;
