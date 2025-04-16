import { getConfig } from "../core/config/config";
const conf = getConfig("twilio");

const twilioClient = require("twilio")(conf.account_sid, conf.auth_token);

export interface IMessage {
  body: string;
  status: string;
  to: string;
  accountSid: string;
  sid: boolean;
  dateCreated: string;
}

const send = async (messageBody: string, to: string): Promise<IMessage> => {
  const message = await twilioClient.messages.create({
    body: messageBody,
    from: conf.sender_number,
    to: to,
  });

  return message;
};

const getMessagesList = async() => {
  const messages = await twilioClient.messages.list();
  return messages;
}

export default {
  send,
  getMessagesList
};
