import { ManipulateType } from 'dayjs';

const {
  REACT_APP_BAN_TIME_NUMBER = 1,
  REACT_APP_BAN_TIME_UNIT = 'day',
} = process.env;

const BAN_TIME_UNIT: ManipulateType = REACT_APP_BAN_TIME_UNIT as ManipulateType;
const BAN_TIME_NUMBER: number = Number(REACT_APP_BAN_TIME_NUMBER);

export const config = {
  BAN_TIME_UNIT,
  BAN_TIME_NUMBER,
};
