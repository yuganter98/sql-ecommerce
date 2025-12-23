import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderConfirmation = async (to: string, orderDetails: any) => {
    try {
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-email')) {
            console.warn('⚠️ Email credentials not set. Skipping email sending.');
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: `Order Confirmation #${orderDetails.order_id.slice(0, 8)}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Thank you for your order!</h1>
                    <p>Hi there,</p>
                    <p>We've received your order and are getting it ready for you.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Order Summary</h3>
                        <p><strong>Order ID:</strong> ${orderDetails.order_id}</p>
                        <p><strong>Total:</strong> $${orderDetails.total_amount}</p>
                        <p><strong>Status:</strong> ${orderDetails.status}</p>
                    </div>

                    <h3>Items:</h3>
                    <ul>
                        ${orderDetails.items.map((item: any) => `
                            <li>${item.quantity}x Product (ID: ${item.product_id}) - $${item.subtotal}</li>
                        `).join('')}
                    </ul>

                    <p>We will notify you when your order ships!</p>
                    <p>Best regards,<br/>The E-commerce Team</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Order confirmation email sent:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending order confirmation email:', error);
    }
};

export const sendWelcomeEmail = async (to: string) => {
    try {
        if (!process.env.EMAIL_USER || process.env.EMAIL_USER.includes('your-email')) {
            console.warn('⚠️ Email credentials not set. Skipping email sending.');
            return;
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Welcome to our Community!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Welcome! 🎉</h1>
                    <p>Thanks for subscribing to our newsletter.</p>
                    <p>You're now part of our exclusive community. Use code <strong>WELCOME15</strong> for 15% off your first order!</p>
                    
                    <p>Stay tuned for the latest trends and updates.</p>
                    <p>Best regards,<br/>The E-commerce Team</p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Welcome email sent:', info.messageId);
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
    }
};

import fs from 'fs';
import path from 'path';

export const sendPasswordResetEmail = async (email: string, link: string) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 SIMULATED PASSWORD RESET EMAIL');
    console.log(`To: ${email}`);
    console.log(`Link: ${link}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        const logPath = path.join(process.cwd(), 'reset_link.txt');
        fs.writeFileSync(logPath, `Date: ${new Date().toISOString()}\nTo: ${email}\nLink: ${link}\n`);
        console.log(`✅ Link also written to: ${logPath}`);
    } catch (err) {
        console.error('Failed to write link to file:', err);
    }
};
