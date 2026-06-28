import Link from "next/link";

interface SeoSection {
  title: string;
  content: string;
}

interface FaqItem {
  q: string;
  a: string;
}

export default function SeoPage({ title, subtitle, breadcrumbs, sections, faqs, ctaText }: {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  sections: SeoSection[];
  faqs: FaqItem[];
  ctaText: string;
}) {
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      ...(b.href ? { item: `https://qrwing.com${b.href}` } : {}),
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <article className="max-w-4xl mx-auto px-4 py-8">
        <nav className="text-sm text-gray-400 mb-6 flex flex-wrap gap-1">
          {breadcrumbs.map((b, i) => (
            <span key={i}>
              {i > 0 && <span className="mx-1">›</span>}
              {b.href ? <Link href={b.href} className="hover:text-purple-600 transition-colors">{b.label}</Link> : <span className="text-gray-600">{b.label}</span>}
            </span>
          ))}
        </nav>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-lg text-gray-500 mb-12 max-w-3xl">{subtitle}</p>
        {sections.map((s, i) => (
          <section key={i} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">{s.title}</h2>
            {s.content.split("\n").filter(Boolean).map((p, j) => (
              <p key={j} className="text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{p}</p>
            ))}
          </section>
        ))}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Preguntas Frecuentes</h2>
          {faqs.map((f, i) => (
            <details key={i} className="group border-b border-gray-200 dark:border-gray-800 py-4">
              <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                {f.q}
                <svg className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </summary>
              <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </section>
        <div className="text-center bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 rounded-2xl p-8 sm:p-12">
          <h2 className="text-2xl font-bold mb-3">{ctaText}</h2>
          <p className="text-gray-500 mb-6">Es gratis y no requiere registro.</p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium bg-purple-600 text-white hover:bg-purple-700 transition duration-75 active:scale-[0.97]">
            Crear QR Gratis →
          </Link>
        </div>
      </article>
    </>
  );
}
