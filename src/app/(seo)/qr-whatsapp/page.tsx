import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para WhatsApp | Chat Directo",
  description: "Crea códigos QR para WhatsApp gratis. Tus clientes te escriben al instante sin guardar tu número.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para WhatsApp"
      subtitle="Conecta con tus clientes al instante. Crea un código QR que abre un chat de WhatsApp directo con tu número de negocio."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR WhatsApp" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para WhatsApp?",
          content: `Un código QR para WhatsApp contiene tu número de teléfono. Al escanearlo se abre automáticamente un chat de WhatsApp con ese número.\n\nEl usuario no necesita guardar tu contacto en su agenda. Solo escanea y empieza a escribir. Puedes predefinir un mensaje de bienvenida para que el cliente sepa cómo empezar.`,
        },
        {
          title: "Usos para tu Negocio",
          content: `Atención al cliente: los clientes te escriben directamente desde el escaparate, la web o el ticket de compra.\n\nReservas y pedidos: recibe pedidos y reservas por WhatsApp de forma estructurada con un mensaje predefinido.\n\nSoporte técnico: canal directo de soporte sin llamadas telefónicas.\n\nVentas: los clientes preguntan por productos y reciben atención personalizada al instante.`,
        },
        {
          title: "Mensaje Predefinido",
          content: `Puedes configurar un mensaje automático que aparezca en el chat al abrirlo. Por ejemplo: "Hola, quiero información sobre..." o "Hola, me gustaría hacer un pedido".\n\nEsto ayuda al cliente a saber qué escribir y a ti a recibir consultas estructuradas. El mensaje debe estar codificado en la URL, sin espacios ni caracteres especiales.`,
        },
        {
          title: "Dónde Colocarlo",
          content: `En el escaparate de tu tienda: los clientes te escriben aunque estés cerrado.\n\nEn la carta del restaurante: para reservas o consultas sobre alérgenos.\n\nEn facturas y tickets: servicio post-venta directo.\n\nEn redes sociales y web: canal de contacto adicional.\n\nEn packaging de producto: soporte y consultas post-venta.`,
        },
      ]}
      faqs={[
        { q: "¿Funciona si el usuario no tiene WhatsApp?", a: "No. El QR abre un chat de WhatsApp. El usuario debe tener WhatsApp instalado en su dispositivo." },
        { q: "¿Puedo usar un número internacional?", a: "Sí, incluye el código de país (+34 para España, +52 para México, etc.). El formato internacional funciona correctamente." },
        { q: "¿Puedo cambiar el número sin cambiar el QR?", a: "No, el número está grabado en el QR estático. Si cambias de número, genera un nuevo código." },
        { q: "¿Qué mensaje predefinido recomiendas?", a: "Elige uno corto que guíe al cliente. Ejemplo: \"Hola, quiero información\" o \"Hola, quiero hacer un pedido por favor\"." },
        { q: "¿Funciona con WhatsApp Business?", a: "Sí, el QR abre WhatsApp en cualquier versión: normal, Business o web." },
      ]}
      ctaText="Crea tu código QR WhatsApp gratis"
    />
  );
}
