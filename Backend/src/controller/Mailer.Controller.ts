import nodemailer from "nodemailer";
import config from "../config";
import express from "express";
import { requestHandler } from "../utils/reqHandler";
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // user: config.mailer.email,
    // pass: config.mailer.password,
    user: "instabackendclone@gmail.com",
    pass: "wwqp ygts cvsf otmo",
  },
});

function sendMail() {
  transporter.sendMail({
    to: "nisantheman@gmail.com",
    subject: "Hello ✔",
    html: "<b>Hello world?</b>",
  });
}
const router = express();

router.post("/resetRequest", requestHandler([sendMail]));

export default router;
