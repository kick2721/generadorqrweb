"use client";

import { useState, useCallback, useEffect, useRef, useMemo, type ReactNode } from "react";
import { useLang } from "@/context/LangContext";
import { contrastRatio } from "@/lib/color";
import { FRAMES } from "@/lib/frames";
import { loadTemplates, saveTemplate, deleteTemplate, type DesignTemplate } from "@/lib/templates";
import QRPreview from "./QRPreview";
import LocationPicker from "./LocationPicker";
import { Globe, Wifi, UserRound, Mail, FileText, Phone, MessageSquareText, MapPin, Calendar, Star, Lock, Shuffle, Image as ImageIcon } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane, FaAppStoreIos, FaGooglePlay } from "react-icons/fa";
import CountryCodeSelect from "./CountryCodeSelect";
import { COUNTRY_CODES } from "@/data/country-codes";

type QrType = "url" | "text" | "wifi" | "vcard" | "email" | "image" | "whatsapp" | "phone" | "sms" | "location" | "calendar" | "appstore" | "googleplay" | "telegram" | "google-review" | "password" | "multi-link";

interface QRFormInitialValues {
  type?: QrType;
  url?: string;
  text?: string;
  wifiSsid?: string;
  wifiPass?: string;
  wifiEnc?: "WPA" | "WEP" | "nopass";
  vcardName?: string;
  vcardPhone?: string;
  vcardEmail?: string;
  emailAddr?: string;
  emailSubject?: string;
  emailBody?: string;
  imageUploadedUrl?: string;
  whatsappPhone?: string;
  whatsappPrefix?: string;
  whatsappLocal?: string;
  whatsappMsg?: string;
  phoneNumber?: string;
  smsPhone?: string;
  smsMsg?: string;
  locationQuery?: string;
  calendarTitle?: string;
  calendarDate?: string;
  calendarLocation?: string;
  calendarDesc?: string;


  telegramUser?: string;
  telegramPrefix?: string;
  telegramLocal?: string;
  telegramMsg?: string;
  googlePlaceId?: string;
  passwordContent?: string;
  multiLinks?: { url: string; day?: string; hour?: string }[];
  passwordHint?: string;
  expiresAt?: string;

  fgColor?: string;
  bgColor?: string;
  size?: number;
  logo?: string | null;
  gradientType?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  dotsType?: string;
  cornersSquareType?: string;
  cornersDotType?: string;
  frame?: string;
}

export interface QRFormData {
  type: QrType;
  content: string;
  redirect_to: string;
  label: string;
  config: any;
  hasValues: boolean;
}

const PLACEHOLDER_PREFIX = "qrwing — ";

function parsePhonePrefix(full: string): { prefix: string; local: string } {
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
  for (const c of sorted) {
    const d = c.dial.replace("+", "");
    if (full.startsWith(d)) return { prefix: c.code, local: full.slice(d.length) };
  }
  return { prefix: "ES", local: full };
}

function parseTelegramPrefix(full: string): { prefix: string; local: string } {
  if (full.startsWith("+")) {
    const sorted = [...COUNTRY_CODES].sort((a, b) => b.dial.length - a.dial.length);
    for (const c of sorted) {
      if (full.startsWith(c.dial)) return { prefix: c.code, local: full.slice(c.dial.length) };
    }
    return { prefix: "__username__", local: full };
  }
  return { prefix: "__username__", local: full };
}

