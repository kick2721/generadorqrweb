import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Códigos QR para Instagram | Más Seguidores y Engagement",
  description: "Crea códigos QR para Instagram: enlace directo a tu perfil, publicaciones específicas, Reels o descuentos exclusivos.",
};

export default function Page() {
  return (
    <SeoPage
      title="Códigos QR para Instagram"
      subtitle="Aumenta tus seguidores en Instagram con códigos QR. Enlace directo al perfil, a una publicación o a un Reel desde cualquier soporte."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR para Instagram" },
      ]}
      sections={[
        {
          title: "Enlace Directo a tu Perfil",
          content: `Convierte cualquier soporte físico en un punto de captación de seguidores. Un código QR que abre tu perfil de Instagram listo para seguir.\n\nColócalo en la puerta de tu local, en los tickets de compra, en flyers, en la mesa del restaurante o en el packaging de tus productos. Cada escaneo es un nuevo seguidor potencial.`,
        },
        {
          title: "Publicaciones y Reels Específicos",
          content: `Comparte una publicación concreta o un Reel viral mediante código QR. Ideal para campañas promocionales, lanzamientos de producto o contenido destacado.\n\nPuedes crear un código diferente para cada campaña y medir cuál genera más tráfico a tu contenido de Instagram.`,
        },
        {
          title: "Descuentos Exclusivos para Seguidores",
          content: `Crea una landing page con un descuento exclusivo para tus seguidores de Instagram. El código QR la promociona en tu tienda física o en eventos.\n\nEl usuario escanea, accede al descuento y lo canjea en tienda u online. Una forma efectiva de conectar tu presencia digital con las ventas físicas.`,
        },
        {
          title: "Eventos y Pop-ups",
          content: `Para eventos, lanzamientos o pop-up stores, crea códigos QR temporales que enlacen a una publicación de Instagram o a la ubicación del evento.\n\nCambia el destino según la fase de la campaña: preventa, día del evento y post-evento. Cada fase con su propio contenido.`,
        },
        {
          title: "Colaboraciones con Influencers",
          content: `Crea códigos QR personalizados para cada colaboración. Cada influencer promociona un código único que enlaza a tu perfil o a una landing page con tracking.\n\nMides cuántos seguidores llegan desde cada influencer y calculas el ROI de cada colaboración.`,
        },
      ]}
      faqs={[
        { q: "¿Puedo enlazar directamente a una publicación específica?", a: "Sí, usa la URL de la publicación (instagram.com/p/xxx) o del Reel (instagram.com/reel/xxx)." },
        { q: "¿El QR funciona en Stories?", a: "No directamente en Stories, pero puedes compartir el código QR en tu feed o en historias como imagen para que los seguidores lo escaneen desde otro dispositivo." },
        { q: "¿Puedo cambiar la publicación de destino sin cambiar el QR?", a: "Sí, si usas QR dinámico (plan Pro). Actualizas el enlace desde tu panel y el código sigue funcionando." },
        { q: "¿Funciona si el usuario no tiene Instagram instalado?", a: "El enlace se abrirá en el navegador web de Instagram. El usuario puede ver el perfil aunque no tenga la app." },
      ]}
      ctaText="Crea tu QR para Instagram gratis"
    />
  );
}
