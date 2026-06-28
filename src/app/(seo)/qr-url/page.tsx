import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Generador de Código QR para URL | Enlace a tu Web",
  description: "Crea códigos QR para URLs gratis. Convierte cualquier enlace en un código QR personalizado con colores y logo.",
};

export default function Page() {
  return (
    <SeoPage
      title="Código QR para URL"
      subtitle="Convierte cualquier enlace en un código QR. Ideal para campañas, redes sociales y materiales impresos."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR URL" },
      ]}
      sections={[
        {
          title: "¿Qué es un código QR para URL?",
          content: `Un código QR para URL almacena una dirección web. Al escanearlo, el usuario es redirigido automáticamente a esa página en su navegador.\n\nEs el tipo de código QR más utilizado. Sirve para cualquier propósito: landing pages, tiendas online, perfiles de redes sociales, videos, documentos y más.`,
        },
        {
          title: "Usos Comunes",
          content: `Marketing: dirige a campañas y landing pages desde folletos, carteles y anuncios impresos.\n\nRestauración: enlaza al menú digital desde la mesa del restaurante.\n\nComercio: lleva clientes a tu tienda online desde el escaparate físico.\n\nEventos: comparte el programa, la web de registro o el mapa del recinto.`,
        },
        {
          title: "QR Estático vs Dinámico",
          content: `QR estático: la URL queda grabada en el código para siempre. No se puede modificar. Ideal para enlaces permanentes.\n\nQR dinámico (plan Pro): la URL se puede cambiar en cualquier momento. El código impreso sigue funcionando aunque cambies el destino. Además obtienes estadísticas de escaneo.`,
        },
        {
          title: "Consejos para Imprimir",
          content: `Tamaño mínimo recomendado: 2×2 cm para impresión cercana (flyers, tarjetas), 5×5 cm para carteles y 10+ cm para vallas publicitarias.\n\nUsa contraste suficiente entre fondo y módulos. Descarga en SVG para impresión profesional: es vectorial y escala sin pérdida. Siempre prueba el escaneo antes de imprimir en tirada grande.`,
        },
      ]}
      faqs={[
        { q: "¿Puedo usar mi propio dominio?", a: "Sí, introduce la URL completa de tu dominio en el campo de enlace y el QR redirigirá a ella." },
        { q: "¿El QR deja de funcionar si mi web cae?", a: "El QR siempre escanea correctamente, pero redirigirá a una web que no carga si el sitio está caído. El código no caduca." },
        { q: "¿Puedo añadir parámetros UTM al enlace?", a: "Sí, puedes incluir cualquier URL con parámetros. Todos los caracteres se codifican correctamente en el QR." },
        { q: "¿Cuántos caracteres puede tener la URL?", a: "Los QR pueden almacenar hasta 4296 caracteres alfanuméricos. Suficiente para cualquier URL estándar." },
        { q: "¿Puedo descargar el QR sin fondo?", a: "No directamente, pero puedes descargar en SVG y eliminar el fondo con cualquier editor vectorial." },
      ]}
      ctaText="Crea tu código QR para URL gratis"
    />
  );
}
