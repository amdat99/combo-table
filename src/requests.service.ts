const fetchData = async (url: RequestInfo | URL, cb: Function) => {
  const response = await fetch(url);
  const data = await response.json();
  return cb(data);
};

const requestsService = {
  fetchData,
} as const;

Object.freeze(requestsService);

export default requestsService;
