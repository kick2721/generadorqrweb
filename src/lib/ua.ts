export function parseUA(ua: string) {
  const u = ua.toLowerCase();

  let browser = "Unknown";
  if (u.includes("edg/") || u.includes("edge/")) browser = "Edge";
  else if (u.includes("opr/") || u.includes("opera")) browser = "Opera";
  else if (u.includes("chrome/") && !u.includes("edge")) browser = "Chrome";
  else if (u.includes("safari/") && !u.includes("chrome")) browser = "Safari";
  else if (u.includes("firefox/")) browser = "Firefox";
  else if (u.includes("samsung")) browser = "Samsung";

  let os = "Unknown";
  if (u.includes("windows")) os = "Windows";
  else if (u.includes("mac os") || u.includes("macos")) os = "macOS";
  else if (u.includes("ios") || (u.includes("iphone") || u.includes("ipad"))) os = "iOS";
  else if (u.includes("android")) os = "Android";
  else if (u.includes("linux")) os = "Linux";

  let device: "mobile" | "tablet" | "desktop" = "desktop";
  if (u.includes("ipad") || (u.includes("tablet") && !u.includes("ipad"))) device = "tablet";
  else if (u.includes("mobile") || u.includes("iphone") || u.includes("ipod") || u.includes("android.*mobile")) device = "mobile";

  return { browser, os, device };
}
