import nodemailer, {
    Transporter,
    SendMailOptions,
    SentMessageInfo,
} from "nodemailer";


export interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

/**
 * Ensure required environment variables are present
 * Throws an error if missing
 */
function validateEnv(): void {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variables");
    }
}

validateEnv();

/**
 * Nodemailer transporter instance configured for Gmail SMTP
 */
const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
    },
});

/**
 * Sends an email using predefined transporter
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - Optional HTML body
 * @returns {Promise<Object>}
 */

export const sendMail = async (
    options: MailOptions
): Promise<SentMessageInfo> => {
    try {
        const { to, subject, text, html } = options;

        const mailOptions: SendMailOptions = {
            from: `"DevTinder" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Email sent successfully:", info.accepted);

        return info;
    } catch (error: any) {
        console.error("❌ Error sending email:", error.message);
        throw new Error("Failed to send email: " + error.message);
    }
};