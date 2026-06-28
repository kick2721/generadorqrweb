import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Código QR con Contraseña | Protege tu Contenido",
  description: "Crea códigos QR protegidos con contraseña. Solo quien tenga la clave podrá acceder al contenido. Seguridad para tus enlaces.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR con Contraseña"
      subtitle="Protege el contenido de tu QR con una contraseña. Solo las personas autorizadas podrán acceder."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR con Contraseña" },
      ]}
      sections={[
        {
          title: "¿Qué es un QR protegido?",
          content: `Es un código QR que requiere una contraseña para mostrar el contenido. Cuando alguien escanea el QR, ve una pantalla de bloqueo. Solo introduciendo la clave correcta accede al destino.\n\nEl contenido puede ser cualquier cosa: un enlace, un documento, un vídeo privado o información confidencial. La contraseña la eliges tú al crear el QR.`,
        },
        {
          title: "Usos habituales",
          content: `Menús de restaurantes con contenido exclusivo para clientes VIP.\n\nDocumentación interna de empresas: solo accesible para empleados.\n\nInvitaciones a eventos privados: el código en la invitación física lleva a la web del evento.\n\nOfertas y promociones exclusivas: solo quienes tienen la clave acceden al descuento.\n\nCV digital con sección privada: añade información adicional a la que solo lleguen reclutadores con la contraseña.`,
        },
        {
          title: "Cómo funciona",
          content: `Al crear el QR, introduces el destino y la contraseña. Nosotros generamos un código QR dinámico que apunta a nuestra plataforma.\n\nCuando alguien escanea, ve una pantalla con un campo de contraseña y una pista opcional. Si acierta, redirigimos al destino. Si no, no puede acceder.\n\nPuedes cambiar el destino o la contraseña en cualquier momento desde tu panel de control.`,
        },
      ]}
      faqs={[
        { q: "¿Es seguro?", a: "La contraseña se verifica en nuestro servidor antes de redirigir. No es seguridad militar, pero es suficiente para la mayoría de usos profesionales." },
        { q: "¿Puedo cambiar la contraseña después?", a: "Sí, con los QR dinámicos puedes cambiar tanto el destino como la contraseña cuando quieras desde tu panel." },
        { q: "¿Qué pasa si olvido la contraseña?", a: "Puedes cambiarla desde tu panel de control en cualquier momento. Nosotros no almacenamos las contraseñas en texto plano." },
        { q: "¿Puedo poner una pista?", a: "Sí, al crear el QR puedes añadir una pista opcional que se muestra junto al campo de contraseña." },
      ]}
      ctaText="Crea tu QR protegido gratis"
    />
  );
}
