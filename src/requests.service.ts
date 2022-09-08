import { data } from "./data";

const fetchData = async (url: string, cb: Function) => {
  // const response = await fetch(url);
  // const data = await response.json();

  const rows = localStorage.getItem(url);
  if (rows && rows !== "[]") {
    setTimeout(cb, 600, JSON.parse(rows));
  } else {
    //@ts-ignore
    const rows = data[url];
    localStorage.setItem(url, JSON.stringify(rows));
    setTimeout(cb, 600, rows);
  }
};

const setTable = (data: any, key: string) => {
  console.log("setTable", data, key);
  localStorage.setItem(key, JSON.stringify(data));
};

const requestsService = {
  fetchData,
  setTable,
} as const;

Object.freeze(requestsService);

export default requestsService;
