import moment from "moment";

export const formatDate = (date: Date): string => {
  return moment(date).locale("id").format("DD MMMM YYYY");
};

export const formatMonth = (month: number): string => {
  if (month >= 1 && month <= 12) {
    return moment()
      .locale("id")
      .month(month - 1)
      .format("MMMM");
  } else {
    return "";
  }
};
