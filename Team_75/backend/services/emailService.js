import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";
import cron from "node-cron";

dotenv.config();  // Load environment variables

export async function generateAndSendReport() {
    try {
        // Fetch complaints from Flask API
        const response = await axios.get("http://127.0.0.1:5000/get-complaints");
        let issues = response.data;

        if (!issues || issues.length === 0) {
            console.log("No new civic issues reported in the last 24 hours.");
            return;
        }

        // Group complaints by user email
        let complaintsByUser = {};
        issues.forEach((issue) => {
            if (!complaintsByUser[issue.User_Email]) {
                complaintsByUser[issue.User_Email] = [];
            }
            complaintsByUser[issue.User_Email].push(issue);
        });

        // Send individual emails
        for (const [userEmail, userIssues] of Object.entries(complaintsByUser)) {
            let reportContent = `<h2>Your Daily Civic Issues Report</h2>
                                <p>These are the issues you reported in the last 24 hours:</p>
                                <table border="1" cellpadding="5" cellspacing="0">
                                <tr>
                                    <th>Issue</th>
                                    <th>Description</th>
                                    <th>Location</th>
                                    <th>Severity</th>
                                    <th>Reported At</th>
                                </tr>`;

            userIssues.forEach((issue) => {
                reportContent += `<tr>
                    <td>${issue.Category}</td>
                    <td>${issue.Complaint}</td>
                    <td>${issue.Location || "Unknown"}</td>
                    <td style="color: ${issue.Severity > 7 ? 'red' : issue.Severity > 4 ? 'orange' : 'green'};">
                        ${issue.Severity.toFixed(2)}
                    </td>
                    <td>${new Date(issue.Timestamp).toLocaleString()}</td>
                </tr>`;
            });

            reportContent += "</table>";

            // Send email
            await sendEmail(userEmail, reportContent);
            console.log(`✅ Report sent to ${userEmail}`);
        }

        // Clear complaints after sending
        await axios.get("http://127.0.0.1:5000/clear-complaints");

    } catch (error) {
        console.error("Error generating civic issues report:", error);
    }
}

// Function to send email
async function sendEmail(userEmail, reportContent) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,  // Send to the specific user
        subject: "Your Daily Civic Issues Report",
        html: reportContent,
    };

    await transporter.sendMail(mailOptions);
}

// Schedule the report to run at 11 AM daily
cron.schedule("0 11 * * *", async () => {
    console.log("⏳ Running scheduled task: Generating and sending civic issue reports...");
    await generateAndSendReport();
});

// Run immediately for testing (remove in production)
generateAndSendReport();
