import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface MailOptions {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

/**
 * Sends an email using the shared transporter. Failures are surfaced to
 * the caller so callers can decide whether they're fatal (reset-password)
 * or best-effort (welcome email on signup).
 */
export const sendMail = async ({ to, subject, text, html }: MailOptions) => {
    try {
        const info = await transporter.sendMail({
            from: `"DevTinder" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent successfully:", info.accepted);
        return info;
    } catch (error: any) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email: " + error.message);
    }
};
