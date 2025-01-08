import nodemailer, { Transporter } from "nodemailer";
import { db } from "../providers/db";
import schedule from "node-schedule"; // Importer node-schedule
import { ControllerError } from "../utils/controller";
import { aw } from "vitest/dist/chunks/reporters.anwo7Y6a.js";

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

      return await this.sendEmail(mailOptions);
    } catch (error) {
      console.error("Error sending email with template:", error);
      throw new Error("Failed to send email with template");
    }
  }

  // Send a scheduled email using a template from the database
  async sendScheduledEmail(
    to: string,
    templateName: string,
    variables: Record<string, string>,
    sendAt: Date,
  ) {
    console.log("Scheduling email with template:", templateName, "to:", to, "sendAt:", sendAt);
    try {
      // Schedule the first reminder email 7 days before the sendAt date at 10:00 AM
      const firstReminderDate = new Date(sendAt);
      firstReminderDate.setDate(new Date(sendAt).getDate() - 7);
      firstReminderDate.setHours(10, 0, 0, 0);

      schedule.scheduleJob(firstReminderDate, async () => {
        try {
          console.log("Sending first reminder email...");
          await this.sendEmailWithTemplate(to, templateName, variables);
          console.log("First reminder email sent.");
        } catch (error) {
          console.error("Error sending first reminder email:", error);
        }
      });

      // Schedule the last reminder email 1 day before the sendAt date at 10:00 AM
      const lastReminderDate = new Date(sendAt);
      lastReminderDate.setDate(lastReminderDate.getDate() - 1);
      lastReminderDate.setHours(14, 9, 0, 0);

      schedule.scheduleJob(lastReminderDate, async () => {
        try {
          console.log("Sending last reminder email...");
          await this.sendEmailWithTemplate(to, templateName, variables);
          console.log("Last reminder email sent.");
        } catch (error) {
          console.error("Error sending last reminder email:", error);
        }
      });

      return { message: "Email scheduled successfully" };
    } catch (error) {
      console.error("Error scheduling email:", error);
      throw new Error("Failed to schedule email");
    }
  }

  // Send an email to a list of groups
  async sendEmailToGroups(
    groups_id: number[],
    templateName: string,
    variables: Record<string, string>,
  ) {
    if (!groups_id || groups_id.length === 0) {
      return ControllerError.INVALID_PARAMS({ message: "group_id est requis" });
    }

    if (!templateName) {
      return ControllerError.INVALID_PARAMS({ message: "templateName est requis" });
    }

    if (!variables) {
      return ControllerError.INVALID_PARAMS({ message: "variables est requis" });
    }

    const groups = await db.group.findMany({
      where: {
        id: {
          in: groups_id,
        },
      },
      include: {
        users: {
          include: {
            apprentice: true,
          },
        },
      },
    });

    // Récupérer les emails des apprentis du groupe
    const emails: string[] = [];
    groups.forEach((group) => {
      group.users.forEach((user) => {
        if (user.apprentice) {
          emails.push(user.email);
        }
      });
    });

    // Envoi des emails
    try {
      emails.map(async (email) => {
        await emailService.sendEmailWithTemplate(email, templateName, variables);
        await emailService.sendScheduledEmail(email, templateName, variables, new Date());
        await emailService.sendScheduledEmail(
          email,
          templateName,
          variables,
          new Date(variables.end_date),
        );
      });
    } catch (error) {
      return ControllerError.INTERNAL({
        message: "Erreur lors de l'envoi de l'email : " + error,
      });
    }
  }
}

export const emailService = new EmailService();
