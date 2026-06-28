import type { Metadata } from "next";
import SeoPage from "@/components/SeoPage";

export const metadata: Metadata = {
  title: "Códigos QR para Educación | Aulas y Recursos Digitales",
  description: "Crea códigos QR para educación: enlaces a recursos, tareas, exámenes online, biblioteca digital y más.",
};

export default function Page() {
  return (
    <SeoPage
      title="Códigos QR para Educación"
      subtitle="Transforma tus clases con códigos QR: acceso instantáneo a recursos, tareas digitales, biblioteca virtual y evaluación online."
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "QR para Educación" },
      ]}
      sections={[
        {
          title: "Recursos Didácticos con QR",
          content: `Comparte materiales educativos al instante. Cada código QR enlaza a un PDF, presentación, video o sitio web con contenido de la clase.\n\nLos estudiantes escanean desde su móvil o tablet y acceden al material sin escribir URLs largas. Ideal para talleres, laboratorios y actividades prácticas donde el tiempo es limitado.`,
        },
        {
          title: "Tareas y Exámenes Online",
          content: `Crea códigos QR para formularios de Google, exámenes online o plataformas educativas como Kahoot, Quizizz o Moodle.\n\nLos estudiantes acceden directamente sin buscar enlaces. Reduce el tiempo perdido en clase y aumenta el tiempo efectivo de aprendizaje.`,
        },
        {
          title: "Biblioteca Digital y Lecturas",
          content: `Digitaliza tu biblioteca con códigos QR. Cada libro o sección tiene un código que enlaza a la ficha del libro, versión digital o audiolibro.\n\nLos estudiantes descubren nuevas lecturas explorando físicamente la biblioteca y accediendo al contenido digital al instante.`,
        },
        {
          title: "Aulas Interactivas",
          content: `Coloca códigos QR por el aula que enlacen a contenidos interactivos: línea del tiempo, mapas conceptuales, laboratorios virtuales.\n\nCrea una gincana digital con códigos QR por diferentes estaciones. Cada código revela una pista o un contenido educativo.`,
        },
        {
          title: "Comunicación con Familias",
          content: `Comparte información con las familias mediante códigos QR: circulares, autorizaciones, calendario escolar, fotos de eventos.\n\nImprime los códigos en las comunicaciones en papel o pégalos en la puerta del aula. Las familias acceden al instante desde su móvil.`,
        },
      ]}
      faqs={[
        { q: "¿Es seguro usar QR con estudiantes?", a: "Sí, siempre que enlaces a contenido educativo y apropiado. Revisa siempre el destino antes de compartir el código." },
        { q: "¿Qué tipo de QR es mejor para educación?", a: "El QR URL es el más versátil. Sirve para enlazar a cualquier recurso online: PDF, video, formulario, presentación." },
        { q: "¿Puedo personalizar los QR para mi colegio?", a: "Sí, puedes cambiar colores y estilo para que coincidan con los colores del colegio o del aula." },
        { q: "¿Los estudiantes necesitan una app especial?", a: "No. La cámara de cualquier smartphone moderno lee códigos QR sin necesidad de apps adicionales." },
      ]}
      ctaText="Crea tu QR educativo gratis"
    />
  );
}
