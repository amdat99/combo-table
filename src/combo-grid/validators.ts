export const textValidators = {
  email: {
    pattern: /\S+@\S+\.\S+/,
    error: "Invalid email address",
  },
  tel: {
    pattern: "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$",
    error: "Invalid phone number (i.e. +919876543210)",
  },
  password: {
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})",
    error: "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number and one special character",
  },
  char: {
    pattern: "^[a-zA-Z ]+$",
    error: "Only letters are allowed",
  },
  number: {
    pattern: "^[0-9]+$",
    error: "Only numbers are allowed",
  },
  decimal: {
    pattern: "^[0-9]+(.[0-9]{1,2})?$",
    error: "Only decimal numbers are allowed",
  },
  // date: {
  //   pattern: "^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2}$",
  //   error: "Invalid date format (i.e. 01/01/2020)",
  // },
  // time: {
  //   pattern: "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
  //   error: "Invalid time format (i.e. 12:00)",
  // },
  // week: {
  //   pattern: "^(0[1-9]|1[0-9]|2[0-9]|3[0-1])$",
  //   error: "Invalid week format (i.e. 01)",
  // },
  // month: {
  //   pattern: "^(0[1-9]|1[0-2])$",
  //   error: "Invalid month format (i.e. 01)",
  // },
  // year: {
  //   pattern: "^(19|20)d{2}$",
  //   error: "Invalid year format (i.e. 2020)",
  // },
  // datetime: {
  //   pattern: "^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
  //   error: "Invalid date time format (i.e. 01/01/2020 12:00)",
  // },
  // "datetime-local": {
  //   pattern: "^(0[1-9]|1[0-2])/(0[1-9]|1d|2d|3[01])/(19|20)d{2} (0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$",
  //   error: "Invalid date time format (i.e. 01/01/2020 12:00)",
  // },
  url: {
    pattern: "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?",
    error: "Invlid url (Empty spaces are not allowed)",
  },
  // color: {
  //   pattern: "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
  //   error: "Invalid color format (i.e. #ff0000)",
  // },
  // search: null,
  // checkbox: null,
  // button: null,
  // hidden: null,
  // radio: null,
  // text: null,
  // textarea: null,
  // select: null,
} as any;
