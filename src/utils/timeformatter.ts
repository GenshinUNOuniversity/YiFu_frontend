import { format } from 'date-fns';
export const dateTimeFormatter = (time: Date | number) => {
  return format(time, 'yyyy-MM-dd HH:mm:ss');
};
export const dateFormatter = (time: Date | number) => {
  return format(time, 'yyyy-MM-dd');
};
export const timeFormatter = (time: Date | number) => {
  return format(time, 'dd日 HH:mm:ss');
};
