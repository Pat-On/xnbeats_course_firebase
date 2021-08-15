const functions = require("firebase-functions");

const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
// const cors = require("cors")({ origin: true });

admin.initializeApp();

const tranporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "placeholder",
    pass: "placeholder",
  },
});

exports.sendEmail = functions.firestore
  .document("messages/{mgsId}")
  .onCreate((snapshot, context) => {
    const mailOptions = {
      from: "",
      to: "",
      subject: "",
      html: `
        <h1> New MSG </h1>
        <p> 
            <b>name</b> ${snapshot.data().name} 
            <b>email</b> ${snapshot.data().email} 
            <b>message</b> ${snapshot.data().message} 
        </p>
    `,
    };

    return tranporter.sendMail(mailOptions, (error, data) => {
      if (error) {
        console.log(error);
        return false;
      }
      console.log("SENT !!!");
    });
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
