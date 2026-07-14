"use client";

import QRGenerator from "@/components/QRGenerator";
import { useLang } from "@/context/LangContext";
import Link from "next/link";
import { Globe, Wifi, UserRound, Mail, FileText, Phone, MessageSquareText, MapPin, Calendar, Star, Lock, Shuffle, Palette, RefreshCw, BarChart3, Bot, Grid3X3, Code, GitBranch, Folder, Clock, Files, Download, Smartphone, UtensilsCrossed, Megaphone, PartyPopper, Hotel, GraduationCap, Briefcase } from "lucide-react";
import { FaWhatsapp, FaYoutube, FaTelegramPlane, FaAppStoreIos, FaInstagram } from "react-icons/fa";

const FEATURES = [
  { icon: <Palette size={24} />, title: "Diseño completo", desc: "Colores, degradados, 6 estilos de puntos, esquinas, logo y marcos decorativos." },
  { icon: <RefreshCw size={24} />, title: "QR dinámicos", desc: "Modifica el destino sin reimprimir. Estadísticas de escaneo en vivo." },
  { icon: <BarChart3 size={24} />, title: "Analíticas", desc: "Timeline, países, dispositivos, actividad. Sabes cuándo y dónde escanean." },
  { icon: <Bot size={24} />, title: "AI Chat", desc: "Cada QR dinámico tiene un asistente que responde preguntas sobre su contenido." },
  { icon: <Grid3X3 size={24} />, title: "QR por lote", desc: "Sube un CSV y genera cientos de QR a la vez. Descarga todo en ZIP." },
  { icon: <Code size={24} />, title: "API pública", desc: "POST /api/v1/generate — integra generación de QR en tus propios sistemas." },
  { icon: <Lock size={24} />, title: "Protegido", desc: "QR con contraseña. Solo quien tiene la clave accede al contenido." },
  { icon: <GitBranch size={24} />, title: "Multi-enlace", desc: "Un QR que redirige a diferentes URLs según el día y la hora." },
  { icon: <Folder size={24} />, title: "Carpetas", desc: "Organiza tus QR en carpetas desde el panel de control." },
  { icon: <Clock size={24} />, title: "Programado", desc: "Fecha de expiración. El QR deja de funcionar automáticamente." },
  { icon: <Star size={24} />, title: "Google Review", desc: "QR que lleva directo al formulario de reseña de tu negocio en Google." },
  { icon: <Files size={24} />, title: "Plantillas", desc: "Guarda y carga diseños. No vuelvas a configurar colores desde cero." },
  { icon: <Download size={24} />, title: "Descarga PNG, SVG, JPG", desc: "Alta resolución para digital o vectorial para impresión profesional." },
  { icon: <Smartphone size={24} />, title: "17 tipos QR", desc: "URL, WiFi, vCard, WhatsApp, email, SMS, teléfono, ubicación, calendario, YouTube y más." },
  { icon: <Globe size={24} />, title: "23 idiomas", desc: "Interfaz traducida a 23 idiomas. Alcance global desde el primer día." },
];

const TYPES = [
  { icon: <Globe size={24} />, label: "URL / Web", href: "/qr-url" },
  { icon: <Wifi size={24} />, label: "WiFi", href: "/qr-wifi" },
  { icon: <UserRound size={24} />, label: "vCard / Contacto", href: "/qr-vcard" },
  { icon: <FaWhatsapp size={24} />, label: "WhatsApp", href: "/qr-whatsapp" },
  { icon: <Mail size={24} />, label: "Email", href: "#" },
  { icon: <FileText size={24} />, label: "Texto", href: "/qr-text" },
  { icon: <Phone size={24} />, label: "Teléfono", href: "/qr-phone" },
  { icon: <MessageSquareText size={24} />, label: "SMS", href: "/qr-sms" },
  { icon: <MapPin size={24} />, label: "Ubicación", href: "/qr-location" },
  { icon: <Calendar size={24} />, label: "Evento", href: "/qr-calendar" },
  { icon: <FaYoutube size={24} />, label: "YouTube", href: "/qr-youtube" },
  { icon: <FaAppStoreIos size={24} />, label: "App Store", href: "/qr-appstore" },
  { icon: <FaTelegramPlane size={24} />, label: "Telegram", href: "/qr-telegram" },
  { icon: <Star size={24} />, label: "Google Review", href: "/qr-google-review" },
  { icon: <Lock size={24} />, label: "Protegido", href: "/qr-password" },
  { icon: <Shuffle size={24} />, label: "Multi-enlace", href: "/qr-multi-link" },
];

const USE_CASES = [
  { icon: <UtensilsCrossed size={24} />, label: "Restaurantes", href: "/qr-para-restaurantes" },
  { icon: <Megaphone size={24} />, label: "Marketing", href: "/qr-para-marketing" },
  { icon: <PartyPopper size={24} />, label: "Eventos", href: "/qr-para-eventos" },
  { icon: <Hotel size={24} />, label: "Hoteles", href: "/qr-para-hoteles" },
  { icon: <GraduationCap size={24} />, label: "Educación", href: "/qr-para-educacion" },
  { icon: <FaInstagram size={24} />, label: "Instagram", href: "/qr-para-instagram" },
  { icon: <Briefcase size={24} />, label: "Negocios", href: "/qr-para-negocios" },
];

const STEPS = [
  { n: "1", title: "Elige el tipo", desc: "Selecciona entre 17 tipos de QR: URL, WiFi, vCard, WhatsApp y más." },
  { n: "2", title: "Personaliza", desc: "Colores, degradados, logo, marcos. Hazlo tuyo en segundos." },
  { n: "3", title: "Descarga o guarda", desc: "PNG, SVG o JPG. O guárdalo como QR dinámico para editarlo después." },
];

export default function Home() {
  const { t } = useLang();

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          {t("heroTitle")}
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            {t("heroSubtitle")}
          </span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          {t("heroDesc")}
        </p>
      </section>

      {/* Generator */}
      <section className="bg-gray-50 dark:bg-gray-900 rounded-3xl p-6 sm:p-10 mb-16">
        <QRGenerator />
      </section>

      {/* How it works */}
      <section className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Cómo funciona</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <div key={s.n} className="text-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center mx-auto mb-3 text-lg">
                {s.n}
              </div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Todo lo que puedes hacer</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
              <span className="text-2xl block mb-2">{f.icon}</span>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* QR Types */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Tipos de QR disponibles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TYPES.map((tp) => (
            <Link key={tp.label} href={tp.href}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center hover:border-purple-300 dark:hover:border-purple-700 transition-colors group">
              <span className="text-2xl block mb-1">{tp.icon}</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-purple-600">{tp.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">Para cada industria</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {USE_CASES.map((uc) => (
            <Link key={uc.label} href={uc.href}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center hover:border-purple-300 dark:hover:border-purple-700 transition-colors group">
              <span className="text-2xl block mb-1">{uc.icon}</span>
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-purple-600">{uc.label}</span>
            </Link>
          ))}
        </div>
      </section>
      </div>
    </>
  );
}
