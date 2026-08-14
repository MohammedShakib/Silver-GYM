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

// Partner
import GymOwnerDashboard from './pages/partner/GymOwnerDashboard';
import ReceptionScanner  from './pages/partner/ReceptionScanner';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';

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
    ],
  },

  // ── Partner routes ──
  {
    path: '/partner',
    element: <GymOwnerLayout />,
    children: [
      { index: true,              element: <GymOwnerDashboard /> },
      { path: 'reception',       element: <ReceptionScanner /> },
    ],
  },

  // ── Admin routes ──
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
