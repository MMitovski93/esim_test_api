interface Code {
  message: string;
  status: number;
}

interface Codes {
  OK: Code;
  NO_CONTENT: Code;
  CREATED: Code;
  NOT_FOUND: Code;
  UNPROCESSABLE_ENTITY: Code;
  ERROR: Code;
  BAD_REQUEST: Code;
}

export const code: Codes = {
  OK: {
    status: 200,
    message: "ok",
  },
  NO_CONTENT: {
    status: 204,
    message: "No Content",
  },
  CREATED: {
    status: 201,
    message: "Created",
  },
  NOT_FOUND: {
    status: 404,
    message: "Not Found",
  },
  BAD_REQUEST: {
    status: 400,
    message: "Bad Request",
  },
  UNPROCESSABLE_ENTITY: {
    status: 422,
    message: "Unprocessable Entity",
  },
  ERROR: {
    status: 500,
    message: "",
  },
};

export const SEND_MESSAGE_RATE_LIMIT = 500; //500 miliseconds

export const MESSAGE_CONSTANTS = {
  THANK_YOU: "Thank you for your patience ",
  API_NAME: "Esim sms api",
};
