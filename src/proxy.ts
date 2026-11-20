// Maintenance gate: while the owner has switched the website off in the control
// panel (secret.thecorcare.com), every page and /api answers with the maintenance
// page / a 503. The privacy policy and account-deletion pages stay open: the
// App Store / Play listings link to them.
// Fails open; mock mode is untouched. See src/lib/maintenance.ts.
import { NextResponse, type NextRequest } from 'next/server';
import { createSwitchReader, isAlwaysOpen, maintenanceResponse } from '@/lib/maintenance';

const ALWAYS_OPEN = ['/privacy', '/delete-account'] as const;

const readSwitch = createSwitchReader({
  surface: 'website',
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_KEY,
});

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isAlwaysOpen(pathname, ALWAYS_OPEN)) return NextResponse.next();
  const state = await readSwitch();
  return state.enabled ? NextResponse.next() : maintenanceResponse(state.message, pathname);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|ico|txt|xml|webmanifest)$).*)'],
};
