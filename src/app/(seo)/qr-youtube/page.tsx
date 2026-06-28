import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para YouTube | Videos",
  description: "Crea códigos QR para YouTube gratis. Comparte tus videos con un escaneo: canal, video o lista de reproducción.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para YouTube"
      subtitle="Comparte tus videos al instante. Un código QR que lleva a tu canal, video o lista de reproducción en YouTube."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR YouTube" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para YouTube?",
          content: `Un código QR para YouTube enlaza a un video, canal o lista de reproducción. Al escanearlo, se abre YouTube con el contenido que hayas elegido.\n\nIdeal para creators, marcas y educadores que quieren compartir videos desde materiales impresos, packaging o eventos. El usuario llega directamente al video, sin buscar.`,
        },
        {
          title: "Usos Creativos",
          content: `Packaging de producto: el cliente escanea y ve un video tutorial o unboxing.\n\nRestaurantes: video mostrando el proceso de elaboración de los platos.\n\nTarjetas de visita: tu video presentación o portfolio en YouTube.\n\nEducación: enlaces a video-clases, tutoriales y contenido complementario.\n\nEventos: video resumen o teaser del próximo evento.`,
        },
        {
          title: "Tipos de Enlace",
          content: `Video específico: dirige a un video concreto. Ideal para campañas y tutoriales.\n\nCanal: lleva a tu canal de YouTube para que el usuario vea todo tu contenido.\n\nLista de reproducción: compila varios videos sobre un tema. Perfecto para cursos o series.`,
        },
        {
          title: "Consejos para Impresión",
          content: `Incluye un icono de YouTube junto al QR para que el usuario sepa qué contenido va a encontrar. La llamada a la acción "Mira el video" aumenta la tasa de escaneo.\n\nUsa un tamaño mínimo de 3×3 cm para que se escanee cómodamente. Descarga en SVG para impresión profesional.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona si el usuario no tiene YouTube instalado?", a: "Sí, el enlace se abre en el navegador si no tiene la app instalada." },
        { q: "¿Puedo cambiar el video sin cambiar el QR?", a: "Sí, si usas QR dinámico (plan Pro). Cambias la URL y el código sigue funcionando." },
        { q: "¿Qué URL uso para un video?", a: "La URL del video en YouTube: https://youtube.com/watch?v=XXXXX o https://youtu.be/XXXXX" },
        { q: "¿Puedo enlazar a un Short?", a: "Sí, los Shorts tienen su propia URL (youtube.com/shorts/XXXXX) que funciona igual." },
      ]}
      ctaText="Crea tu código QR para YouTube gratis"
    />
  );
}
