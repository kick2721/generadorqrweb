import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Códigos QR para Negocios | Digitaliza tu PYME",
  description: "Crea códigos QR para tu negocio: tarjeta digital vCard, WhatsApp Business, enlaces, WiFi para clientes y más.",
};

export default function Page() {
  return (
    <SeoPage
      title="Códigos QR para Negocios"
      subtitle="Digitaliza tu PYME con códigos QR. Tarjeta digital vCard, WhatsApp Business, enlace a tu web y WiFi para clientes."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR para Negocios" },
      ]}
      sections={[
        {
          title: "Tarjeta Digital vCard",
          content: `Olvida las tarjetas de visita en papel. Crea un código QR que guarde automáticamente tus datos de contacto en el móvil de quien lo escanea.\n\nNombre, teléfono, email, web, dirección y redes sociales. Todo en un solo escaneo. Ideal para ferias, reuniones de negocio y networking.`,
        },
        {
          title: "WhatsApp Business",
          content: `Crea un código QR que abra directamente un chat de WhatsApp con tu número de negocio. Tus clientes te escriben sin guardar tu número.\n\nPuedes predefinir un mensaje de bienvenida como "Hola, quiero información sobre..." para que el cliente sepa qué escribir. Perfecto para atención al cliente y ventas.`,
        },
        {
          title: "Enlace a tu Web o Tienda Online",
          content: `Dirige tráfico a tu web con códigos QR. Colócalos en tus materiales impresos, en el escaparate, en los tickets o en el packaging.\n\nCrea códigos específicos para cada campaña o producto y mide cuánto tráfico genera cada canal. Ideal para conocer el ROI de tu publicidad impresa.`,
        },
        {
          title: "WiFi para Clientes",
          content: `Ofrece WiFi gratis a tus clientes sin tener que repetir la contraseña. Un código QR que ellos mismos escanean.\n\nMejora la experiencia del cliente y aumenta el tiempo que pasan en tu local. Los clientes lo valoran y vuelven.`,
        },
        {
          title: "Opiniones y Reseñas",
          content: `Solicita opiniones de forma sutil. Un código QR que enlaza directamente a tu perfil de Google My Business para dejar una reseña.\n\nMás reseñas positivas mejoran tu posicionamiento local en Google y atraen a más clientes. Coloca el QR en puntos estratégicos de tu negocio.`,
        },
      ]}
      faqs={[
        { q: "¿Qué es una vCard?", a: "Es un formato estándar de tarjeta de contacto digital. Al escanear el QR, el teléfono guarda automáticamente tus datos en la agenda." },
        { q: "¿Puedo tener varios números de WhatsApp?", a: "Sí, crea un código QR diferente para cada número. Cada uno abre un chat con ese número específico." },
        { q: "¿Los QR para negocio caducan?", a: "Los QR estáticos no caducan nunca. Los dinámicos funcionan mientras tengas tu cuenta activa." },
        { q: "¿Puedo poner el QR en mi escaparate?", a: "Sí, es una excelente ubicación. Asegúrate de que sea visible y de tamaño suficiente (mínimo 5×5 cm) para escanear desde la acera." },
        { q: "¿Qué formato de descarga recomiendas para imprimir?", a: "SVG, porque es vectorial y se puede escalar a cualquier tamaño sin perder calidad." },
      ]}
      ctaText="Crea tu QR de negocio gratis"
    />
  );
}
