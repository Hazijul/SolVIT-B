import { getPriorityList } from "../services/flaskService.js";
import nodemailer from "nodemailer";

const sendConfirmationEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS,
    },
  });

  const mailOptions = {
    from: "justaddtrial@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

export const fetchPriorityList = async (req, res) => {
    
    try {
        const data = await getPriorityList();
        res.status(200).json(data);
        const top50Complaints = data.sort((a, b) => b.Predicted_Severity_Score - a.Predicted_Severity_Score).slice(0, 50); // Get the top 50

        console.log(top50Complaints);

        const emailBody = `
  <h2>Top 50 Priority Complaints</h2>
  <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
    <thead>
      <tr style="background-color: #f4f4f4;">
        <th style="border: 1px solid #ddd; padding: 8px;">#</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Complaint Category</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Description</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Severity Score</th>
        <th style="border: 1px solid #ddd; padding: 8px;">Public Sentiment Score</th>
      </tr>
    </thead>
    <tbody>
      ${top50Complaints
        .map(
          (complaint, index) => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${complaint.Complaint_Category}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${complaint.Complaint_Text}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${complaint.Predicted_Severity_Score}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${complaint.Public_Sentiment_Score}</td>
          </tr>`
        )
        .join("")}
    </tbody>
  </table>
`;

        // Send email with top 50 complaints
        await sendConfirmationEmail(
        "prarabdhsoni2005@gmail.com", 
        "Top 50 Priority Complaints",
        `Here are the top 50 priority complaints:\n\n${emailBody}`
        );

    } catch (error) {
        res.status(500).json({ error: "Server Error" });
    }
};
