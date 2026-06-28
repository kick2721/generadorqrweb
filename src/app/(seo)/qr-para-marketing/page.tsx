import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Códigos QR para Marketing Digital | Estrategia y Conversión",
  description: "Crea campañas de marketing con códigos QR personalizados. Landing pages, redes sociales, descuentos y más. Sin registro.",
};

export default function Page() {
  return (
    <SeoPage
      title="Códigos QR para Marketing Digital"
      subtitle="Potencia tus campañas de marketing con códigos QR: landing pages, descuentos, redes sociales y medición de resultados."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR para Marketing" },
      ]}
      sections={[
        {
          title: "Campañas con Landing Pages",
          content: `Crea códigos QR que dirijan a landing pages específicas para cada campaña. Un código por promoción, descuento o lanzamiento. Mides el rendimiento de cada una.\n\nPuedes crear URLs acortadas con tracking UTM para saber exactamente cuántas personas escanearon y desde dónde. Ideal para campañas en medios impresos, vallas publicitarias o envases de producto.`,
        },
        {
          title: "Redes Sociales y Seguidores",
          content: `Aumenta tus seguidores con códigos QR que enlacen directamente a tus perfiles de Instagram, TikTok, Facebook o YouTube. Un escaneo y el usuario llega a tu perfil.\n\nColoca el código en tus materiales impresos, en la tienda física o en los packs de producto. Reduce la fricción: el usuario no tiene que buscar tu perfil manualmente.`,
        },
        {
          title: "Descuentos y Ofertas Exclusivas",
          content: `Genera códigos QR para promociones limitadas. Cada código dirige a un cupón de descuento, oferta 2×1 o regalo por compra. Ideal para campañas temporales.\n\nPuedes crear un código específico para cada canal: uno para email, otro para redes, otro para tienda física. Así sabes qué canal funciona mejor.`,
        },
        {
          title: "Publicidad Impresa y OOH",
          content: `Integra códigos QR en flyers, carteles, vallas publicitarias, revistas y envases. Conviertes el soporte impreso en un punto de interacción digital.\n\nConsejos: incluye una llamada a la acción clara como "Escanea y obtén tu descuento". El QR debe ser lo suficientemente grande y estar en un lugar donde se pueda escanear cómodamente.`,
        },
        {
          title: "Medición y Analítica",
          content: `Con los códigos QR dinámicos (plan Pro) obtienes estadísticas de escaneo: número total, escaneos por día, ubicación aproximada y dispositivo usado.\n\nEstos datos te permiten optimizar tus campañas en tiempo real. Sabes qué días hay más interacción, en qué zonas y con qué tipo de dispositivo.`,
        },
      ]}
      faqs={[
        { q: "¿Qué tamaño debe tener un QR en una valla publicitaria?", a: "Para vallas recomendamos al menos 10-15 cm. En revistas y flyers, mínimo 2 cm. Siempre prueba el escaneo desde la distancia real a la que verán el código." },
        { q: "¿Puedo cambiar la URL sin cambiar el código?", a: "Sí, si usas QR dinámico (plan Pro). El código impreso siempre funciona; tú cambias el destino desde tu panel." },
        { q: "¿Cómo añado parámetros UTM?", a: "Puedes incluir cualquier URL con parámetros UTM. Simplemente introduce la URL completa (con ?utm_source=...) en el campo de enlace." },
        { q: "¿Los QR caducan?", a: "Los códigos QR estáticos no caducan nunca. Los dinámicos funcionan mientras tengas cuenta activa." },
        { q: "¿Puedo descargar el QR en alta resolución para imprimir?", a: "Sí, descarga en SVG que es vectorial y escalable a cualquier tamaño sin pérdida de calidad." },
      ]}
      ctaText="Crea tu QR de marketing gratis"
    />
  );
}
