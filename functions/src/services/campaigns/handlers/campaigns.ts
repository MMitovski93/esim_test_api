import { Request, Response } from "express";
import { code } from "../../../pkg/constants";
import Campaign, { ICampaign } from "../../../pkg/campaigns";
import TelnaMock from "../../../pkg/telna_mock";
import Sms from "../../../pkg/sms";
import { validate, VALIDATION_SCHEMAS } from "../../../pkg/validators";
import formidableServerless from "formidable-serverless";
import { parseCsv } from "../../../pkg/storage";
import { uploadToStorage } from "../../../pkg/storage";
import {
  allowedFileTypes,
  maxSizeAllowed,
} from "../../../pkg/validators/storageSchema";
import { invalidIccIdList, invalidIccIdMessage } from "../../../pkg/validators/campaignSchema";

import fs from "fs";
import {
  SEND_MESSAGE_RATE_LIMIT,
  MESSAGE_CONSTANTS,
} from "../../../pkg/constants";
import { IMessage } from "../../../pkg/sms";
import { generateDynamicString } from "../../../pkg/core/strings";

const getOne = async (req: Request, res: Response) => {
  try {
    let c = await Campaign.getOneById(req.params.id);
    if (!c)
      return res.status(code.NOT_FOUND.status).send(code.NOT_FOUND.message);
    return res.status(code.OK.status).send(c);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};
const getCampaignStatus = async (req: Request, res: Response) => {
  try {
    let c = await Campaign.getOneById(req.params.id);
    if (!c)
      return res.status(code.NOT_FOUND.status).send(code.NOT_FOUND.message);
    return res.status(code.OK.status).send(c.status);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    let v = validate(VALIDATION_SCHEMAS.campaign, req.body);
    if (!v.passed) return res.status(code.BAD_REQUEST.status).send(v.errors);
    if (req.body.icc_ids) {
      if (!Array.isArray(req.body.icc_ids)) {
        return res
          .status(code.BAD_REQUEST.status)
          .send(invalidIccIdList);
      }
      const re = /^89\d{16,20}$/;
      const iccIdsvalid = req.body.icc_ids.every((e: string) => {
        return typeof e === "string" && re.test(e);
      });
      console.log(iccIdsvalid)
      if(iccIdsvalid === false) return res.status(code.BAD_REQUEST.status).send(invalidIccIdMessage)
    }

    const data: ICampaign = {
      name: req.body.name,
      status: req.body.status,
      message_template: req.body.message_template,
      icc_ids: req.body.icc_ids ? req.body.icc_ids : [],
    };

    await Campaign.create(data);
    return res.status(code.CREATED.status).send(code.CREATED.message);
  } catch (error) {
    return res.status(code.ERROR.status).send(error);
  }
};

const uploadFile = async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id;
    let c = await Campaign.getOneById(campaignId);
    if (!c) {
      return res.status(code.NOT_FOUND.status).send(code.NOT_FOUND.message);
    }

    const form = formidableServerless({});

    const { fields, err } = await new Promise<{
      fields: string[];
      err: string | null;
    }>((resolve, reject) => {
      form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        //validate file inputs
        const fileName = Object.keys(files)[0];
        const file = files[fileName];
        if (file.size > maxSizeAllowed) {
          return reject({ err: `Max Size is ${maxSizeAllowed} bytes` });
        }
        if (!allowedFileTypes.includes(file.type)) {
          return reject({ err: `File Type not allowed` });
        }
        const filePath = file.path;
        const csvParsed = await parseCsv(filePath);
        // test if number starts with 89 and is 18-22 chars long
        const re = /^89\d{16,20}$/;

        const iccIdsvalid = csvParsed.every((e) => re.test(e));
        if (!iccIdsvalid) {
          return reject({ err: "List contains invalid icc id" });
        }
        // update campaign with icc_ids from csv file
        // upload file to storage
        let fileUrl = await uploadToStorage({
          name: file.name,
          path: file.path,
          type: file.type,
        });
        c.icc_ids = csvParsed;
        c.icc_ids_url = fileUrl;
        await Campaign.updateById(campaignId, c);

        fs.unlink(file.path, (err) => {
          if (err) return reject({ err });
        });
        resolve({ fields: csvParsed, err: null });
      });
    });

    if (err) res.status(code.ERROR.status).send(err);

    return res.status(code.CREATED.status).send(fields);
  } catch (error) {
    console.log("error", error);
    return res.status(code.ERROR.status).send(error);
  }
};

const runCampaign = async (req: Request, res: Response) => {
  try {
    let c = await Campaign.getOneById(req.params.id);
    if (!c) {
      return res.status(code.NOT_FOUND.status).send(code.NOT_FOUND.message);
    }
    /// get mock data with iccids
    let tData = TelnaMock.getTelnaMockData(c.icc_ids.length);
    //send message with simple rate limiter - sends message on each interval
    await Campaign.updateStatusById(req.params.id, "In progress");
    const messages: IMessage[] = [];
    for (const d of tData) {
      console.log(d)
      const msgBody = generateDynamicString(
        MESSAGE_CONSTANTS,
        c.message_template
      );
      const msg = await Sms.send(msgBody, d.msisdn);

      messages.push({
        body: msgBody,
        status: msg.status,
        to: msg.to,
        accountSid: msg.accountSid,
        sid: msg.sid,
        dateCreated: msg.dateCreated,
      });
      await new Promise((resolve) =>
        setTimeout(resolve, SEND_MESSAGE_RATE_LIMIT)
      );
    }

    //store messages in a collection
    await Campaign.storeMessages(req.params.id, messages);
    //update status of a campaign
    await Campaign.updateStatusById(req.params.id, "Finished");
    console.log("MEssages", messages);
    return res.status(code.OK.status).send(code.OK.message);
  } catch (error) {
    console.log("error", error);
    return res.status(code.ERROR.status).send(error);
  }
};

const getMessagesByCampaignId = async (req: Request, res: Response) => {
  try {
    // need to be optimized
    let dbMessages = await Campaign.getCampaignMessages(req.params.id);
    let twilioMessages = await Sms.getMessagesList();

    let out = twilioMessages.filter((m: IMessage) => {
      if (dbMessages.find((dbm: IMessage) => dbm.sid === m.sid)) return m;
      return false;
    });
    return res.status(code.OK.status).send(out);
  } catch (error) {
    console.log("error", error);
    return res.status(code.ERROR.status).send(error);
  }
};

export default {
  getOne,
  create,
  uploadFile,
  getCampaignStatus,
  runCampaign,
  getMessagesByCampaignId,
};
