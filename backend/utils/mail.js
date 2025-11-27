import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});


const sendMail = async (to, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject:"Reset Your Password",
      text,
      html:`<p>Your OTP is: <b>${text}</b></p>`,
    });
    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}
export { sendMail };