"use client";

import QRGenerator from "@/components/QRGenerator";
import { useLang } from "@/context/LangContext";
import Link from "next/link";

const FEATURES = [
  { icon: "🎨", title: "Diseño completo", desc: "Colores, degradados, 6 estilos de puntos, esquinas, logo y marcos decorativos." },
  { icon: "🔄", title: "QR dinámicos", desc: "Modifica el destino sin reimprimir. Estadísticas de escaneo en vivo." },
  { icon: "📊", title: "Analíticas", desc: "Timeline, países, dispositivos, actividad. Sabes cuándo y dónde escanean." },
  { icon: "🤖", title: "AI Chat", desc: "Cada QR dinámico tiene un asistente que responde preguntas sobre su contenido." },
  { icon: "🔢", title: "QR por lote", desc: "Sube un CSV y genera cientos de QR a la vez. Descarga todo en ZIP." },
  { icon: "🔗", title: "API pública", desc: "POST /api/v1/generate — integra generación de QR en tus propios sistemas." },
  { icon: "🔒", title: "Protegido", desc: "QR con contraseña. Solo quien tiene la clave accede al contenido." },
  { icon: "🔀", title: "Multi-enlace", desc: "Un QR que redirige a diferentes URLs según el día y la hora." },
  { icon: "📂", title: "Carpetas", desc: "Organiza tus QR en carpetas desde el panel de control." },
  { icon: "⏰", title: "Programado", desc: "Fecha de expiración. El QR deja de funcionar automáticamente." },
  { icon: "⭐", title: "Google Review", desc: "QR que lleva directo al formulario de reseña de tu negocio en Google." },
  { icon: "📋", title: "Plantillas", desc: "Guarda y carga diseños. No vuelvas a configurar colores desde cero." },
  { icon: "🖼️", title: "Descarga PNG, SVG, JPG", desc: "Alta resolución para digital o vectorial para impresión profesional." },
  { icon: "📱", title: "17 tipos QR", desc: "URL, WiFi, vCard, WhatsApp, email, SMS, teléfono, ubicación, calendario, YouTube y más." },
  { icon: "🌐", title: "23 idiomas", desc: "Interfaz traducida a 23 idiomas. Alcance global desde el primer día." },
];

const TYPES = [
  { icon: "🔗", label: "URL / Web", href: "/qr-url" },
  { icon: "📶", label: "WiFi", href: "/qr-wifi" },
  { icon: "👤", label: "vCard / Contacto", href: "/qr-vcard" },
  { icon: "💬", label: "WhatsApp", href: "/qr-whatsapp" },
  { icon: "📧", label: "Email", href: "#" },
  { icon: "📝", label: "Texto", href: "/qr-text" },
  { icon: "📞", label: "Teléfono", href: "/qr-phone" },
  { icon: "💬", label: "SMS", href: "/qr-sms" },
  { icon: "📍", label: "Ubicación", href: "/qr-location" },
  { icon: "📅", label: "Evento", href: "/qr-calendar" },
  { icon: "▶️", label: "YouTube", href: "/qr-youtube" },
  { icon: "📱", label: "App Store", href: "/qr-appstore" },
  { icon: "✈️", label: "Telegram", href: "/qr-telegram" },
  { icon: "⭐", label: "Google Review", href: "/qr-google-review" },
  { icon: "🔒", label: "Protegido", href: "/qr-password" },
  { icon: "🔀", label: "Multi-enlace", href: "/qr-multi-link" },
];

