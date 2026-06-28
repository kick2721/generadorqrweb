import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Códigos QR para Restaurantes | Menú Digital QR | Crea tu menú digital con códigos QR",
  description:
    "Crea códigos QR para tu restaurante: menú digital, WiFi, reservas, WhatsApp y más. Sin registro.",
};

export default function Page() {
  return (
    <SeoPage
      title="Códigos QR para Restaurantes"
      subtitle="Digitaliza tu restaurante con códigos QR. Menú digital, WiFi para clientes, enlace a WhatsApp para reservas, y más."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR para Restaurantes" },
      ]}
      sections={[
        {
          title: "Menú Digital con QR",
          content: `Reemplaza tus cartas físicas con un menú digital accesible mediante código QR. Tus clientes escanean el código con su móvil y ven el menú al instante.\n\nVentajas: actualizas precios y platos en tiempo real, sin imprimir de nuevo. Ahorras en impresión y tus clientes tienen una experiencia más higiénica al no manipular cartas físicas.\n\nAdemás, puedes crear diferentes códigos QR para menú del día, carta de vinos, postres o menú infantil. Cada uno redirige a una sección diferente de tu página.`,
        },
        {
          title: "WiFi para Clientes",
          content: `Comparte tu red WiFi con los clientes sin tener que repetir la contraseña. Un código QR WiFi escaneable desde cualquier móvil.\n\nConfiguras el SSID y la contraseña una sola vez. El código se puede imprimir en la mesa, en la carta o en la entrada del local. Clientes satisfechos que vuelven porque es cómodo.`,
        },
        {
          title: "Reservas por WhatsApp",
          content: `Facilita las reservas con un código QR que abre directamente un chat de WhatsApp con tu número. El cliente escribe su nombre, número de personas y hora.\n\nPuedes predefinir un mensaje como "Hola, quiero reservar para [número] personas el [día] a las [hora]". Así recibes reservas estructuradas y fáciles de gestionar.`,
        },
        {
          title: "Opiniones y Redes Sociales",
          content: `Crea códigos QR que enlacen a tu perfil de Google My Business, TripAdvisor o redes sociales. Un cliente satisfecho escanea y deja su opinión al instante.\n\nTambién puedes crear códigos para tu perfil de Instagram o TikTok, aumentando seguidores desde el propio local. Coloca el código en la cuenta o en el ticket de compra.`,
        },
        {
          title: "Más Usos para tu Restaurante",
          content: `Eventos especiales: crea un código QR para la carta de Navidad, San Valentín o menú degustación. Cada evento tiene su propio código.\n\nProgramas de fidelización: enlaza el QR a un formulario de registro para tu club de clientes. Ofertas y descuentos: dirige a los clientes a una landing page con promociones exclusivas.`,
        },
      ]}
      faqs={[
        { q: "¿Necesito registro para crear un QR?", a: "No. Puedes crear y descargar tu código QR en PNG o SVG sin crear una cuenta. Solo necesitas registro si quieres guardarlo y ver estadísticas." },
        { q: "¿Puedo actualizar el menú sin cambiar el QR?", a: "Sí, si usas un QR dinámico (plan Pro). El código siempre dirige a la misma URL; tú actualizas el contenido desde tu panel." },
        { q: "¿Qué tamaño debe tener el QR impreso?", a: "Para menús de mesa, recomendamos al menos 3×3 cm. Para carteles en pared, 5×5 cm o más. Siempre prueba el escaneo antes de imprimir en grande." },
        { q: "¿Puedo personalizar los colores del QR?", a: "Sí, puedes cambiar el color de fondo y el color de los módulos. También hay estilos de punto y esquinas para que combine con la identidad visual de tu restaurante." },
        { q: "¿Funciona con cualquier lector QR?", a: "Sí, los códigos generados siguen el estándar ISO 18004 y son compatibles con cualquier lector QR, incluidos los integrados en cámaras de iOS y Android." },
      ]}
      ctaText="Crea tu QR para restaurantes gratis"
    />
  );
}
