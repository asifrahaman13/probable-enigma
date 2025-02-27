export type UserDocument = {
  _id: string;
  mobile_number?: string;
  pan: string;
  name: string;
  date_of_birth: string;
  gender: string;
  email_id: string;
  reference_contact: string;
  education: string;
  married: string;
};

export type MessageState = {
  message: string;
  sender: string;
  timestamp: string;
  finished: boolean;
};
