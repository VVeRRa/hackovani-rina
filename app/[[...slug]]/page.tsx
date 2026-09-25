import type { Metadata } from 'next';
import { getAllDatoData } from '@/lib/datocms';
import { seoTranslations, type Language } from '@/lib/i18n';
import { MainLayout } from '@/components/MainLayout';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

function getLanguageFromSlug(slug?: string[]): Language {
  const candidate = slug?.[0];
  return candidate === 'en' || candidate === 'de' ? candidate : 'cs';
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = getLanguageFromSlug(resolvedParams?.slug);
  const seo = seoTranslations[lang];

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      title: seo.openGraphTitle,
      description: seo.openGraphDescription,
      images: [
        'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80',
      ],
    },
  };
}

export default async function CatchAllPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { siteInfo, products, pages, categories, hero } = await getAllDatoData();

  return (
    <MainLayout
      siteInfo={siteInfo}
      products={products}
      pages={pages}
      categories={categories}
      hero={hero}
      initialUrlSlug={resolvedParams?.slug}
    />
  );
}
