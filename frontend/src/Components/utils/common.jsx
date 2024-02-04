export const zipCodes = [
  "229206",
  "229309",
  "229308",
  "229001",
  "229301",
  "229231",
];

export const greeting = ["Good Morning", "Good Afternoon", "Good Evening"];
const day = new Date().getHours();

export const index = day >= 12 && day < 17 ? 1 : day >= 17 ? 2 : 0;
