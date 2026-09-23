import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import PublicLayout    from './layouts/PublicLayout';
import MemberLayout    from './layouts/MemberLayout';
import GymOwnerLayout  from './layouts/GymOwnerLayout';
import AdminLayout     from './layouts/AdminLayout';

// Public
import LandingPage     from './pages/public/LandingPage';

// Auth
import SignIn  from './pages/auth/SignIn';
import SignUp  from './pages/auth/SignUp';

// Onboarding
import Onboarding from './pages/onboarding/Onboarding';

// Member
import MemberHome    from './pages/member/MemberHome';
import ExploreGyms   from './pages/member/ExploreGyms';
import GymDetails    from './pages/member/GymDetails';
import CheckInFlow   from './pages/member/CheckInFlow';
import MyPass        from './pages/member/MyPass';
import Activity      from './pages/member/Activity';
import Membership    from './pages/member/Membership';
import Profile       from './pages/member/Profile';
import Checkout      from './pages/member/Checkout';
import PaymentVerification from './pages/member/PaymentVerification';
import SandboxCheckout from './pages/member/SandboxCheckout';
// Partner
import PartnerLayout from './components/partner/PartnerLayout';
import PartnerOverview from './pages/partner/PartnerOverview';
import ReceptionScanner from './pages/partner/ReceptionScanner';
import PartnerCheckIns from './pages/partner/PartnerCheckIns';
import PartnerAnalytics from './pages/partner/PartnerAnalytics';
import PartnerRevenue from './pages/partner/PartnerRevenue';
import PartnerReviews from './pages/partner/PartnerReviews';
import PartnerProfile from './pages/partner/PartnerProfile';
import PartnerStaff from './pages/partner/PartnerStaff';
import { PartnerGymProvider } from './context/PartnerGymContext';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminGyms from './pages/admin/AdminGyms';
import AdminApplications from './pages/admin/AdminApplications';
import AdminAuditLog from './pages/admin/AdminAuditLog';
import FeaturePlaceholder from './components/common/FeaturePlaceholder';

const FALLBACK_REDIRECT_KEY = 'silver-gym:spa-fallback-path';

function restoreSpaFallbackPath() {
  if (typeof window === 'undefined') {
    return;
  }

  const redirectedPath = window.sessionStorage.getItem(FALLBACK_REDIRECT_KEY);

  if (!redirectedPath) {
    return;
  }

  window.sessionStorage.removeItem(FALLBACK_REDIRECT_KEY);

  if (redirectedPath !== window.location.pathname + window.location.search + window.location.hash) {
    window.history.replaceState({}, '', redirectedPath);
  }
}

restoreSpaFallbackPath();

const router = createBrowserRouter([
  // ── Public routes ──
  {
    element: <PublicLayout />,
    children: [
      { path: '/',          element: <LandingPage /> },
    ],
  },

  // ── Auth (no shell layout) ──
  { path: '/sign-in',    element: <SignIn /> },
  { path: '/join',       element: <SignUp /> },
  { path: '/onboarding', element: <Onboarding /> },

  // ── Member routes ──
  {
    path: '/member',
    element: (
      <ProtectedRoute allowedRoles={['MEMBER']}>
        <MemberLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,                    element: <MemberHome /> },
      { path: 'explore',               element: <ExploreGyms /> },
      { path: 'gym/:id',               element: <GymDetails /> },
      { path: 'check-in/:id',          element: <CheckInFlow /> },
      { path: 'pass',                  element: <MyPass /> },
      { path: 'activity',              element: <Activity /> },
      { path: 'membership',            element: <Membership /> },
      { path: 'profile',               element: <Profile /> },
      { path: 'checkout',              element: <Checkout /> },
      { path: 'payment/verify',        element: <PaymentVerification /> },
    ],
  },

  // ── Sandbox Payment Provider (no layout) ──
  { path: '/sandbox/checkout', element: <SandboxCheckout /> },

  // ── Partner routes ──
  {
    path: '/partner',
    element: (
      <ProtectedRoute allowedRoles={['GYM_OWNER', 'ADMIN', 'GYM_STAFF']}>
        <PartnerGymProvider>
          <PartnerLayout />
        </PartnerGymProvider>
      </ProtectedRoute>
    ),
    children: [
      { index: true,              element: <PartnerOverview /> },
      { path: 'reception',       element: <ReceptionScanner /> },
      { path: 'check-ins',       element: <PartnerCheckIns /> },
      { path: 'analytics',       element: <PartnerAnalytics /> },
      { path: 'revenue',         element: <PartnerRevenue /> },
      { path: 'reviews',         element: <PartnerReviews /> },
      { path: 'profile',         element: <PartnerProfile /> },
      { path: 'staff',           element: <PartnerStaff /> }
    ],
  },

  // ── Admin routes ──
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['ADMIN']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'users', element: <AdminMembers /> },
      { path: 'gyms', element: <AdminGyms /> },
      { path: 'applications', element: <AdminApplications /> },
      {
        path: 'memberships',
        element: (
          <FeaturePlaceholder
            title="Admin Memberships"
            description="Membership management is not wired yet. This route is now handled explicitly so it does not fail silently."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
      {
        path: 'checkins',
        element: (
          <FeaturePlaceholder
            title="Platform Check-Ins"
            description="Detailed platform-wide check-in inspection is not implemented yet. The overview still shows headline metrics."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
      {
        path: 'transactions',
        element: (
          <FeaturePlaceholder
            title="Transactions"
            description="Transaction-level admin tooling is pending implementation."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
      {
        path: 'payouts',
        element: (
          <FeaturePlaceholder
            title="Payouts"
            description="Payout operations are not implemented yet. The overview still exposes platform-level revenue summaries."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
      { path: 'reports', element: <AdminAuditLog /> },
      {
        path: 'settings',
        element: (
          <FeaturePlaceholder
            title="Admin Settings"
            description="Admin settings are still pending implementation."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
    ],
  },
]);

import { LocationProvider } from './context/LocationContext';

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <RouterProvider router={router} />
      </LocationProvider>
    </AuthProvider>
  );
}
