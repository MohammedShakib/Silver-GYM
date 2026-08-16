import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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

// Partner
import GymOwnerDashboard from './pages/partner/GymOwnerDashboard';
import ReceptionScanner  from './pages/partner/ReceptionScanner';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import FeaturePlaceholder from './components/common/FeaturePlaceholder';

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
    element: <MemberLayout />,
    children: [
      { index: true,                    element: <MemberHome /> },
      { path: 'explore',               element: <ExploreGyms /> },
      { path: 'gym/:id',               element: <GymDetails /> },
      { path: 'check-in/:id',          element: <CheckInFlow /> },
      { path: 'pass',                  element: <MyPass /> },
      { path: 'activity',              element: <Activity /> },
      { path: 'membership',            element: <Membership /> },
      { path: 'profile',               element: <Profile /> },
    ],
  },

  // ── Partner routes ──
  {
    path: '/partner',
    element: <GymOwnerLayout />,
    children: [
      { index: true,              element: <GymOwnerDashboard /> },
      { path: 'reception',       element: <ReceptionScanner /> },
      {
        path: 'checkins',
        element: (
          <FeaturePlaceholder
            title="Partner Check-Ins"
            description="Reception mode is working, but the historical partner check-in reporting screen is not built yet."
            backTo="/partner"
            backLabel="Back to Partner Dashboard"
          />
        ),
      },
      {
        path: 'analytics',
        element: (
          <FeaturePlaceholder
            title="Partner Analytics"
            description="This analytics screen is still pending implementation. The overview dashboard remains the working partner entry point."
            backTo="/partner"
            backLabel="Back to Partner Dashboard"
          />
        ),
      },
      {
        path: 'revenue',
        element: (
          <FeaturePlaceholder
            title="Partner Revenue"
            description="Revenue details are not wired yet. Estimated payout is available on the partner overview for now."
            backTo="/partner"
            backLabel="Back to Partner Dashboard"
          />
        ),
      },
      {
        path: 'reviews',
        element: (
          <FeaturePlaceholder
            title="Partner Reviews"
            description="Member review management has not been implemented yet. This route now resolves cleanly instead of 404ing."
            backTo="/partner"
            backLabel="Back to Partner Dashboard"
          />
        ),
      },
      {
        path: 'profile',
        element: (
          <FeaturePlaceholder
            title="Gym Profile"
            description="Gym profile editing is still a pending feature. The partner shell stays navigable, but this page is not yet operational."
            backTo="/partner"
            backLabel="Back to Partner Dashboard"
          />
        ),
      },
      {
        path: 'settings',
        element: (
          <FeaturePlaceholder
            title="Partner Settings"
            description="Partner settings are not connected yet. This placeholder keeps navigation honest while the feature is unfinished."
            backTo="/partner"
            backLabel="Back to Partner Dashboard"
          />
        ),
      },
    ],
  },

  // ── Admin routes ──
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
      {
        path: 'users',
        element: (
          <FeaturePlaceholder
            title="Admin Users"
            description="The admin users workspace is not implemented yet. The navigation now resolves without sending users to a missing route."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
      {
        path: 'gyms',
        element: (
          <FeaturePlaceholder
            title="Admin Gyms"
            description="Gym management is still pending. Use the overview page for the currently available admin data."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
      {
        path: 'applications',
        element: (
          <FeaturePlaceholder
            title="Gym Applications"
            description="The summary table exists on the admin overview, but the dedicated application workflow has not been implemented yet."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
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
      {
        path: 'reports',
        element: (
          <FeaturePlaceholder
            title="Reports"
            description="Scheduled reports and exports are not implemented yet. This route now fails gracefully."
            backTo="/admin"
            backLabel="Back to Admin Overview"
          />
        ),
      },
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

export default function App() {
  return <RouterProvider router={router} />;
}
