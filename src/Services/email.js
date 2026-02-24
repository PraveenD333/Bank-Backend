import dotenv from 'dotenv'
dotenv.config({ quiet: true })
import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transport.verify((error, success) => {
    if (error) {
        console.error("Gmail Services Connection is Failed")
    } else {
        console.log("Gmail is Config... Ready To Send Email")
    }
})

export const sendEmail = async (user) => {
  const toEmail = user.email
    const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
  <table align="center" width="600" cellpadding="0" cellspacing="0"
         style="background-color: #ffffff; padding: 40px; border-radius: 8px; 
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

    <!-- Header -->
    <tr>
      <td align="center" style="padding-bottom: 20px;">
        <h2 style="margin: 0; color: #1a237e;">Welcome to Our Platform</h2>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="color: #333333; font-size: 15px; line-height: 1.6;">
        <p>Dear ${user.name},</p>

        <p>
          Thank you for registering with us. Your account has been successfully created.
        </p>

        <p>
          You can now access your dashboard, manage your profile, and explore all available features.
        </p>
      </td>
    </tr>

    <!-- Info Box -->
    <tr>
      <td align="center" style="padding: 25px 0;">
        <div style="background-color: #eef2ff; border: 1px solid #c5cae9; 
                    border-radius: 6px; padding: 20px; width: 80%;">
          <p style="margin: 0; font-size: 14px; color: #1a237e;">
            <strong>Registered Email:</strong> ${user.email}
          </p>
        </div>
      </td>
    </tr>

    <!-- CTA Button -->
    <tr>
      <td align="center" style="padding: 20px 0;">
        <a href="https://yourwebsite.com/login"
           style="background-color: #1a237e; 
                  color: #ffffff; 
                  text-decoration: none; 
                  padding: 12px 30px; 
                  border-radius: 5px; 
                  font-size: 14px; 
                  font-weight: bold;">
          Access Your Account
        </a>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="padding-top: 30px; font-size: 14px; color: #555;">
        <p>
          If you did not create this account, please contact our support team immediately.
        </p>

        <p>Sincerely,<br/>
        <strong>Support Team</strong><br/>
        Your Company Bank</p>
      </td>
    </tr>

    <tr>
      <td style="padding-top: 20px; border-top: 1px solid #e0e0e0; 
                 font-size: 12px; color: #888;">
        <p>
          This is an automated message. Please do not reply to this email.
        </p>
      </td>
    </tr>

  </table>
</div>
`;

    await transport.sendMail({
        from: `Bank <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Welcome to Bank",
        html,
    })
}

export const sendTransaction = async (
  fromUser,
  toUser,
  fromAccount,
  toAccount,
  amount
) => {
  const date = new Date().toLocaleString();

  // Sender Email
  const debitHtml = `
  <div style="font-family: Arial; background:#f4f6f8; padding:40px 0;">
    <table align="center" width="600" cellpadding="0" cellspacing="0"
           style="background:#fff; padding:40px; border-radius:8px;">
      <tr>
        <td align="center"><h2 style="color:#c62828;">Amount Debited</h2></td>
      </tr>
      <tr>
        <td>
          <p>Dear ${fromUser.name},</p>
          <p>Your account has been debited successfully.</p>
          <div style="background:#ffebee; padding:20px; border-radius:6px;">
            <p><strong>From:</strong> ${fromAccount.accountNumber}</p>
            <p><strong>To:</strong> ${toAccount.accountNumber} (${toAccount.name})</p>
            <p><strong>Amount:</strong> ₹${amount}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Status:</strong> Completed</p>
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;

  // Receiver Email
  const creditHtml = `
  <div style="font-family: Arial; background:#f4f6f8; padding:40px 0;">
    <table align="center" width="600" cellpadding="0" cellspacing="0"
           style="background:#fff; padding:40px; border-radius:8px;">
      <tr>
        <td align="center"><h2 style="color:#2e7d32;">Amount Credited</h2></td>
      </tr>
      <tr>
        <td>
          <p>Dear ${toUser.name},</p>
          <p>You have received money successfully.</p>
          <div style="background:#e8f5e9; padding:20px; border-radius:6px;">
            <p><strong>From:</strong> ${fromAccount.accountNumber} (${fromAccount.name})</p>
            <p><strong>To:</strong> ${toAccount.accountNumber}</p>
            <p><strong>Amount:</strong> ₹${amount}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Status:</strong> Completed</p>
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;

  // Send Emails
  await transport.sendMail({
    from: `Bank <${process.env.EMAIL_USER}>`,
    to: fromUser.email,
    subject: "Amount Debited Successfully",
    html: debitHtml,
  });

  await transport.sendMail({
    from: `Bank <${process.env.EMAIL_USER}>`,
    to: toUser.email,
    subject: "Amount Credited Successfully",
    html: creditHtml,
  });
};

