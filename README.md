#  Campaigns API

An API for managing and running SMS campaigns using mock Telna endpoints and Twilio integration.

---

## 🏗️ Architecture & Setup

This API is built using the following technologies:

- **Node.js + Express.js** — Handles the routing and HTTP layer.
- **Firebase Cloud Functions** — Serverless backend to deploy Express app.
- **Firestore (Firebase)** — Stores campaign data and ICC ID associations.
- **Firebase Storage** — Used to upload and store CSV files containing ICC IDs.

### 🔧 Configuration

At the root of the project, there should be a file named `config.json`.  
This file must be populated with environment-specific settings before running or deploying the project.

#### Example `config.json`


{
    "firebase":{
        "db": {
            "type": "service_account",
            "project_id": "project id",
            "private_key_id": "private key",
            "private_key": "-----BEGIN PRIVATE KEY-----\nyour pricate key\nYqREOt9a/b5L/Kf/ZgFX\n-----END PRIVATE KEY-----\n",
            "client_email": "client email",
            "client_id": "client id",
            "auth_uri": "auth url",
            "token_uri": "token uri",
            "auth_provider_x509_cert_url": "token provider",
            "client_x509_cert_url": "url",
            "universe_domain": "domain"
        },
        "storage":{
            "bucket_url":"you bucket url"
        }
    },
    "twilio":{
        "account_sid":"twilio sid",
        "auth_token":"twilio auth token",
        "sender_number":"sender number needs to be verified"
    },
    "telna_mock_api":{
        "send_to_number":"send to number - needs to be twilio verified to accept messages for testing"
    }
}


---

##  Start Campaign

**Endpoint:** `GET /v1/campaigns/:id/start`  
**Description:** Triggers the execution of a campaign.  
**Params:**
- `id` (string) — Campaign ID to start.  
**Response:**  
- `200 OK` — Campaign started successfully.

---

##  Get Campaign Details

**Endpoint:** `GET /v1/campaigns/:id`  
**Description:** Retrieves details of a specific campaign.  
**Params:**
- `id` (string) — Campaign ID to retrieve.  
**Response:**  
- `200 OK` — Returns campaign details.

---

##  Get Campaign Status

**Endpoint:** `GET /v1/campaigns/:id/status`  
**Description:** Gets the current status of a campaign.  
**Params:**
- `id` (string) — Campaign ID.  
**Response:**  
- `200 OK` — Status object.

---

##  Create Campaign

**Endpoint:** `POST /v1/campaigns`  
**Description:** Creates a new campaign.  
**Body:**  
- JSON object containing campaign data.  
**Response:**  
- `201 Created` — New campaign created.

---
**Request Body:**

```json
{
  "name": "",
  "status": "",
  "message_template": "",
  "icc_ids": []  - optional can be  updated with uploading the csv file
}

## Upload File to Campaign

**Endpoint:** `POST /v1/campaigns/:id/upload`  
**Description:** Uploads a file related to a campaign.  
**Params:**
- `id` (string) — Campaign ID.  
**Body:**  
- Multipart/form-data with file attachment.  
**Response:**  
- `200 OK` — File uploaded successfully.

---
**CSV File Structure:**

The file must contain a header named `icc_id`, followed by rows of numeric ICC ID values.

**Example:**

```csv
icc_id
893201234567890123
89123456789012345678
8998765432101234567890

## 💬 Get Campaign Messages

**Endpoint:** `GET /v1/campaigns/:id/messages`  
**Description:** Retrieves all messages associated with a campaign.  
**Params:**
- `id` (string) — Campaign ID.  
**Response:**  
- `200 OK` — List of messages.

---

##  Telna SMS API (Mock)

The system includes a **mocked Telna SMS API** used internally to simulategetting phone numbers from icc_ids. 


---

## ⚠️ Warning: High Volume Message Sending (Twilio)

When campaigns are executed and ICC IDs are associated with a **Twilio-powered** SMS flow, the system attempts to send messages to all provided `icc_ids`. Numbers are returnrd from telna mock api.

### Important Notes:

- If you're using **test numbers** (e.g., Twilio test credentials or sandbox numbers), uploading a **large number of ICC IDs** and running the campaign will simulate sending a **high volume of messages**.
- Depending on your Twilio configuration:
  - **Real messages may be sent** if you're not using test credentials.
  - You may **hit rate limits or usage caps**, especially on trial accounts.
  - Logs and billing usage may still reflect the activity, even if messages aren’t delivered to real recipients.

### Recommendations:

-  When testing, use a **limited number of ICC IDs** (e.g., 3–5).
-  Confirm your Twilio account is in test mode, or use mocks to avoid unintentional messaging.
---
