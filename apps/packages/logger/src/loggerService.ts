import { AxiosResponse } from 'axios';
import { coreClient } from './coreClient';
import { Events } from './events';

export interface Log {
  event: Events
  data: any
}

interface PostLogsDTO {
  event: Events
  // index: string
  data: any
}

// const addLog =
// (companyId: string) =>
// (newLog: Log) => coreClient.post<any, AxiosResponse, PostLogsDTO>('/Logs', {
const addLog = (newLog: Log) => coreClient.post<any, AxiosResponse, PostLogsDTO>('/Logs', {
  event: newLog.event,
  // index: 'events_'
  //   .concat(newLog.event)
  //   .concat('_companies_')
  //   .concat(companyId),
  data: {
    ...newLog.data,
    type: newLog.event,
    eventType: newLog.event,
  },
});

const loggerService = {
  addLog,
};

export {
  loggerService,
};
