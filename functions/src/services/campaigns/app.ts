import express from "express";

//handlers
import Campaigns from "./handlers/campaigns";

//router
const router = express.Router();

//Routes
router.get('/v1/campaigns/:id/start', Campaigns.runCampaign);
router.get("/v1/campaigns/:id", Campaigns.getOne);
router.get("/v1/campaigns/:id/status", Campaigns.getCampaignStatus);
router.post('/v1/campaigns', Campaigns.create);
router.post('/v1/campaigns/:id/upload', Campaigns.uploadFile);
router.get('/v1/campaigns/:id/messages', Campaigns.getMessagesByCampaignId);


export default router;
