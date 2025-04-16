import { DocumentData } from "firebase-admin/firestore";
import { getDB } from "../../pkg/core/db";
import { IMessage } from "../sms";

//db reference
const db = getDB();

export interface ICampaign {
  name: string;
  status: string;
  message_template: string;
  icc_ids: string[];
}

export const getOneById = async (
  id: string
): Promise<DocumentData | undefined> => {
  const snapshot = await db.collection("campaigns").doc(id).get();
  if (snapshot.exists) return snapshot.data();
  return undefined;
};

export const create = async (payload: ICampaign) => {
  let res = await db.collection("campaigns").doc().create(payload);
  return res;
};

export const updateById = async (
  id: string,
  payload: { [key: string]: string | number | boolean | string[] }
) => {
  let res = await db.collection("campaigns").doc(id).update(payload);
  return res;
};

export const updateStatusById = async (id: string, status: string) => {
  let res = await db.collection("campaigns").doc(id).update({ status: status });
  return res;
};

const storeMessages = async (
  campaignId: string,
  messages: IMessage[]
): Promise<boolean> => {
  const BATCH_LIMIT = 500;
  const messagesChunks = [];

  for (let i = 0; i < messages.length; i += BATCH_LIMIT) {
    messagesChunks.push(messages.slice(i, i + BATCH_LIMIT));
  }

  for (const chunk of messagesChunks) {
    const batch = db.batch();
    chunk.forEach((msg) => {
      const messageRef = db.collection("campaign_messages").doc();
      batch.set(messageRef, {
        campaign_id: campaignId,
        body: msg.body,
        status: msg.status,
        accountSid: msg.accountSid,
        sid: msg.sid,
        dateCeated: msg.dateCreated,
      });
    });

    await batch.commit();
  }
  return true;
};

const getCampaignMessages = async (id: string): Promise<any[]> => {
  const messagesRef = db.collection("campaign_messages");
  const querySnapshot = await messagesRef.where("campaign_id", "==", id).get();

  const messages: any[] = [];
  querySnapshot.forEach((doc) => {
    messages.push({ id: doc.id, ...doc.data() });
  });

  return messages;
};

export default {
  getOneById,
  create,
  updateById,
  updateStatusById,
  storeMessages,
  getCampaignMessages,
};
