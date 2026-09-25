import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE } from '@/lib/adminAuth';
import { getAllDatoData, getDatoAcceptedFormsForAdmin } from '@/lib/datocms';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifyAdminSessionToken(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const [data, acceptedForms] = await Promise.all([
      getAllDatoData(true),
      getDatoAcceptedFormsForAdmin(),
    ]);

    return NextResponse.json(
      {
        siteInfo: data.siteInfo,
        products: data.products,
        pages: data.pages,
        categories: data.categories,
        hero: data.hero,
        acceptedForms,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Admin data refresh failed:', error);
    return NextResponse.json(
      { error: 'Admin data could not be refreshed.' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
