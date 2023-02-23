import nodemailer from "nodemailer"

const sendLink = async (to, link) => {

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    });

    await transporter.sendMail({
        from: "Hello is 👻 "+process.env.SMTP_USER, // sender address
        to: to,
        subject: "Account activation ✔"+process.env.APP_URL, // Subject line
        text: "",
        html: `<div>
            <h1>Follow the link to activate your account</h1>
            <a href=\`${link}\`>${link}</a>
            </div>`,
    });
}

export { sendLink }