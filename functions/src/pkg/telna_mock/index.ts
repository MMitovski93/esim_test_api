///this is mock service that returns data that mocks telna api. It returns per record iccid and phone number
import { getConfig } from "../core/config/config";
const conf = getConfig("telna_mock_api");

interface IMockApiObject {
  id: string;
  status: string;
  msisdn: string;
  icc: string;
  imsi: string;
  esim: boolean;
  subscriberId: string;
  customerId: string;
  activatedAt: string;
  createdAt: string;
  updatedAt: string;
}

// this is mock example data
const mockApiObject: IMockApiObject = {
  id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
  status: "ACTIVE",
  msisdn: `${conf.send_to_number}`,
  icc: "89014103211118510720",
  imsi: "310260000000000",
  esim: true,
  subscriberId: "1234567890",
  customerId: "87d8e330-2878-4742-a86f-dbbb3bf522ac",
  activatedAt: "2025-04-15T17:00:00Z",
  createdAt: "2025-04-15T17:00:00Z",
  updatedAt: "2025-04-15T17:00:00Z",
};

const getTelnaMockData = (records: number): IMockApiObject[] => {
  let out = [];
  for (let i = 1; i <= records; i++) {
    out.push(mockApiObject);
  }
  return out;
};

export default {
  getTelnaMockData,
};

  