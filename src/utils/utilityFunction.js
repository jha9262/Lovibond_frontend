function isValidIP(ip) {
  const ipRegex = /^(25[0-5]|2[0-4]\d|1?\d\d?)\.(25[0-5]|2[0-4]\d|1?\d\d?)\.(25[0-5]|2[0-4]\d|1?\d\d?)\.(25[0-5]|2[0-4]\d|1?\d\d?)$/;
  return ipRegex.test(ip);
}

function isSameSubnet(ip1, ip2) {
  const subnet1 = ip1.split('.').slice(0, 3).join('.');
  const subnet2 = ip2.split('.').slice(0, 3).join('.');
  return subnet1 === subnet2;
}

export const validateStaticAndGatewayIP = (staticIP, gatewayIP) => {
  if (!isValidIP(staticIP)) {
    return { valid: false, message: "Invalid static IP address" };
  }

  if (!isValidIP(gatewayIP)) {
    return { valid: false, message: "Invalid gateway IP address" };
  }

  if (!isSameSubnet(staticIP, gatewayIP)) {
    return { valid: false, message: "Static IP and Gateway must be in the same /24 subnet" };
  }

  return { valid: true, message: "Both IPs are valid and in the same subnet" };
}