function hasValidDomain(str: string): boolean {
  const raw = str.replace(/^https?:\/\//i, "").split(/[/?#]/)[0];
  return raw === "localhost" || raw.includes(".");
}

function isRealContent(val: string, type?: QrType): boolean {
  if (val.length === 0) return false;
  if (val.startsWith(PLACEHOLDER_PREFIX)) return false;
  if (type === "url" || type === "appstore" || type === "googleplay") {
    try {
      new URL(val);
      if (!hasValidDomain(val)) return false;
    } catch { return false; }
  }
  return true;
}

interface Props {
  initialValues?: QRFormInitialValues;
  onChange?: (data: QRFormData) => void;
  onSubmit?: (data: QRFormData) => Promise<void>;
  submitLabel?: string;
  saving?: boolean;
  plan?: string;
  qrData?: QRFormData | null;
  isLogoBlocked?: boolean;
  withPro?: (cb: () => void) => void;
  withAuth?: (cb: () => void) => void;
  user?: { name?: string | null; email?: string | null; image?: string | null } | null;
}

const QR_TYPES: { value: QrType; key: any; icon: ReactNode }[] = [
  { value: "url", key: "qrTypeUrl", icon: <Globe size={18} /> },
  { value: "text", key: "qrTypeText", icon: <FileText size={18} /> },
  { value: "wifi", key: "qrTypeWifi", icon: <Wifi size={18} /> },
  { value: "vcard", key: "qrTypeVcard", icon: <UserRound size={18} /> },
  { value: "email", key: "qrTypeEmail", icon: <Mail size={18} /> },
  { value: "whatsapp", key: "qrTypeWhatsapp", icon: <FaWhatsapp size={18} /> },
  { value: "phone", key: "qrTypePhone", icon: <Phone size={18} /> },
  { value: "sms", key: "qrTypeSms", icon: <MessageSquareText size={18} /> },
  { value: "location", key: "qrTypeLocation", icon: <MapPin size={18} /> },
  { value: "calendar", key: "qrTypeCalendar", icon: <Calendar size={18} /> },
  { value: "appstore", key: "qrTypeAppstore", icon: <FaAppStoreIos size={18} /> },
  { value: "googleplay", key: "qrTypeGoogleplay", icon: <FaGooglePlay size={18} /> },
  { value: "telegram", key: "qrTypeTelegram", icon: <FaTelegramPlane size={18} /> },
  { value: "google-review", key: "qrTypeGoogleReview", icon: <Star size={18} /> },
  { value: "password", key: "qrTypePassword", icon: <Lock size={18} /> },
  { value: "multi-link", key: "qrTypeMultiLink", icon: <Shuffle size={18} /> },
  { value: "image", key: "qrTypeImage", icon: <ImageIcon size={18} /> },
];

export default function QRForm({ initialValues, onChange, onSubmit, submitLabel, saving, plan = "free", qrData, isLogoBlocked, withPro, withAuth, user }: Props) {
  const { t } = useLang();
  const [qrType, setQrType] = useState<QrType>(initialValues?.type || "url");
  const [url, setUrl] = useState(initialValues?.url || "");
  const [text, setText] = useState(initialValues?.text || "");
  const [wifiSsid, setWifiSsid] = useState(initialValues?.wifiSsid || "");
  const [wifiPass, setWifiPass] = useState(initialValues?.wifiPass || "");
  const [wifiEnc, setWifiEnc] = useState<"WPA" | "WEP" | "nopass">(initialValues?.wifiEnc || "WPA");
  const [vcardName, setVcardName] = useState(initialValues?.vcardName || "");
  const [vcardPhone, setVcardPhone] = useState(initialValues?.vcardPhone || "");
  const [vcardEmail, setVcardEmail] = useState(initialValues?.vcardEmail || "");

  const [emailAddr, setEmailAddr] = useState(initialValues?.emailAddr || "");
  const [emailSubject, setEmailSubject] = useState(initialValues?.emailSubject || "");
  const [emailBody, setEmailBody] = useState(initialValues?.emailBody || "");
  const [imageUploadedUrl, setImageUploadedUrl] = useState(initialValues?.imageUploadedUrl || "");
  const [imageUploading, setImageUploading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [whatsappPrefix, setWhatsappPrefix] = useState(initialValues?.whatsappPrefix || "");
  const [whatsappLocal, setWhatsappLocal] = useState(initialValues?.whatsappLocal || "");
  const [whatsappMsg, setWhatsappMsg] = useState(initialValues?.whatsappMsg || "");
  const [phoneNumber, setPhoneNumber] = useState(initialValues?.phoneNumber || "");
  const [smsPhone, setSmsPhone] = useState(initialValues?.smsPhone || "");
  const [smsMsg, setSmsMsg] = useState(initialValues?.smsMsg || "");
  const [locationQuery, setLocationQuery] = useState(initialValues?.locationQuery || "");
  const [calendarTitle, setCalendarTitle] = useState(initialValues?.calendarTitle || "");
  const [calendarDate, setCalendarDate] = useState(initialValues?.calendarDate || "");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [calendarLocation, setCalendarLocation] = useState(initialValues?.calendarLocation || "");
  const [calendarDesc, setCalendarDesc] = useState(initialValues?.calendarDesc || "");


  const [telegramPrefix, setTelegramPrefix] = useState(initialValues?.telegramPrefix || (initialValues?.telegramUser?.startsWith("+") ? "ES" : "__username__"));
  const [telegramLocal, setTelegramLocal] = useState(initialValues?.telegramLocal || "");
  const [telegramMsg, setTelegramMsg] = useState(initialValues?.telegramMsg || "");
  const [fgColor, setFgColor] = useState(initialValues?.fgColor || "#000000");
  const [bgColor, setBgColor] = useState(initialValues?.bgColor || "#ffffff");
  const [size, setSize] = useState(initialValues?.size || 256);
  const [logo, setLogo] = useState<string | null>(initialValues?.logo || null);
  const [gradientType, setGradientType] = useState<string>(initialValues?.gradientType || "");
  const [gradientColor1, setGradientColor1] = useState(initialValues?.gradientColor1 || "#667eea");
  const [gradientColor2, setGradientColor2] = useState(initialValues?.gradientColor2 || "#764ba2");
  const [dotsType, setDotsType] = useState(initialValues?.dotsType || "square");
  const [cornersSquareType, setCornersSquareType] = useState(initialValues?.cornersSquareType || "square");
  const [cornersDotType, setCornersDotType] = useState(initialValues?.cornersDotType || "square");
  const [googlePlaceId, setGooglePlaceId] = useState(initialValues?.googlePlaceId || "");
  const [mapsUrl, setMapsUrl] = useState("");
  const [placeIdExtracted, setPlaceIdExtracted] = useState(!!initialValues?.googlePlaceId);
  const [resolvingPlaceId, setResolvingPlaceId] = useState(false);
  const [passwordContent, setPasswordContent] = useState(initialValues?.passwordContent || "");
  const [passwordHint, setPasswordHint] = useState(initialValues?.passwordHint || "");
  const [multiLinks, setMultiLinks] = useState<{ url: string; day?: string; hour?: string }[]>(initialValues?.multiLinks || [{ url: "" }]);
  const [expiresAt, setExpiresAt] = useState(initialValues?.expiresAt || "");
  const [frame, setFrame] = useState(initialValues?.frame || "none");
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [templateName, setTemplateName] = useState("");
  const [validationError, setValidationError] = useState("");
  const [urlError, setUrlError] = useState("");

  const isValidUrl = (str: string): boolean => {
    if (!str) return false;
    try {
      new URL(str);
      return hasValidDomain(str);
    }
    catch { return false; }
  };

  const ensureProtocol = (val: string): string => {
    if (!val) return val;
    if (!/^https?:\/\//i.test(val)) return "https://" + val;
    return val;
  };

  const handleUrlBlur = () => {
    const fixed = ensureProtocol(url);
    if (fixed !== url) setUrl(fixed);
    if (!fixed) { setUrlError(""); return; }
    if (!isValidUrl(fixed)) setUrlError(t("invalidUrl"));
    else setUrlError("");
  };

  function extractPlaceId(url: string): string | null {
    const m = url.match(/!1s([a-zA-Z0-9:_]+)/);
    if (m) return m[1];
    const m2 = url.match(/0x[a-fA-F0-9]+:0x[a-fA-F0-9]+/);
    if (m2) return m2[0];
    return null;
  }

  const handleMapsUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMapsUrl(val);
    const placeId = extractPlaceId(val);
    if (placeId) {
      setGooglePlaceId(placeId);
      setPlaceIdExtracted(true);
      setResolvingPlaceId(false);
    } else if (!val && initialValues?.googlePlaceId) {
      setGooglePlaceId(initialValues.googlePlaceId);
      setPlaceIdExtracted(true);
      setResolvingPlaceId(false);
    } else {
      setPlaceIdExtracted(false);
      setGooglePlaceId("");
    }
  };

  const resolveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolveAbort = useRef<AbortController | null>(null);
  useEffect(() => {
    if (resolveTimer.current) clearTimeout(resolveTimer.current);
    if (resolveAbort.current) resolveAbort.current.abort();
    if (!mapsUrl || placeIdExtracted || !/goo\.gl|maps\.app\.goo\.gl/i.test(mapsUrl)) {
      setResolvingPlaceId(false);
      return;
    }
    setResolvingPlaceId(true);
    resolveTimer.current = setTimeout(async () => {
      const ac = new AbortController();
      resolveAbort.current = ac;
      try {
        const r = await fetch("/api/place-lookup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: mapsUrl }),
          signal: ac.signal,
        });
        if (ac.signal.aborted) return;
        const data = await r.json();
        if (data.placeId) {
          setGooglePlaceId(data.placeId);
          setPlaceIdExtracted(true);
        }
      } catch {} finally {
        if (!ac.signal.aborted) setResolvingPlaceId(false);
      }
    }, 400);
  }, [mapsUrl, placeIdExtracted]);

  useEffect(() => { setTemplates(loadTemplates()); }, []);

  const applyTemplate = (t: DesignTemplate) => {
    setFgColor(t.fgColor); setBgColor(t.bgColor);
    setDotsType(t.dotsType); setCornersSquareType(t.cornersSquareType); setCornersDotType(t.cornersDotType);
    setGradientType(t.gradientType); setGradientColor1(t.gradientColor1); setGradientColor2(t.gradientColor2);
    setFrame(t.frame);
  };

  useEffect(() => {
    if (!initialValues) return;
    if (initialValues.type) setQrType(initialValues.type);
    if (initialValues.url !== undefined) setUrl(initialValues.url);
    if (initialValues.text !== undefined) setText(initialValues.text);
    if (initialValues.wifiSsid !== undefined) setWifiSsid(initialValues.wifiSsid);
    if (initialValues.wifiPass !== undefined) setWifiPass(initialValues.wifiPass);
    if (initialValues.wifiEnc) setWifiEnc(initialValues.wifiEnc);
    if (initialValues.vcardName !== undefined) setVcardName(initialValues.vcardName);
    if (initialValues.vcardPhone !== undefined) setVcardPhone(initialValues.vcardPhone);
    if (initialValues.vcardEmail !== undefined) setVcardEmail(initialValues.vcardEmail);

    if (initialValues.emailAddr !== undefined) setEmailAddr(initialValues.emailAddr);
    if (initialValues.emailSubject !== undefined) setEmailSubject(initialValues.emailSubject);
    if (initialValues.emailBody !== undefined) setEmailBody(initialValues.emailBody);
    if (initialValues.whatsappPrefix !== undefined) {
      setWhatsappPrefix(initialValues.whatsappPrefix);
    } else if (initialValues.whatsappPhone) {
      const parsed = parsePhonePrefix(initialValues.whatsappPhone);
      setWhatsappPrefix(parsed.prefix);
      setWhatsappLocal(parsed.local);
    }
    if (initialValues.whatsappLocal !== undefined) setWhatsappLocal(initialValues.whatsappLocal);
    if (initialValues.whatsappMsg !== undefined) setWhatsappMsg(initialValues.whatsappMsg);
    if (initialValues.phoneNumber !== undefined) setPhoneNumber(initialValues.phoneNumber);
    if (initialValues.smsPhone !== undefined) setSmsPhone(initialValues.smsPhone);
    if (initialValues.smsMsg !== undefined) setSmsMsg(initialValues.smsMsg);
    if (initialValues.locationQuery !== undefined) setLocationQuery(initialValues.locationQuery);
    if (initialValues.calendarTitle !== undefined) setCalendarTitle(initialValues.calendarTitle);
    if (initialValues.calendarDate !== undefined) setCalendarDate(initialValues.calendarDate);
    if (initialValues.calendarLocation !== undefined) setCalendarLocation(initialValues.calendarLocation);
    if (initialValues.calendarDesc !== undefined) setCalendarDesc(initialValues.calendarDesc);


    if (initialValues.telegramPrefix !== undefined) {
      setTelegramPrefix(initialValues.telegramPrefix);
    } else if (initialValues.telegramUser) {
      const parsed = parseTelegramPrefix(initialValues.telegramUser);
      setTelegramPrefix(parsed.prefix);
      setTelegramLocal(parsed.local);
    }
    if (initialValues.telegramLocal !== undefined) setTelegramLocal(initialValues.telegramLocal);
    if (initialValues.telegramMsg !== undefined) setTelegramMsg(initialValues.telegramMsg);
    if (initialValues.fgColor) setFgColor(initialValues.fgColor);
    if (initialValues.bgColor) setBgColor(initialValues.bgColor);
    if (initialValues.size) setSize(initialValues.size);
    if (initialValues.logo !== undefined) setLogo(initialValues.logo);
    if (initialValues.gradientType !== undefined) setGradientType(initialValues.gradientType);
    if (initialValues.gradientColor1 !== undefined) setGradientColor1(initialValues.gradientColor1);
    if (initialValues.gradientColor2 !== undefined) setGradientColor2(initialValues.gradientColor2);
    if (initialValues.dotsType !== undefined) setDotsType(initialValues.dotsType);
    if (initialValues.cornersSquareType !== undefined) setCornersSquareType(initialValues.cornersSquareType);
    if (initialValues.cornersDotType !== undefined) setCornersDotType(initialValues.cornersDotType);
    if (initialValues.frame !== undefined) setFrame(initialValues.frame);
  }, [initialValues]);

  const [nowDate, nowTime] = useMemo(() => {
    const n = new Date();
    return [n.toISOString().split("T")[0], `${String(n.getHours()).padStart(2, "0")}:${String(n.getMinutes()).padStart(2, "0")}`];
  }, []);

  const qrValue = useCallback(() => {
    switch (qrType) {
      case "url":
      case "appstore":
      case "googleplay": return url || "qrwing — URL";
      case "text": return text || "qrwing — Texto";
      case "wifi": return wifiPass ? `WIFI:T:${wifiEnc};S:${wifiSsid};P:${wifiPass};;` : `WIFI:T:nopass;S:${wifiSsid};;`;
      case "vcard": return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`;
      case "email": return `https://generadorqrweb.vercel.app/mail?to=${encodeURIComponent(emailAddr)}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case "image": return imageUploadedUrl || "qrwing — Imagen";
      case "whatsapp": {
        const waDial = COUNTRY_CODES.find(c => c.code === whatsappPrefix)?.dial.replace("+", "") || "";
        const waFull = waDial + whatsappLocal;
        return `https://wa.me/${waFull.replace(/[^0-9]/g, "")}${whatsappMsg ? "?text=" + encodeURIComponent(whatsappMsg) : ""}`;
      }
      case "phone": return `tel:${phoneNumber}`;
      case "sms": return `smsto:${smsPhone}:${smsMsg}`;
      case "location": return `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}`;
      case "calendar": return `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${calendarTitle}\nDTSTART:${calendarDate ? calendarDate.replace(/[\s:-]/g, "").padEnd(15, "0") : ""}\nLOCATION:${calendarLocation}\nDESCRIPTION:${calendarDesc}\nEND:VEVENT\nEND:VCALENDAR`;

      case "google-review": {
        if (!googlePlaceId) return "qrwing — Reseña Google";
        if (googlePlaceId.startsWith("ChIJ")) {
          return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(googlePlaceId)}`;
        }
        const [high, low] = googlePlaceId.split(":");
        return `https://www.google.com/maps/place//data=!4m3!3m2!1s${high}:${low}!12e1?source=g.page.m.dd._&laa=lu-desktop-reviews-dialog-review-solicitation`;
      }
      case "password": return passwordContent || "qrwing — Contenido protegido";
      case "multi-link": return multiLinks.map(m => m.url).filter(Boolean).join(",") || "qrwing — Múltiples enlaces";
      case "telegram": {
        if (telegramPrefix === "__username__") {
          return `https://t.me/${telegramLocal.replace(/^@/, "")}${telegramMsg ? "?text=" + encodeURIComponent(telegramMsg) : ""}`;
        }
        const tgDial = COUNTRY_CODES.find(c => c.code === telegramPrefix)?.dial || "";
        return `https://t.me/${tgDial}${telegramLocal}${telegramMsg ? "?text=" + encodeURIComponent(telegramMsg) : ""}`;
      }
      default: return "";
    }
  }, [qrType, url, text, wifiSsid, wifiPass, wifiEnc, vcardName, vcardPhone, vcardEmail, emailAddr, emailSubject, emailBody, imageUploadedUrl, whatsappPrefix, whatsappLocal, whatsappMsg, phoneNumber, smsPhone, smsMsg, locationQuery, calendarTitle, calendarDate, calendarLocation, calendarDesc, telegramPrefix, telegramLocal, telegramMsg, googlePlaceId, passwordContent, multiLinks]);

  const getData = useCallback((): QRFormData => {
    const val = qrValue();
    return {
      type: qrType,
      content: val,
      redirect_to: val,
      label: qrType === "vcard" ? (val.match(/FN:(.+)/)?.[1]?.trim() || val.slice(0, 60)) : val.slice(0, 60),
      config: { fgColor, bgColor, size, logo, gradientType, gradientColor1, gradientColor2, dotsType, cornersSquareType, cornersDotType, frame, passwordHint, expiresAt, multiLinks: (qrType === "multi-link" ? multiLinks : undefined), googlePlaceId },
      hasValues: val.length > 0,
    };
  }, [qrValue, qrType, fgColor, bgColor, size, logo, gradientType, gradientColor1, gradientColor2, dotsType, cornersSquareType, cornersDotType, frame, passwordHint, expiresAt, multiLinks]);

  useEffect(() => {
    setValidationError("");
    if (onChange) onChange(getData());
  }, [getData, onChange]);

  const isDownloadable = (() => {
    const val = qrValue();
    if (!val || val.startsWith(PLACEHOLDER_PREFIX)) return false;
    if (qrType === "url" || qrType === "appstore" || qrType === "googleplay") {
      try {
        new URL(val);
        if (!hasValidDomain(val)) return false;
      } catch { return false; }
    }
    return true;
  })();

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        let { width, height } = img;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((b) => { if (b) resolve(b); else reject(new Error("Compression failed")); }, "image/jpeg", 0.8);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    setImageError("");
    setImageUploadedUrl("");
    try {
      const compressed = await compressImage(file);
      const form = new FormData();
      form.append("file", compressed, "qr-image.jpg");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const data = await res.json();
      if (!data.url) throw new Error("No URL returned");
      setImageUploadedUrl(data.url);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : t("imageUploadError"));
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {QR_TYPES.map((qt) => (
          <button key={qt.value} onClick={() => setQrType(qt.value)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition duration-75 active:scale-[0.93] ${qrType === qt.value ? "bg-purple-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"}`}>
            {qt.icon} {t(qt.key)}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-400 -mt-2">{t(`type${qrType.charAt(0).toUpperCase() + qrType.slice(1)}Desc` as any)}</p>

      <div className="md:hidden flex justify-center" key={qrData?.type || "empty"}><QRPreview qrData={qrData} isLogoBlocked={isLogoBlocked ?? false} withPro={withPro ?? (() => {})} withAuth={withAuth ?? (() => {})} isDownloadable={isDownloadable} /></div>

      {(qrType === "url" || qrType === "appstore" || qrType === "googleplay") && (
        <div>
          <input type="text" inputMode="url" placeholder={qrType === "appstore" ? t("placeAppstoreIos") : qrType === "googleplay" ? t("placeGoogleplayAndroid") : t("placeUrl")} value={url} onChange={(e) => { setUrl(e.target.value); setUrlError(""); }} onBlur={handleUrlBlur}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          {urlError && <p className="text-xs text-red-500 mt-1.5">{urlError}</p>}
        </div>
      )}

      {qrType === "text" && (
        <textarea placeholder={t("placeText")} value={text} onChange={(e) => setText(e.target.value)} rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
      )}

      {qrType === "wifi" && (
        <div className="space-y-3">
          <input type="text" placeholder={t("placeWifiSsid")} value={wifiSsid} onChange={(e) => setWifiSsid(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeWifiPass")} value={wifiPass} onChange={(e) => setWifiPass(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <div>
            <select value={wifiEnc} onChange={(e) => setWifiEnc(e.target.value as typeof wifiEnc)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none">
              <option value="WPA">{t("wifiWpa")}</option>
              <option value="WEP">{t("wifiWep")}</option>
              <option value="nopass">{t("wifiNone")}</option>
            </select>
            <p className="text-xs text-gray-400 mt-1.5">{t("wifiHelp")}</p>
          </div>
        </div>
      )}

      {qrType === "vcard" && (
        <div className="space-y-3">
          <input type="text" placeholder={t("placeVcardName")} value={vcardName} onChange={(e) => setVcardName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="tel" placeholder={t("placeVcardPhone")} value={vcardPhone} onChange={(e) => setVcardPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="email" placeholder={t("placeVcardEmail")} value={vcardEmail} onChange={(e) => setVcardEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>
      )}



      {qrType === "email" && (
        <div className="space-y-3">
          <input type="email" placeholder={t("placeEmailAddr")} value={emailAddr} onChange={(e) => setEmailAddr(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <input type="text" placeholder={t("placeEmailSubj")} value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <textarea placeholder={t("placeEmailBody")} value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
        </div>
      )}

      {qrType === "image" && (
        <div className="space-y-3">
          {plan === "pro" ? (
            <>
              {imageUploadedUrl ? (
                <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-green-300 dark:border-green-700 rounded-xl bg-white dark:bg-gray-800">
                  <img src={imageUploadedUrl} alt="Uploaded preview" className="h-24 w-auto rounded-lg object-contain" />
                  <span className="text-xs text-green-600 font-medium mt-1">{t("imageUploaded")}</span>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-purple-400 transition-colors bg-white dark:bg-gray-800">
                  {imageUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm text-gray-500">{t("uploading")}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">{t("placeImageUrl")}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
              {imageError && <p className="text-xs text-red-500">{imageError}</p>}
              {imageUploadedUrl && (
                <button onClick={() => { setImageUploadedUrl(""); setImageError(""); }} className="text-xs text-red-500 hover:text-red-600">
                  {t("removeImage")}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <span className="text-2xl">🔒</span>
              <p className="text-sm text-gray-500 mt-2 mb-3">{t("imageTrialDesc")}</p>
              <a href="/pricing" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">{t("viewPlans")}</a>
            </div>
          )}
        </div>
      )}

      {qrType === "whatsapp" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <CountryCodeSelect value={whatsappPrefix} onChange={setWhatsappPrefix} />
            <input type="tel" placeholder="612345678" value={whatsappLocal} onChange={(e) => setWhatsappLocal(e.target.value.replace(/[^0-9]/g, ""))}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          </div>
          <input type="text" placeholder={t("placeWhatsappMsg")} value={whatsappMsg} onChange={(e) => setWhatsappMsg(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>
      )}

      {qrType === "phone" && (
        <input type="tel" placeholder={t("placePhone")} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
      )}

      {qrType === "sms" && (
        <div className="space-y-3">
          <input type="tel" placeholder={t("placeSmsPhone")} value={smsPhone} onChange={(e) => setSmsPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <textarea placeholder={t("placeSmsMsg")} value={smsMsg} onChange={(e) => setSmsMsg(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
        </div>
      )}

      {qrType === "location" && (
        <div className="space-y-3">
          {plan === "pro" ? (
            <LocationPicker value={locationQuery} onChange={(v) => setLocationQuery(v)} />
          ) : (
            <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <span className="text-2xl">🔒</span>
              <p className="text-sm text-gray-500 mt-2 mb-3">{t("locTrialDesc")}</p>
              <a href="/pricing" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">{t("viewPlans")}</a>
            </div>
          )}
        </div>
      )}

      {qrType === "calendar" && (
        <div className="space-y-3">
          <input type="text" placeholder={t("placeCalendarTitle")} value={calendarTitle} onChange={(e) => setCalendarTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
          <label className="text-xs text-gray-500">{t("placeCalendarDate")}</label>
          <div className="space-y-2">
            <div className="relative">
            <div onClick={() => dateInputRef.current?.showPicker()}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer">
              {calendarDate.split(" ")[0] || t("placeCalendarDate")}
            </div>
            <input type="date" ref={dateInputRef} min={nowDate} value={calendarDate.split(" ")[0] || ""} onChange={(e) => {
              const time = calendarDate.split(" ")[1] || "";
              setCalendarDate(e.target.value ? `${e.target.value} ${time}` : "");
            }} className="absolute inset-0 w-full h-full opacity-0 pointer-events-none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, pointerEvents: "none" }} />
            {(() => {
              const timeParts = (calendarDate.split(" ")[1] || "00:00").split(":");
              const calH = timeParts[0], calM = timeParts[1];
              const dateOnly = calendarDate.split(" ")[0] || "";
              const hasTime = !!calendarDate.split(" ")[1];
              const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
              const mins = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));
              const sel = "bg-purple-600 text-white border-purple-600";
              const unsel = "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700";
              return (
                <div>
                  <button type="button" onClick={() => setShowTimePicker(!showTimePicker)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span>🕐</span>
                    <span className="flex-1 text-left">{hasTime ? `${calH}:${calM}` : (t("placeCalendarTime") || "Seleccionar hora")}</span>
                    <svg className={`w-4 h-4 transition-transform ${showTimePicker ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showTimePicker && (
                    <div className="mt-2 p-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 space-y-2">
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500 w-8">Hora</span>
                        <div className="grid grid-cols-7 gap-1 flex-1">
                          {hours.map(h => (
                            <button key={h} type="button" onClick={() => setCalendarDate(dateOnly ? `${dateOnly} ${h}:${calM}` : "")}
                              className={`px-1.5 py-1 text-xs rounded-lg border transition-colors ${h === calH ? sel : unsel}`}>{h}</button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs text-gray-500 w-8">Min</span>
                        <div className="grid grid-cols-7 gap-1 flex-1">
                          {mins.map(m => (
                            <button key={m} type="button" onClick={() => {
                              setCalendarDate(dateOnly ? `${dateOnly} ${calH}:${m}` : "");
                              setShowTimePicker(false);
                            }}
                              className={`px-1.5 py-1 text-xs rounded-lg border transition-colors ${m === calM ? sel : unsel}`}>{m}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
            </div>
          </div>
          {plan === "pro" ? (
            <LocationPicker value={calendarLocation} onChange={(v) => setCalendarLocation(v)} />
          ) : (
            <div className="text-center py-6 px-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <span className="text-2xl">🔒</span>
              <p className="text-sm text-gray-500 mt-2 mb-3">{t("calLocProDesc")}</p>
              <a href="/pricing" className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">{t("viewPlans")}</a>
            </div>
          )}
          <textarea placeholder={t("placeCalendarDesc")} value={calendarDesc} onChange={(e) => setCalendarDesc(e.target.value)} rows={2}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
        </div>
      )}


      {qrType === "telegram" && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <CountryCodeSelect value={telegramPrefix} onChange={setTelegramPrefix} includeUsername />
            {telegramPrefix === "__username__" ? (
              <input type="text" placeholder="@username" value={telegramLocal} onChange={(e) => setTelegramLocal(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            ) : (
              <input type="tel" placeholder="612345678" value={telegramLocal} onChange={(e) => setTelegramLocal(e.target.value.replace(/[^0-9]/g, ""))}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            )}
          </div>
          <input type="text" placeholder={t("placeTelegramMsg")} value={telegramMsg} onChange={(e) => setTelegramMsg(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>
      )}

      {qrType === "google-review" && (
        <div className="space-y-3">
          <div className="relative">
            <input type="text" value={mapsUrl} onChange={handleMapsUrlChange}
              placeholder={googlePlaceId ? "Pegá un nuevo link para cambiar el negocio" : "Pegá el link de tu negocio en Google Maps"}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
            {resolvingPlaceId && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 animate-spin">⟳</span>
            )}
            {!resolvingPlaceId && mapsUrl && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-lg">{placeIdExtracted ? "✓" : "✗"}</span>
            )}
          </div>
          {resolvingPlaceId && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span className="animate-spin inline-block">⟳</span> Resolviendo link...
            </p>
          )}
          {googlePlaceId && !resolvingPlaceId && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400 px-3 py-2 rounded-xl">
              <span>✓</span>
              <span>Negocio identificado. Al escanear el QR se abrirá el formulario de reseña de Google.</span>
            </div>
          )}
          {mapsUrl && !placeIdExtracted && !resolvingPlaceId && (
            <p className="text-xs text-red-500">No se pudo encontrar el Place ID. Probá pegando la URL de la barra del navegador, o usá el método manual abajo.</p>
          )}
          <details className="text-sm group">
            <summary className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium list-none flex items-center gap-1">
              <span className="inline-block transition-transform group-open:rotate-90">▶</span>
              📖 ¿Cómo obtener el link?
            </summary>
            <div className="mt-2 space-y-1.5 pl-4 text-gray-500">
              <p><strong>Opción 1 (recomendada):</strong></p>
              <p>1. Abrí Google Maps en tu <strong>navegador</strong> (chrome/safari)</p>
              <p>2. Buscá tu negocio</p>
              <p>3. Copiá la URL de la <strong>barra del navegador</strong></p>
              <p className="mt-2"><strong>Opción 2 (app):</strong></p>
              <p>1. Abrí la app de Google Maps</p>
              <p>2. Buscá tu negocio</p>
              <p>3. Tocá <strong>"Compartir"</strong> → <strong>"Copiar link"</strong></p>
              <p>4. Pegalo acá arriba (tarda unos segundos en procesarse)</p>
            </div>
          </details>
          {!placeIdExtracted && !resolvingPlaceId && (
            <details className="text-sm group">
              <summary className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium list-none flex items-center gap-1">
                <span className="inline-block transition-transform group-open:rotate-90">▶</span>
                O ingresá el código manualmente
              </summary>
              <div className="mt-2 space-y-2 pl-4">
                <input type="text" placeholder="Place ID (ej. ChIJ...)" value={googlePlaceId} onChange={e => { setGooglePlaceId(e.target.value); if (e.target.value) setPlaceIdExtracted(true); else setPlaceIdExtracted(false); }}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
                <a href="https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline text-xs">Buscar Place ID en Google</a>
              </div>
            </details>
          )}
        </div>
      )}

      {qrType === "password" && (
        <div className="space-y-3">
          <textarea placeholder="Contenido protegido (texto o URL)" value={passwordContent} onChange={(e) => setPasswordContent(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none resize-none" />
          <input type="text" placeholder="Pista opcional para la contraseña" value={passwordHint} onChange={(e) => setPasswordHint(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none" />
        </div>
      )}

      {qrType === "multi-link" && (
        <div className="space-y-2">
          {multiLinks.map((ml, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1 space-y-1.5">
                <input type="url" placeholder={`URL ${i + 1}`} value={ml.url} onChange={(e) => {
                  const copy = [...multiLinks];
                  copy[i] = { ...copy[i], url: e.target.value };
                  setMultiLinks(copy);
                }} className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none text-sm" />
                <div className="flex gap-2">
                  <select value={ml.day || ""} onChange={(e) => {
                    const copy = [...multiLinks];
                    copy[i] = { ...copy[i], day: e.target.value };
                    setMultiLinks(copy);
                  }} className="flex-1 px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs">
                    <option value="">Todos los días</option>
                    {["lunes","martes","miércoles","jueves","viernes","sábado","domingo"].map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase()+d.slice(1)}</option>)}
                  </select>
                  <input type="time" value={ml.hour || ""} onChange={(e) => {
                    const copy = [...multiLinks];
                    copy[i] = { ...copy[i], hour: e.target.value };
                    setMultiLinks(copy);
                  }} className="px-2 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs w-28" />
                </div>
              </div>
              {multiLinks.length > 1 && (
                <button onClick={() => setMultiLinks(prev => prev.filter((_, j) => j !== i))} className="mt-2 text-red-400 hover:text-red-600 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
            </div>
          ))}
          <button onClick={() => setMultiLinks(prev => [...prev, { url: "" }])} className="text-xs text-purple-600 hover:text-purple-700 font-medium">+ Añadir otra URL</button>
        </div>
      )}

      <details open className="text-sm">
        <summary className="cursor-pointer text-gray-500 hover:text-purple-600 font-medium">{t("customize")}</summary>
        <div className="mt-3 flex items-end gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("colorQr")}</label>
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("colorBg")}</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("logo")} {plan !== "pro" && <span className="text-purple-500 font-medium">Pro</span>}</label>
            <p className="text-[10px] text-gray-400 mb-1 leading-tight">{t("logoHelp")}</p>
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-600 dark:text-gray-300 rounded-lg cursor-pointer text-xs font-medium transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {t("selectImage")}
              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => setLogo(ev.target?.result as string); reader.readAsDataURL(file); }}} className="hidden" />
            </label>
            {logo && <button onClick={() => setLogo(null)} className="block text-xs text-red-500 mt-1">{t("removeLogo")}</button>}
            {logo && plan !== "pro" && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">🔒 {t("logoProOnly")}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("gradient")}</label>
            <select value={gradientType} onChange={(e) => setGradientType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-24">
              <option value="">—</option>
              <option value="linear">{t("gradientLinear")}</option>
              <option value="radial">{t("gradientRadial")}</option>
            </select>
          </div>
          {gradientType && (
            <>
              <div>
                <label className="block text-xs text-gray-500 mb-1">#1</label>
                <input type="color" value={gradientColor1} onChange={(e) => setGradientColor1(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">#2</label>
                <input type="color" value={gradientColor2} onChange={(e) => setGradientColor2(e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
              </div>
            </>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("dotStyle")}</label>
            <select value={dotsType} onChange={(e) => setDotsType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-28">
              <option value="square">{t("dotSquare")}</option>
              <option value="dots">{t("dotDots")}</option>
              <option value="rounded">{t("dotRounded")}</option>
              <option value="extra-rounded">{t("dotExtraRounded")}</option>
              <option value="classy">{t("dotClassy")}</option>
              <option value="classy-rounded">{t("dotClassyRounded")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("cornerSquareStyle")}</label>
            <select value={cornersSquareType} onChange={(e) => setCornersSquareType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-28">
              <option value="square">{t("dotSquare")}</option>
              <option value="dot">{t("cornerDot")}</option>
              <option value="extra-rounded">{t("dotExtraRounded")}</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t("cornerDotStyle")}</label>
            <select value={cornersDotType} onChange={(e) => setCornersDotType(e.target.value)}
              className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-28">
              <option value="square">{t("dotSquare")}</option>
              <option value="dot">{t("cornerDot")}</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-1">Marco decorativo</label>
          <select value={frame} onChange={(e) => setFrame(e.target.value)}
            className="px-2 py-1.5 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs w-32">
            {FRAMES.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>

        {user ? (
          <>
            <div className="mt-4">
              <label className="block text-xs text-gray-500 mb-1">Expira el</label>
              <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none focus:border-purple-500 max-w-48" />
              <p className="text-[10px] text-gray-400 mt-1">En blanco = nunca expira</p>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="block text-xs text-gray-500 mb-2">Plantillas de diseño</label>
              <div className="flex gap-2 mb-3">
                <input type="text" value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="Nombre de la plantilla" maxLength={30}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs outline-none focus:border-purple-500" />
                <button onClick={() => {
                  const n = templateName.trim();
                  if (!n) return;
                  setTemplates(saveTemplate({ name: n, fgColor, bgColor, dotsType, cornersSquareType, cornersDotType, gradientType, gradientColor1, gradientColor2, frame }));
                  setTemplateName("");
                }} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition">Guardar</button>
              </div>
              {templates.length === 0 && <p className="text-[10px] text-gray-400">No hay plantillas guardadas.</p>}
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {templates.map(t => (
                  <div key={t.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-2.5 py-1.5">
                    <span className="flex-1 text-xs truncate">{t.name}</span>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => applyTemplate(t)} className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium hover:bg-purple-200 dark:hover:bg-purple-800 transition">Cargar</button>
                      <button onClick={() => setTemplates(deleteTemplate(t.id))} className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-center">
            <p className="text-xs text-gray-500"><a href="/auth/signin" className="text-purple-500 hover:underline font-medium">Inicia sesión</a> para usar fechas de expiración y plantillas de diseño</p>
          </div>
        )}

        {(() => {
          const ratio = contrastRatio(fgColor, bgColor);
          if (ratio >= 3) return null;
          return (
            <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">⚠️ {t("lowContrast").replace("{n}", ratio.toFixed(1))}</p>
          );
        })()}
      </details>

      <div className="flex gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">{t("size")}</span>
          <select value={size} onChange={(e) => setSize(Number(e.target.value))}
            className="px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm">
            <option value={128}>{t("sizeSmall")}</option>
            <option value={256}>{t("sizeMed")}</option>
            <option value={384}>{t("sizeLarge")}</option>
          </select>
        </label>
      </div>

      {onSubmit && (
        <div className="md:hidden">
          <button onClick={() => {
            const data = getData();
            if (!isRealContent(data.content, qrType)) {
              setValidationError(t("saveEmpty"));
              return;
            }
            setValidationError("");
            onSubmit(data);
          }} disabled={saving || !isRealContent(qrValue(), qrType)}
            className="w-full px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition duration-75 active:scale-[0.95] disabled:opacity-50 disabled:active:scale-100">
            {saving ? t("saving") : submitLabel || t("save")}
          </button>
          {validationError && <p className="text-xs text-red-500 mt-2 text-center">{validationError}</p>}
        </div>
      )}
    </div>
  );
}
