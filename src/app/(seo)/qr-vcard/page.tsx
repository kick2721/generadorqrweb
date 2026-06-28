import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para vCard | Tarjeta Digital",
  description: "Crea códigos QR para vCard gratis. Comparte tus datos de contacto con un escaneo: nombre, teléfono, email y más.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para vCard"
      subtitle="Comparte tus datos de contacto al instante. Crea un código QR que guarda automáticamente tu tarjeta digital en el móvil."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR vCard" },
      ]}
      sections={[
        {
          title: "¿Qué es una vCard QR?",
          content: `Una vCard QR contiene tus datos de contacto en formato estándar. Al escanear el código, el teléfono pregunta si quieres guardar el contacto en la agenda.\n\nIncluye: nombre completo, teléfono, email, sitio web, dirección, empresa y cargo. Todo en un solo escaneo. Olvida las tarjetas de visita en papel que se pierden o se quedan en un cajón.`,
        },
        {
          title: "Usos Profesionales",
          content: `Networking en eventos y conferencias: comparte tu contacto sin tener tarjetas impresas.\n\nFerias comerciales: los asistentes guardan tus datos al instante.\n\nReuniones de negocio: un escaneo y tienes el contacto de tu nuevo cliente o socio.\n\nProfesionales inmobiliarios, agentes de seguros y consultores: siempre disponibles para ser contactados.`,
        },
        {
          title: "Datos que puedes Incluir",
          content: `Nombre y apellidos, teléfono (fijo y móvil), email, sitio web, dirección postal, empresa y cargo, cumpleaños, notas personalizadas.\n\nCuantos más datos completes, más útil será para quien recibe tu contacto. Pero no es necesario rellenar todos los campos.`,
        },
        {
          title: "Dónde Colocar tu vCard QR",
          content: `En tu tarjeta de visita impresa (combina lo físico con lo digital). En tu firma de email. En tu perfil de LinkedIn.\n\nEn la puerta de tu oficina o comercio. En presentaciones y diapositivas. En tu stand de feria o exposición.`,
        },
      ]}
      faqs={[
        { q: "¿Es compatible con iOS y Android?", a: "Sí, la vCard es un formato estándar compatible con todos los sistemas operativos móviles." },
        { q: "¿Puedo actualizar mis datos sin cambiar el QR?", a: "No, los datos están grabados en el QR estático. Si cambias de teléfono, genera un nuevo código." },
        { q: "¿Puedo incluir foto de perfil?", a: "No en nuestra versión actual. La vCard incluye datos de texto: nombre, teléfono, email, web y dirección." },
        { q: "¿El QR vCard caduca?", a: "No, los QR estáticos son permanentes. Funcionan para siempre." },
        { q: "¿Qué tamaño debe tener para imprimir en una tarjeta?", a: "1.5×1.5 cm es suficiente en una tarjeta de visita estándar (85×55 mm). Colócalo en la esquina para no ocupar mucho espacio." },
      ]}
      ctaText="Crea tu código QR vCard gratis"
    />
  );
}
