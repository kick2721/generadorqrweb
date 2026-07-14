import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para Google Play | Descarga Directa",
  description: "Crea códigos QR para Google Play gratis. Tus usuarios descargan tu app de Android con un escaneo.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Google Play"
      subtitle="Aumenta las descargas de tu app Android. Crea un código QR que abre directamente tu página en Google Play."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Google Play" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para Google Play?",
          content: `Un código QR para Google Play enlaza directamente a la página de tu aplicación en Google Play Store (Android). Al escanearlo, el usuario ve la app lista para descargar.\n\nElimina la fricción de tener que buscar tu app por nombre. El usuario escanea y descarga al instante. Ideal para campañas de adquisición de usuarios Android.`,
        },
        {
          title: "Usos Recomendados",
          content: `Marketing offline: en carteles, flyers y vallas publicitarias para impulsar descargas.\n\nEventos y conferencias: los asistentes descargan tu app al momento.\n\nPackaging de producto: la caja del producto incluye el QR para descargar la app complementaria.\n\nRedes sociales y web: enlace directo a la tienda desde cualquier plataforma.`,
        },
        {
          title: "Cómo funciona con QR URL",
          content: `Este tipo de QR usa el formato URL estándar. Simplemente pegas el enlace de tu app en Google Play Store y el QR redirige a él al escanearlo.\n\nPuedes cambiar el destino en cualquier momento si usas un QR dinámico (plan Pro).`,
        },
        {
          title: "Consejos para Máximas Descargas",
          content: `Incluye el icono de Google Play junto al QR para que el usuario sepa que va a descargar una app Android.\n\nAñade una llamada a la acción clara: "Descarga nuestra app en Google Play".\n\nColoca el QR en lugares de alto tráfico y a la altura de los ojos para facilitar el escaneo.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona también para iOS?", a: "No, un QR enlaza a una sola URL. Para Google Play usa el enlace de tu app en la tienda Android. Si quieres cubrir ambos, usa un smart link o crea dos códigos separados." },
        { q: "¿Puedo cambiar la app sin cambiar el QR?", a: "Sí, con QR dinámico (plan Pro) puedes redirigir a otra app o tienda." },
        { q: "¿Qué URL uso para mi app en Google Play?", a: "El enlace de tu app: play.google.com/store/apps/details?id=XXXXX" },
        { q: "¿El QR caduca?", a: "Los QR estáticos no caducan nunca. La URL debe seguir activa en la tienda." },
      ]}
      ctaText="Crea tu código QR para Google Play gratis"
    />
  );
}
