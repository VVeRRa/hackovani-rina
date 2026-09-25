import { Metadata } from 'next';
import { getAllDatoData, getDatoAcceptedFormsForAdmin } from '@/lib/datocms';
import { isAdminAuthenticated } from '@/lib/adminAuth';
import { AdminMaintenanceDashboard } from '@/components/AdminMaintenanceDashboard';
import { AdminLogin } from '@/components/AdminLogin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin | Háčkování Rina',
  description: 'Interní administrace webu Háčkování Rina.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLogin />;
  }

  const [data, acceptedForms] = await Promise.all([
    getAllDatoData(),
    getDatoAcceptedFormsForAdmin(),
  ]);

  const { siteInfo, products, pages, categories, hero } = data;

  return (
    <AdminMaintenanceDashboard
      initialSiteInfo={siteInfo}
      initialProducts={products}
      initialPages={pages}
      initialCategories={categories}
      initialAcceptedForms={acceptedForms}
      initialHero={hero}
    />
  );
}