const USE_CASES = [
  { icon: "🍽️", label: "Restaurantes", href: "/qr-para-restaurantes" },
  { icon: "📢", label: "Marketing", href: "/qr-para-marketing" },
  { icon: "🎉", label: "Eventos", href: "/qr-para-eventos" },
  { icon: "🏨", label: "Hoteles", href: "/qr-para-hoteles" },
  { icon: "🎓", label: "Educación", href: "/qr-para-educacion" },
  { icon: "📸", label: "Instagram", href: "/qr-para-instagram" },
  { icon: "💼", label: "Negocios", href: "/qr-para-negocios" },
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

      {/* Pricing */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-8">{t("vsTitle")}</h2>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto items-start">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t("planFree")}</span>
            <h3 className="font-semibold text-lg mt-1 mb-3">{t("feat1Title")}</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {[t("featFree1"), t("featFree2"), t("featFree3"), t("featFree4")].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/" className="mt-4 block w-full py-2.5 text-center rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition">{t("planFree")}</Link>
          </div>
          <div className="p-6 rounded-2xl border border-purple-500/40 bg-white dark:bg-gray-900 shadow-lg">
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">{t("planPro")}</span>
            <h3 className="font-bold text-lg mt-1 mb-1">{t("planProDesc")}</h3>
            <div className="mb-4">
              <span className="text-3xl font-bold">{t("pricePro")}</span>
              <span className="text-gray-500 text-sm">{t("perMonth")}</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
              {[t("featPro1"), t("featPro2"), t("featPro3"), t("featPro4"), t("featPro5"), t("featPro6")].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/pricing" className="block w-full py-2.5 text-center rounded-xl bg-purple-600 text-white font-medium text-sm hover:bg-purple-700 transition active:scale-[0.97]">{t("viewPricing")}</Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="text-center mb-16">
        <h2 className="text-2xl font-bold mb-3">¿Listo para crear tu primer QR?</h2>
        <p className="text-gray-500 mb-6">Sin registro, sin tarjeta, sin límites.</p>
        <a href="/" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-700 transition duration-75 active:scale-[0.97]">
          Empezar ahora
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 pt-12 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="font-semibold mb-3">Tipos QR</p>
            <ul className="space-y-1.5 text-gray-500">
              <li><Link href="/qr-url" className="hover:text-purple-600">URL</Link></li>
              <li><Link href="/qr-wifi" className="hover:text-purple-600">WiFi</Link></li>
              <li><Link href="/qr-vcard" className="hover:text-purple-600">vCard</Link></li>
              <li><Link href="/qr-whatsapp" className="hover:text-purple-600">WhatsApp</Link></li>
              <li><Link href="/qr-google-review" className="hover:text-purple-600">Google Review</Link></li>
              <li><Link href="/qr-password" className="hover:text-purple-600">Protegido</Link></li>
              <li><Link href="/qr-multi-link" className="hover:text-purple-600">Multi-enlace</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Industrias</p>
            <ul className="space-y-1.5 text-gray-500">
              <li><Link href="/qr-para-restaurantes" className="hover:text-purple-600">Restaurantes</Link></li>
              <li><Link href="/qr-para-marketing" className="hover:text-purple-600">Marketing</Link></li>
              <li><Link href="/qr-para-eventos" className="hover:text-purple-600">Eventos</Link></li>
              <li><Link href="/qr-para-hoteles" className="hover:text-purple-600">Hoteles</Link></li>
              <li><Link href="/qr-para-educacion" className="hover:text-purple-600">Educación</Link></li>
              <li><Link href="/qr-para-instagram" className="hover:text-purple-600">Instagram</Link></li>
              <li><Link href="/qr-para-negocios" className="hover:text-purple-600">Negocios</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Producto</p>
            <ul className="space-y-1.5 text-gray-500">
              <li><Link href="/pricing" className="hover:text-purple-600">Precios</Link></li>
              <li><Link href="/bulk" className="hover:text-purple-600">QR por lote</Link></li>
              <li><Link href="/api/v1/generate" className="hover:text-purple-600">API</Link></li>
              <li><Link href="/dashboard" className="hover:text-purple-600">Panel de control</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-3">Legal</p>
            <ul className="space-y-1.5 text-gray-500">
              <li><Link href="/privacy" className="hover:text-purple-600">Privacidad</Link></li>
              <li><Link href="/tos" className="hover:text-purple-600">Términos</Link></li>
              <li><Link href="/imprint" className="hover:text-purple-600">Aviso legal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
          QRWing — Generador de código QR profesional
        </div>
      </footer>
    </div>
    </>
  );
}
