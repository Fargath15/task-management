import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import _ from "lodash";

export class EmailService {
  private mailSender: any;

  constructor() {
    console.log({ user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS });
    this.mailSender = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
  }

  public GetTemplatePath(fileName: string): string {
    let fileUrl: string = "dist/public/";
    let resolvedPath = fileUrl + fileName;
    resolvedPath = path.resolve(resolvedPath);
    console.log("GetTemplatePath => ", resolvedPath);
    return resolvedPath;
  }

  public async SendTaskAssignedEmail(email: string, subject: string, data: any) {
    let resolvedPath = this.GetTemplatePath("task_assigned_email.html");
    let invoiceFileData = fs.readFileSync(resolvedPath).toString();
    let htmlTemplate = _.template(invoiceFileData);

    const task_url = process.env.TASK_URL + data?.id;
    let html = htmlTemplate({
      ...data,
      task_url: task_url,
    });
    await this.mailSender.sendMail({
      from: `Task App ${process.env.EMAIL_USER}`,
      to: email,
      subject: subject,
      html: html,
    });
  }

  public async SendTaskUpdatedEmail(email: string, subject: string, data: any) {
    let resolvedPath = this.GetTemplatePath("task_updated_email.html");
    let invoiceFileData = fs.readFileSync(resolvedPath).toString();
    let htmlTemplate = _.template(invoiceFileData);

    const task_url = process.env.TASK_URL + data?.id;
    let html = htmlTemplate({
      ...data,
      task_url: task_url,
    });
    await this.mailSender.sendMail({
      from: `Task App ${process.env.EMAIL_USER}`,
      to: email,
      subject: subject,
      html: html,
    });
  }

  public async SendTaskDeletedEmail(email: string, subject: string, data: any) {
    let resolvedPath = this.GetTemplatePath("task_deleted_email.html");
    let invoiceFileData = fs.readFileSync(resolvedPath).toString();
    let htmlTemplate = _.template(invoiceFileData);

    const task_url = process.env.TASK_URL + data?.id;
    let html = htmlTemplate({
      ...data,
      task_url: task_url,
    });
    await this.mailSender.sendMail({
      from: `Task App ${process.env.EMAIL_USER}`,
      to: email,
      subject: subject,
      html: html,
    });
  }
}
