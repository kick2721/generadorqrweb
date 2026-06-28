import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Código QR para Tarjeta Digital | Tarjeta de Presentación",
  description: "Crea un código QR para tu tarjeta digital de presentación. Comparte todos tus datos: nombre, teléfono, email, empresa y más con un solo escaneo.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Tarjeta Digital"
      subtitle="Olvida las tarjetas de papel. Crea una tarjeta de presentación digital con QR que guarda tu contacto al instante."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Tarjeta Digital" },
      ]}
      sections={[
        {
          title: "¿Qué es una Tarjeta Digital QR?",
          content: `Es una tarjeta de presentación electrónica que se comparte mediante un código QR. En lugar de entregar una tarjeta de papel, la otra persona escanea el QR y guarda tu contacto directamente en la agenda del teléfono.\n\nIncluye todos los datos profesionales: nombre, empresa, cargo, teléfono, email, sitio web y dirección. Todo en formato vCard estándar, compatible con cualquier móvil.`,
        },
        {
          title: "Ventajas sobre la tarjeta de papel",
          content: `Nunca se acaban: no tienes que reimprimir cuando cambias de teléfono o cargo.\n\nSiempre actualizable: si usas QR dinámico, puedes modificar tus datos sin cambiar el QR.\n\nEcológica: ahorras papel y tinta. Una tarjeta digital no genera residuos.\n\nMás información: incluye más datos que caben en una tarjeta física (web, redes sociales, dirección completa).\n\nProfesional: das una imagen moderna e innovadora.`,
        },
        {
          title: "Dónde usar tu tarjeta digital",
          content: `En tu firma de correo electrónico. En tu perfil de LinkedIn. En tu sitio web personal o portafolio.\n\nEn presentaciones y diapositivas (al final de cada charla). En tu stand de ferias y conferencias. En tu CV digital.\n\nEn tu teléfono: muestra el QR en la pantalla para que otros lo escaneen directamente.`,
        },
        {
          title: "Editor visual incluido",
          content: `Nuestra herramienta incluye un editor visual con previsualización en vivo. Conforme escribes tus datos, ves cómo queda la tarjeta. Cuando esté lista, descargas el QR y el archivo .vcf.\n\nNo necesitas conocimientos técnicos: solo rellenar los campos y listo. El QR se genera automáticamente con todos tus datos.`,
        },
      ]}
      faqs={[
        { q: "¿Qué datos puede incluir?", a: "Nombre completo, empresa, cargo profesional, teléfono, email, sitio web y dirección. Todos son opcionales, incluye solo los que quieras compartir." },
        { q: "¿Funciona en cualquier teléfono?", a: "Sí, el formato vCard es un estándar universal. Funciona en iOS (Contactos), Android (Contactos de Google) y cualquier otro sistema." },
        { q: "¿Puedo actualizar mis datos sin cambiar el QR?", a: "Con nuestra suscripción Pro (QR dinámico), puedes modificar tus datos en cualquier momento. El QR siempre apunta a la versión actualizada." },
        { q: "¿Cómo se guarda el contacto?", a: "Al escanear el QR, ves una previsualización de la tarjeta. Pulsas 'Guardar contacto' y el teléfono añade los datos a tu agenda automáticamente." },
      ]}
      ctaText="Crea tu tarjeta digital gratis"
    />
  );
}
