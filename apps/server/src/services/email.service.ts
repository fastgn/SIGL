import nodemailer, { Transporter } from "nodemailer";
import { db } from "../providers/db";

class EmailService {
  private transporter: Transporter;

  constructor() {
    // Set up Nodemailer transporter for Gmail
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // Get template from database by name
  async getTemplateByName(templateName: string) {
    try {
      const template = await db.emailTemplate.findUnique({
        where: { name: templateName },
      });

      if (!template) {
        throw new Error("Template not found");
      }

      return template;
    } catch (error) {
      console.error(`Error fetching template ${templateName}:`, error);
      throw new Error(`Failed to get template ${templateName}`);
    }
  }

  // Send an email with custom mail options
  async sendEmail(mailOptions: { from: string; to: string; subject: string; html: string }) {
    try {
      // Debugging email authentication details
      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      if ((error as any).response) {
        console.error("SMTP Response:", (error as any).response);
      }
      throw new Error("Failed to send email");
    }
  }

  // Send an email using a template from the database
  async sendEmailWithTemplate(to: string, templateName: string, variables: Record<string, string>) {
    console.log("Sending email with template:", templateName, "to:", to, "variables:", variables);
    try {
      const template = await this.getTemplateByName(templateName);

      let emailBody = template.body;
      for (const [key, value] of Object.entries(variables)) {
        emailBody = emailBody.replace(`{{${key}}}`, value);
      }

      const mailOptions = {
        from: "ndenoumis@gmail.com",
        to,
        subject: template.subject,
        html: emailBody,
      };

      // Use the sendEmail method to send the email
      return await this.sendEmail(mailOptions);
    } catch (error) {
      console.error("Error sending email with template:", error);
      throw new Error("Failed to send email with template");
    }
  }
}

export const emailService = new EmailService();
