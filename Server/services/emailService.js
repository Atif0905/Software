const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  host: 'smtp.gmail.com',
  auth: {
    user: 'vedantsinghwal@gmail.com', 
    pass: 'your-email-password',  
  },
});

const sendPartnerEmail = async (partner) => {
  const mailOptions = {
    from: 'vedantsinghwal@gmail.com',
    to: partner.customerEmail,
    subject: 'Welcome to Our Channel Partner Program!',
    text: `Hello ${partner.customerFirstName},

Thank you for joining our Channel Partner Program!

Here are your details:
- Unique ID: ${partner.uniqueId}
- Name: ${partner.customerFirstName} ${partner.customerSecondName}
- Email: ${partner.customerEmail}
- Phone Number: ${partner.phoneNumber}
- Gender: ${partner.gender}
- Referred By: ${partner.referredBy}

We look forward to working with you!

Best regards,
Your Company Name`,
  };
  await transporter.sendMail(mailOptions);
};

module.exports = { sendPartnerEmail };
