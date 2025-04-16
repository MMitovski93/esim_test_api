import { campaignSchemaRules } from "./campaignSchema";
import Validator from "validatorjs";

export const VALIDATION_SCHEMAS = {
  campaign: "campaign",
};

interface IValidation {
  passed: boolean;
  errors: { [key: string]: any };
}

export const validate = (schema: string, data: any): IValidation => {
  let v;
  let out: IValidation = {
    passed: false,
    errors: {},
  };

  switch (schema) {
    case VALIDATION_SCHEMAS.campaign:
      v = new Validator(data, campaignSchemaRules);
      break;
    default:
      break;
  }

  if (v && v.passes()) {
    out = {
      passed: true,
      errors: {},
    };
  }

  if (v && !v.passes()) {
    out = {
      passed: false,
      errors: v.errors,
    };
  }
  return out;
};
