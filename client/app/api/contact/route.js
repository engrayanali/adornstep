import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Create transporter using Gmail with app password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com', // Replace with your Gmail
        pass: 'gflj ojit nlfj oznw', // App password provided
      },
    });

    // Email to admin
    const adminMailOptions = {
      from: `"Adorn Steps Contact Form" <your-email@gmail.com>`,
      to: 'your-email@gmail.com', // Replace with your receiving email
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(to right, #D4C5B9, #D8998A); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2C2C2C; border-bottom: 2px solid #D4C5B9; padding-bottom: 10px;">Contact Details</h2>
            
            <div style="margin: 20px 0;">
              <p style="margin: 10px 0;"><strong style="color: #2C2C2C;">Name:</strong> <span style="color: #555;">${name}</span></p>
              <p style="margin: 10px 0;"><strong style="color: #2C2C2C;">Email:</strong> <span style="color: #555;"><a href="mailto:${email}" style="color: #D8998A; text-decoration: none;">${email}</a></span></p>
              ${phone ? `<p style="margin: 10px 0;"><strong style="color: #2C2C2C;">Phone:</strong> <span style="color: #555;">${phone}</span></p>` : ''}
            </div>
            
            <h3 style="color: #2C2C2C; margin-top: 20px; border-bottom: 2px solid #D4C5B9; padding-bottom: 10px;">Message</h3>
            <div style="background-color: #FAFAF9; padding: 20px; border-left: 4px solid #D8998A; margin: 20px 0; border-radius: 5px;">
              <p style="color: #2C2C2C; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">Sent from Adorn Steps Contact Form</p>
              <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      `,
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: `"Adorn Steps" <your-email@gmail.com>`,
      to: email,
      subject: 'Thank you for contacting Adorn Steps',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background: linear-gradient(to right, #D4C5B9, #D8998A); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-family: Georgia, serif;">Adorn Steps</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2C2C2C;">Hello ${name},</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out to us! We've received your message and our team will get back to you as soon as possible.
            </p>
            
            <div style="background-color: #FAFAF9; padding: 20px; border-left: 4px solid #D8998A; margin: 20px 0; border-radius: 5px;">
              <p style="color: #999; font-size: 14px; margin: 0 0 10px 0;"><strong>Your Message:</strong></p>
              <p style="color: #2C2C2C; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              In the meantime, feel free to explore our latest collection of premium women's footwear.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:3000" style="display: inline-block; background: linear-gradient(to right, #2C2C2C, #3D3D3D); color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; font-weight: bold;">
                Visit Our Store
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 14px; line-height: 1.6;">
                <strong>Adorn Steps</strong><br>
                123 Fashion Street, Style City, SC 12345<br>
                Phone: +1 (234) 567-890<br>
                Email: info@adornsteps.com
              </p>
            </div>
          </div>
        </div>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again later.' },
      { status: 500 }
    );
  }
}
