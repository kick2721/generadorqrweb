import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para Texto | Texto Libre",
  description: "Crea códigos QR para texto gratis. Convierte cualquier mensaje en un código QR escaneable al instante.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para Texto"
      subtitle="Convierte cualquier mensaje en un código QR. Ideal para notas, instrucciones, mensajes cortos y más."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR Texto" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para Texto?",
          content: `Un código QR para texto almacena un mensaje de texto plano. Al escanearlo, el texto aparece directamente en la pantalla del usuario, sin necesidad de conexión a internet.\n\nEs útil para mensajes que deben leerse sin conexión: instrucciones, notas, mensajes promocionales, datos de contacto simples o cualquier información textual breve.`,
        },
        {
          title: "Ventajas del QR de Texto",
          content: `No requiere internet: el mensaje se almacena directamente en el código. El usuario escanea y lee, incluso sin datos móviles.\n\nSimplicidad máxima: no necesitas hosting, dominio ni página web. El texto viaja dentro del código.\n\nPrivacidad: al no enlazar a una URL, no hay tracking ni cookies. El mensaje es solo entre el código y el lector.`,
        },
        {
          title: "Usos Recomendados",
          content: `Instrucciones rápidas: cómo usar un producto, código de conducta, normas del local.\n\nMensajes promocionales: "Escanea y obtén un 10% de descuento en tu próxima compra".\n\nInformación de emergencia: números de contacto, direcciones, protocolos.\n\nPoemas, citas o frases: contenido literario o inspiracional en espacios públicos.`,
        },
        {
          title: "Límites del QR de Texto",
          content: `El código QR puede almacenar hasta 4296 caracteres alfanuméricos o 2953 bytes de datos binarios. Suficiente para párrafos largos.\n\nPara textos muy extensos, considera usar un QR URL que enlace a un documento online. El QR de texto es ideal para mensajes concisos.`,
        },
      ]}
      faqs={[
        { q: "¿Se necesita internet para leerlo?", a: "No. El texto está dentro del código. El usuario escanea y lo ve al instante, sin conexión." },
        { q: "¿Puedo editar el texto después de crear el QR?", a: "No, el QR de texto es estático. Para contenido editable usa QR dinámico (plan Pro)." },
        { q: "¿Qué caracteres puedo incluir?", a: "Cualquier texto Unicode: letras, números, símbolos, emojis y saltos de línea." },
        { q: "¿Cuánto texto puedo poner?", a: "Hasta 4296 caracteres. Para textos más largos, usa un QR URL que enlace a un documento." },
      ]}
      ctaText="Crea tu código QR de texto gratis"
    />
  );
}
