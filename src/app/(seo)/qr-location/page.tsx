import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para Ubicación | Google Maps",
  description: "Crea códigos QR para ubicación gratis. Tus clientes abren Google Maps con tu dirección al escanear.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Ubicación"
      subtitle="Ayuda a tus clientes a encontrarte. Crea un código QR que abre Google Maps con tus coordenadas exactas."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Ubicación" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para Ubicación?",
          content: `Un código QR para ubicación almacena coordenadas de latitud y longitud. Al escanearlo, el dispositivo abre Google Maps o Apple Maps con la ubicación marcada.\n\nIdeal para negocios que quieren que los clientes lleguen sin perderse. También para eventos, restaurantes, talleres mecánicos o cualquier negocio con ubicación física.`,
        },
        {
          title: "Usos Recomendados",
          content: `Restaurantes y cafeterías: los clientes encuentran tu local sin buscar en el mapa.\n\nEventos: comparte la ubicación exacta del recinto, incluyendo la puerta de acceso.\n\nTiendas físicas: en publicidad online y redes sociales, un QR que lleva directo a la tienda.\n\nInmobiliarias: comparte la ubicación exacta de una propiedad en venta o alquiler.`,
        },
        {
          title: "Cómo Obtener las Coordenadas",
          content: `Abre Google Maps, haz clic derecho en la ubicación exacta y selecciona "¿Qué hay aquí?". Las coordenadas aparecen abajo.\n\nTambién puedes usar Google Maps y copiar las coordenadas de la URL. Introduce esos valores en los campos de latitud y longitud de nuestro generador.`,
        },
        {
          title: "Consejos de Uso",
          content: `Coloca el QR en tu web, redes sociales y materiales impresos. Incluye un texto como "¡Escanea para llegar!".\n\nPara locales con varias entradas, usa las coordenadas de la entrada principal. Para eventos grandes, usa las coordenadas del punto de acceso más cercano al parking o transporte público.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona en iOS y Android?", a: "Sí. En iOS abre Apple Maps, en Android abre Google Maps. Ambos navegan a las coordenadas." },
        { q: "¿Puedo cambiar la ubicación sin cambiar el QR?", a: "No, las coordenadas están grabadas en el código estático. Para ubicaciones variables usa un QR URL dinámico." },
        { q: "¿Qué precisión tienen las coordenadas?", a: "Usamos grados decimales con 6 decimales, precisión de ~10 cm." },
        { q: "¿Funciona sin conexión a internet?", a: "El QR se escanea sin conexión, pero necesita datos para abrir el mapa y calcular la ruta." },
      ]}
      ctaText="Crea tu código QR de ubicación gratis"
    />
  );
}
