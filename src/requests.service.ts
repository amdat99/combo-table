import { data } from "./data";

const fetchData = async (url: string | string[], cb: Function) => {
  // const response = await fetch(url);
  // const data = await response.json();

  const currentData = typeof url === "string" ? [url] : url;

  const response: any = {};

  currentData.forEach((url, index) => {
    const rows = localStorage.getItem(url);
    if (rows && rows !== "[]") {
      response[url] = JSON.parse(rows);
    } else {
      //@ts-ignore
      const rows = data[url];
      localStorage.setItem(url, JSON.stringify(rows));
      response[url] = rows;
    }
  });
  setTimeout(() => {
    cb(response);
  }, 180);
};

const setData = (data: any, key: string | number) => {
  localStorage.setItem(key.toString(), JSON.stringify(data));
};

const requestsService = {
  fetchData,
  setData,
} as const;

Object.freeze(requestsService);

export default requestsService;
