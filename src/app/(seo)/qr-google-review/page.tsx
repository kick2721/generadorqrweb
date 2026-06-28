import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Código QR para Google Review | Recibe Reseñas",
  description: "Crea un código QR que lleva directamente a dejar una reseña en Google. Consigue más opiniones en Google Maps con un solo escaneo.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Google Review"
      subtitle="Pide reseñas sin fricción. Un escaneo y tus clientes llegan directo al formulario de opinión en Google."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Google Review" },
      ]}
      sections={[
        {
          title: "¿Qué es un QR para Google Review?",
          content: `Es un código QR que enlaza directamente al formulario de reseña de tu negocio en Google. Cuando un cliente lo escanea, abre la página para escribir una opinión sin tener que buscar tu negocio.\n\nSolo necesitas tu Place ID de Google (el identificador único de tu negocio en Google Maps). Lo encuentras en google.com/maps o con herramientas gratuitas online.`,
        },
        {
          title: "Por qué usar un QR para reseñas",
          content: `El mayor obstáculo para conseguir reseñas es la fricción: el cliente tiene que abrir Google Maps, buscar tu negocio, encontrar el botón de opinar. Con un QR, reduces eso a un escaneo.\n\nMás reseñas = mejor posicionamiento en Google Maps = más clientes. Negocios locales con reseñas frecuentes aparecen antes en los resultados de búsqueda.`,
        },
        {
          title: "Dónde colocar tu QR de reseñas",
          content: `En la carta del restaurante o bar. En el mostrador de tu tienda o comercio. En la mesa de atención al cliente.\n\nEn el ticket o factura de compra. En la puerta de entrada o salida del local. En tu stand de ferias y eventos.`,
        },
        {
          title: "Consejos para pedir reseñas",
          content: `Pide la reseña en el momento adecuado: cuando el cliente está satisfecho, no al inicio de la experiencia.\n\nOfrece un incentivo sutil (un descuento para la próxima visita). No compres reseñas falsas — Google las detecta y puede penalizar tu perfil.\n\nResponde a todas las reseñas, tanto positivas como negativas. Es señal de calidad para Google.`,
        },
      ]}
      faqs={[
        { q: "¿Qué es un Place ID?", a: "Es un identificador único que Google asigna a cada negocio en Google Maps. Puedes encontrarlo buscando tu negocio en google.com/maps y extrayendo el ID de la URL, o usando la herramienta Place ID Finder de Google." },
        { q: "¿Funciona en iOS y Android?", a: "Sí. Al escanear el QR se abre el navegador con el formulario de reseña de Google, funcionando igual en cualquier dispositivo." },
        { q: "¿Puedo cambiar el negocio sin cambiar el QR?", a: "Si usas un QR dinámico (con nuestra suscripción Pro), puedes cambiar el Place ID cuando quieras. Los QR estáticos mantienen la URL fija." },
        { q: "¿Cuántas reseñas más puedo conseguir?", a: "Depende del volumen de clientes. Negocios que colocan el QR en el punto de pago suelen multiplicar por 3 o 4 sus reseñas mensuales." },
      ]}
      ctaText="Crea tu QR para Google Review gratis"
    />
  );
}
