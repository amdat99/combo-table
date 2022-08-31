import React from "react";
const downloadFile = (data: any, mimeType: string, filename: string) => {
  const a = document.createElement("a"); // Create "a" element
  const blob = new Blob([data], { type: mimeType }); // Create a blob (file-like object)
  const url = URL.createObjectURL(blob); // Create an object URL from blob
  a.setAttribute("href", url); // Set "a" element link
  a.setAttribute("download", filename); // Set download filename
  a.click(); // Start downloading
};

const downloadCSV = (data: any, filename: string, excel = false) => {
  const items = data;
  const ext = excel ? ".xlsx" : ".csv";
  const replacer = (key: any, value: null) => (value === null ? "" : value); // specify how you want to handle null values here
  const header = Object.keys(items[0]);
  const csv = [
    header.join(","), // header row first
    ...items.map((row: { [x: string]: any }) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(",")),
  ].join("\r\n");
  downloadFile(csv, "text/csv", filename + ext);
};

const parseDataIfString = (data: any) => {
  return typeof data === "string" ? JSON.parse(data) : data;
};

const getMousePosition = (e: React.MouseEvent) => {
  return {
    x: e.clientX,
    y: e.clientY,
  };
};

 const objectify = (data: any) => {
  return data.reduce((a: any, b: any) => Object.assign(a, b), {});
};

 const fieldMap = (data: any[0]) => {
  return data.map((item: any) => {
    return {
      [item.value]: item
    };
  });
};


function isArray(obj:any){
    return !!obj && obj.constructor === Array;
}
export const utils = {
  downloadFile,
  downloadCSV,
  objectify,
  parseDataIfString,
  getMousePosition,
  fieldMap,
  isArray
};
