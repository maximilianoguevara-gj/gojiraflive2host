import { useMutation } from '@tanstack/react-query';
import { loggerService } from './loggerService';

const isLoggerEnabled: boolean = process.env.REACT_APP_FEATURE_FLAG_LOGGER === 'true';

// export const useLogger = ({ companyId }: LoggerProps) => {
export const useLogger = () => {
  const { mutate } = useMutation({
    // mutationFn: loggerService.addLog(companyId),
    mutationFn: loggerService.addLog,
  });

  const addLog = (data: any) => {
    if (isLoggerEnabled === true) {
      mutate(data);
    }
  };

  return {
    addLog,
  };
};
