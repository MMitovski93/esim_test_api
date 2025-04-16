# 📢 Campaigns API

This document describes the available endpoints for managing campaigns in the system.

---

## 🚀 Start Campaign

**Endpoint:** `GET /v1/campaigns/:id/start`  
**Description:** Triggers the execution of a campaign.  
**Params:**
- `id` (string) — Campaign ID to start.  
**Response:**  
- `200 OK` — Campaign started successfully.

---

## 🔍 Get Campaign Details

**Endpoint:** `GET /v1/campaigns/:id`  
**Description:** Retrieves details of a specific campaign.  
**Params:**
- `id` (string) — Campaign ID to retrieve.  
**Response:**  
- `200 OK` — Returns campaign details.

---

## 📈 Get Campaign Status

**Endpoint:** `GET /v1/campaigns/:id/status`  
**Description:** Gets the current status of a campaign.  
**Params:**
- `id` (string) — Campaign ID.  
**Response:**  
- `200 OK` — Status object.

---

## 🆕 Create Campaign

**Endpoint:** `POST /v1/campaigns`  
**Description:** Creates a new campaign.  
**Body:**  
- JSON object containing campaign data.  
**Response:**  
- `201 Created` — New campaign created.

---

## 📁 Upload File to Campaign

**Endpoint:** `POST /v1/campaigns/:id/upload`  
**Description:** Uploads a file related to a campaign.  
**Params:**
- `id` (string) — Campaign ID.  
**Body:**  
- Multipart/form-data with file attachment.  
**Response:**  
- `200 OK` — File uploaded successfully.

---

## 💬 Get Campaign Messages

**Endpoint:** `GET /v1/campaigns/:id/messages`  
**Description:** Retrieves all messages associated with a campaign.  
**Params:**
- `id` (string) — Campaign ID.  
**Response:**  
- `200 OK` — List of messages.

---
