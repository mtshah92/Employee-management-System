import nodemailer from "nodemailer";

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

// Create transporter once
const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false,
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  };

  return nodemailer.createTransport(config);
};

const transporter = createTransporter();

// Utility to calculate leave duration
const calculateDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

// Send leave status notification
export const sendLeaveStatusNotification = async (
  leave: any,
  employeeEmail: string,
  employeeName: string,
  status: "approved" | "rejected",
  adminComment?: string
) => {
  if (!transporter) {
    console.log("📧 Email notification skipped - SMTP not configured");
    return;
  }

  try {
    const subject = `Leave Request ${
      status.charAt(0).toUpperCase() + status.slice(1)
    }`;
    const statusColor = status === "approved" ? "#10B981" : "#EF4444";
    const statusIcon = status === "approved" ? "✅" : "❌";

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Leave Request ${status}</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Leave Request Update</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
          <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; margin-bottom: 20px;">Hello <strong>${employeeName}</strong>,</p>
            
            <div style="background: ${statusColor}15; border-left: 4px solid ${statusColor}; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 16px; font-weight: bold; color: ${statusColor};">
                ${statusIcon} Your leave request has been <span style="text-transform: uppercase;">${status}</span>
              </p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Leave Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 30%;">Leave Type:</td>
                  <td style="padding: 8px 0;">${leave.leaveType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Start Date:</td>
                  <td style="padding: 8px 0;">${new Date(
                    leave.startDate
                  ).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">End Date:</td>
                  <td style="padding: 8px 0;">${new Date(
                    leave.endDate
                  ).toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Duration:</td>
                  <td style="padding: 8px 0;">${calculateDays(
                    leave.startDate,
                    leave.endDate
                  )} day(s)</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase; font-weight: bold;">
                      ${status}
                    </span>
                  </td>
                </tr>
              </table>
            </div>

            ${
              adminComment
                ? `<div style="background: #e3f2fd; border: 1px solid #2196f3; padding: 15px; border-radius: 6px; margin: 20px 0;">
                     <h4 style="margin-top: 0; color: #1976d2;">Admin Comment:</h4>
                     <p style="margin-bottom: 0; font-style: italic;">"${adminComment}"</p>
                   </div>`
                : ""
            }

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                If you have any questions about this decision, please contact your HR department or supervisor.
              </p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #6c757d; font-size: 12px;">
          <p>This is an automated message from the Employee Leave Management System.</p>
          <p>Please do not reply to this email.</p>
        </div>
      </body>
      </html>
    `;

    const textContent = `
      Leave Request ${status.toUpperCase()}
      
      Hello ${employeeName},
      
      Your leave request has been ${status}.
      
      Leave Details:
      - Leave Type: ${leave.leaveType}
      - Start Date: ${new Date(leave.startDate).toLocaleDateString()}
      - End Date: ${new Date(leave.endDate).toLocaleDateString()}
      - Duration: ${calculateDays(leave.startDate, leave.endDate)} day(s)
      - Status: ${status.toUpperCase()}
      
      ${adminComment ? `Admin Comment: "${adminComment}"` : ""}
      
      If you have any questions about this decision, please contact your HR department or supervisor.
      
      This is an automated message from the Employee Leave Management System.
    `;

    await transporter.sendMail({
      from: `"Leave Management System" <${process.env.SMTP_USER}>`,
      to: employeeEmail,
      subject: subject,
      text: textContent,
      html: htmlContent,
    });

    console.log(
      `✅ Email notification sent to ${employeeEmail} for leave ${status}`
    );
  } catch (error) {
    console.error("❌ Failed to send email notification:", error);
    throw error;
  }
};

// Optional: test connection
export const testEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify();
    console.log("✅ Email service connection verified");
    return true;
  } catch (error) {
    console.error("❌ Email service connection failed:", error);
    return false;
  }
};
