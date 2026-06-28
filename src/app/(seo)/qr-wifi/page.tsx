import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para WiFi | Conexión Automática",
  description: "Crea códigos QR para WiFi gratis. Tus clientes se conectan escaneando el código, sin escribir contraseñas.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para WiFi"
      subtitle="Comparte tu red WiFi sin esfuerzo. Crea un código QR que conecta dispositivos automáticamente al escanearlo."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR WiFi" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR WiFi?",
          content: `Un código QR WiFi almacena los datos de tu red (SSID, contraseña y tipo de cifrado). Al escanearlo con un móvil, el dispositivo se conecta automáticamente a la red.\n\nNo es necesario escribir contraseñas largas con caracteres especiales. El usuario escanea y ya está conectado. Compatible con iOS y Android.`,
        },
        {
          title: "Usos Recomendados",
          content: `Restaurantes y cafeterías: coloca el código en cada mesa para que los clientes se conecten sin molestar al camarero.\n\nHoteles: un código en cada habitación y otro en zonas comunes.\n\nOficinas: simplifica el acceso a la red WiFi para visitas y reuniones.\n\nEventos: comparte la red del evento con todos los asistentes de forma instantánea.`,
        },
        {
          title: "Seguridad",
          content: `El código QR WiFi funciona con redes protegidas por WPA, WPA2 o WEP. No funciona con redes de portal cautivo (las que requieren login vía navegador).\n\nPara redes corporativas con portal cautivo, puedes crear un QR que enlace a la URL de registro en lugar de usar el formato WiFi nativo.\n\nLa contraseña queda codificada dentro del QR. Trátalo con la misma confidencialidad que la contraseña impresa.`,
        },
        {
          title: "Consejos de Impresión",
          content: `Imprime en formato SVG para máxima calidad. Tamaño recomendado: 4×4 cm mínimo para que se escanee cómodamente.\n\nLaminado o plastificado para uso prolongado. Colócalo en un lugar visible y accesible para el escaneo. Prueba siempre con varios dispositivos antes de imprimir en cantidad.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona con cualquier móvil?", a: "Sí, los QR WiFi funcionan en iOS (desde iOS 11) y Android (desde Android 10) sin apps adicionales." },
        { q: "¿Puedo cambiar la contraseña sin cambiar el QR?", a: "No, el QR WiFi guarda la contraseña. Si la cambias, debes generar un nuevo código." },
        { q: "¿Es seguro mostrar la contraseña en un QR?", a: "La contraseña está codificada y no se ve a simple vista, pero cualquiera puede decodificarla. Trátalo como si tuvieras la contraseña impresa." },
        { q: "¿Funciona con redes 5GHz?", a: "Sí, la frecuencia no importa. El QR guarda SSID y contraseña, el dispositivo elige la mejor banda disponible." },
        { q: "¿Qué formato de cifrado debo usar?", a: "Selecciona WPA/WPA2 si no estás seguro. Es el estándar más común en redes actuales." },
      ]}
      ctaText="Crea tu código QR WiFi gratis"
    />
  );
}
