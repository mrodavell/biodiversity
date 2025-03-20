import dayjs from "dayjs";

const getTimestamp = () => {
  return dayjs().format("YYYY-MM-DD HH:mm:ss");
};

export { getTimestamp };
