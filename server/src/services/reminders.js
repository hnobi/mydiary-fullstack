import cron from 'node-cron';
import nodemailer from 'nodemailer';
import config from '../config/env.js';

const tasks = new Map();

const mailConfigured = () => Boolean(config.mail.user && config.mail.pass);

let transporter;
const getTransporter = () => {
  transporter ??= nodemailer.createTransport({
    service: config.mail.service,
    auth: { user: config.mail.user, pass: config.mail.pass },
  });
  return transporter;
};

const sendReminder = ({ email, username, reminder }) => getTransporter().sendMail({
  from: config.mail.user,
  to: email,
  subject: 'Reminder from your diary',
  text: `Hi ${username}, why don't you take a minute to write in your diary`,
  html: `<p>Hi <b>${username},</b> why don't you take a minute to write in your diary.
    This is an automatic reminder from <a href="${config.clientUrl}">MyDiary</a>.</p>
    <p>You will receive a reminder every ${reminder} days based on your reminder setting.</p>`,
});

/**
 * (Re)schedules the reminder e-mail for a user. A reminder of 0 cancels it.
 * Schedules live in memory, so they are lost when the server restarts.
 * @param {{ userId: number, email: string, username: string, reminder: number }} user
 * @returns {boolean} true when a reminder is now scheduled
 */
export const scheduleReminder = ({
  userId, email, username, reminder
}) => {
  tasks.get(userId)?.stop();
  tasks.delete(userId);

  if (!mailConfigured() || !reminder || reminder < 1) return false;

  const task = cron.schedule(`0 0 0 */${reminder} * *`, () => {
    sendReminder({ email, username, reminder })
      .then(() => console.log(`Reminder sent to user ${userId}`))
      .catch(err => console.error(`Reminder to user ${userId} failed:`, err.message));
  });
  tasks.set(userId, task);
  return true;
};

export const stopAllReminders = () => {
  tasks.forEach(task => task.stop());
  tasks.clear();
};
