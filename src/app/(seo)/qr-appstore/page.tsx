import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para App Store | Descarga Directa",
  description: "Crea códigos QR para App Store gratis. Tus usuarios descargan tu app con un escaneo, sin buscar en la tienda.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para App Store"
      subtitle="Aumenta las descargas de tu app. Crea un código QR que abre directamente tu página en la App Store o Google Play."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR App Store" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para App Store?",
          content: `Un código QR para App Store enlaza directamente a la página de tu aplicación en la App Store (iOS) o Google Play (Android). Al escanearlo, el usuario ve la app lista para descargar.\n\nElimina la fricción de tener que buscar tu app por nombre. El usuario escanea y descarga al instante. Ideal para campañas de adquisición de usuarios.`,
        },
        {
          title: "Usos Recomendados",
          content: `Marketing offline: en carteles, flyers y vallas publicitarias para impulsar descargas.\n\nEventos y conferencias: los asistentes descargan tu app al momento.\n\nPackaging de producto: la caja del producto incluye el QR para descargar la app complementaria.\n\nRedes sociales y web: enlace directo a la tienda desde cualquier plataforma.`,
        },
        {
          title: "Detección Automática de Plataforma",
          content: `Si usas una URL universal (como la de tu app en el sitio web), el QR puede detectar si el usuario usa iOS o Android y redirigir a la tienda correspondiente.\n\nCon un QR URL estándar, puedes elegir a qué tienda enlazar. Para cubrir ambas plataformas, considera usar un enlace tipo "smart link" que redirija según el dispositivo.`,
        },
        {
          title: "Consejos para Máximas Descargas",
          content: `Incluye el icono de la tienda junto al QR para que el usuario sepa que va a descargar una app.\n\nAñade una llamada a la acción clara: "Descarga nuestra app".\n\nColoca el QR en lugares de alto tráfico y a la altura de los ojos para facilitar el escaneo.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona en iOS y Android con el mismo QR?", a: "Un QR enlaza a una sola URL. Para cubrir ambos, necesitas un smart link que redirija según el dispositivo, o crea dos códigos separados." },
        { q: "¿Puedo cambiar la app sin cambiar el QR?", a: "Sí, con QR dinámico (plan Pro) puedes redirigir a otra app o tienda." },
        { q: "¿Qué URL uso para mi app?", a: "La URL de tu app en la tienda: apps.apple.com/app/idXXXXX para iOS, play.google.com/store/apps/details?id=XXXXX para Android." },
        { q: "¿El QR caduca?", a: "Los QR estáticos no caducan nunca. La URL debe seguir activa en la tienda." },
      ]}
      ctaText="Crea tu código QR para App Store gratis"
    />
  );
}
