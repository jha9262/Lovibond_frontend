export const isValidIP = (ip) =>
  /^(\d{1,3}\.){3}\d{1,3}$/.test(ip)
