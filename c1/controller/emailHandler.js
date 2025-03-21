const nodemailer = require(`nodemailer`);

const sendEmail = async (options) => {
    //1 kreiranje na transporter
// manuelen email provider
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "0393eecdb47829",
            pass:"fd596cc4f777fc",
        }
    });

    transporter.verify((err, success) => {
        if (err){
            console.log(err.message);
        } else {
            console.log(`success`);
        }
    });

    // definiranje na opciite na mailot
    const mailOptions = {
        from: "Apple <apple@apple.com>",
        to: options.email,
        subject: options.subject,
        text: options.messages
    }

    // go isprakjame mailot
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;