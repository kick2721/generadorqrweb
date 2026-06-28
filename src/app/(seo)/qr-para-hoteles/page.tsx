import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Códigos QR para Hoteles | Digitaliza tu Hotel",
  description: "Crea códigos QR para hoteles: WiFi para huéspedes, room service, reservas, check-in digital y más.",
};

export default function Page() {
  return (
    <SeoPage
      title="Códigos QR para Hoteles"
      subtitle="Transforma la experiencia de tus huéspedes con códigos QR: WiFi automático, room service, check-in digital y guía local."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR para Hoteles" },
      ]}
      sections={[
        {
          title: "WiFi sin Contraseñas",
          content: `Olvida las tarjetas con contraseñas WiFi que se pierden. Crea un código QR WiFi personalizado para cada habitación o para las zonas comunes.\n\nEl huésped escanea y se conecta al instante. Puedes tener un código por habitación o uno general para lobby y piscina. Menos trabajo para recepción y huéspedes más satisfechos.`,
        },
        {
          title: "Room Service y Servicios",
          content: `Coloca códigos QR en las habitaciones que enlacen al menú de room service, carta de almohadas, horarios de servicios o catálogo de actividades.\n\nTambién puedes crear un QR que abra WhatsApp directo con recepción para pedidos o consultas rápidas. El huésped se comunica al instante sin marcar números.`,
        },
        {
          title: "Check-in y Check-out Digital",
          content: `Agiliza el check-in con códigos QR que lleven al huésped a un formulario de registro previo. A su llegada, solo recoge la llave.\n\nPara el check-out, un QR que enlace a la encuesta de satisfacción y al pago de extras. Reduces colas en recepción y mejoras la experiencia.`,
        },
        {
          title: "Guía Local y Atracciones",
          content: `Crea un código QR con un mapa interactivo de la zona, recomendaciones de restaurantes, monumentos y actividades turísticas.\n\nLos huéspedes lo escanean al llegar y tienen una guía completa en su móvil. Puedes incluir enlaces directos a reservas en restaurantes o compra de entradas.`,
        },
        {
          title: "Opiniones en Google y TripAdvisor",
          content: `Facilita que los huéspedes dejen su opinión. Coloca códigos QR en la habitación o en recepción que enlacen directamente a tu perfil de Google My Business o TripAdvisor.\n\nMás reseñas positivas mejoran tu puntuación y atraen a más reservas. El momento ideal es durante el check-out o al enviar el email de despedida.`,
        },
      ]}
      faqs={[
        { q: "¿Puedo tener un código WiFi diferente por habitación?", a: "Sí, creas un código QR por cada SSID o contraseña. Cada habitación puede tener el suyo." },
        { q: "¿Los códigos QR para menú se pueden actualizar?", a: "Sí, si usas QR dinámico. Actualizas el menú en tu panel y el código sigue funcionando." },
        { q: "¿Qué formato recomiendas para imprimir en habitaciones?", a: "SVG para impresión nítida. Recomendamos 4×4 cm mínimo, colocado en el escritorio o junto a la cama." },
        { q: "¿Funciona el QR WiFi con redes empresariales?", a: "Funciona con cualquier red que tenga SSID y contraseña. Para redes con portal cautivo, usa un QR que enlace a la URL de registro." },
      ]}
      ctaText="Crea tu QR para hoteles gratis"
    />
  );
}
