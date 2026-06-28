import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Códigos QR para Eventos | Entradas, Acceso y Promoción",
  description: "Crea códigos QR para tus eventos: entradas digitales, acceso wifi para asistentes, enlaces a WhatsApp y más.",
};

export default function Page() {
  return (
    <SeoPage
      title="Códigos QR para Eventos"
      subtitle="Organiza eventos profesionales con códigos QR: entradas digitales, acceso WiFi, promoción en redes y check-in rápido."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR para Eventos" },
      ]}
      sections={[
        {
          title: "Entradas Digitales con QR",
          content: `Elimina las entradas en papel. Cada asistente recibe un código QR único que se escanea en la puerta para validar su acceso. Rápido, seguro y sostenible.\n\nPuedes generar códigos QR para distintos tipos de entrada: VIP, general, Early Bird. Cada código puede tener su propio diseño y color para facilitar la identificación visual.`,
        },
        {
          title: "WiFi para Asistentes",
          content: `Comparte la red WiFi del evento con todos los asistentes mediante un código QR. Lo colocas en las mesas, en las acreditaciones o en las pantallas del recinto.\n\nUn detalle que mejora la experiencia del asistente: nadie tiene que pedir la contraseña. El código funciona con cualquier móvil.`,
        },
        {
          title: "Promoción del Evento",
          content: `Difunde tu evento con códigos QR en flyers, carteles y redes sociales. El QR dirige a la página de registro, compra de entradas o al programa del evento.\n\nPuedes crear códigos separados para cada canal de promoción y saber cuál genera más conversiones. Ideal para medir el ROI de cada acción.`,
        },
        {
          title: "Networking y Agendas",
          content: `Incluye códigos QR en las acreditaciones que enlacen al perfil de LinkedIn del asistente o a una tarjeta digital vCard. El networking fluye sin esfuerzo.\n\nTambién puedes crear códigos QR con la agenda completa del evento, mapa del recinto o enlace directo a la app del evento.`,
        },
        {
          title: "Feedback Post-Evento",
          content: `Coloca códigos QR a la salida que enlacen a una encuesta de satisfacción. Recoges feedback en caliente, cuando la experiencia está fresca.\n\nLas tasas de respuesta son mucho más altas que enviando la encuesta por email al día siguiente.`,
        },
      ]}
      faqs={[
        { q: "¿Puedo crear un código QR por entrada?", a: "Cada QR estático es único por URL. Si necesitas un código por asistente, puedes crear URLs diferentes para cada uno." },
        { q: "¿El QR para WiFi funciona en cualquier dispositivo?", a: "Sí, los QR WiFi son estándar y funcionan en iOS y Android. El usuario escanea y se conecta automáticamente." },
        { q: "¿Puedo personalizar el diseño del QR para mi evento?", a: "Sí, puedes cambiar colores, estilo de puntos y esquinas para que combine con la identidad visual de tu evento." },
        { q: "¿Qué formato es mejor para imprimir en acreditaciones?", a: "Recomendamos SVG. Es vectorial, escala perfectamente a cualquier tamaño y mantiene la nitidez del código." },
      ]}
      ctaText="Crea tu QR para eventos gratis"
    />
  );
}
