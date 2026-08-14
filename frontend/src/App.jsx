import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import MemberLayout from './layouts/MemberLayout';
import GymOwnerLayout from './layouts/GymOwnerLayout';
import AdminLayout from './layouts/AdminLayout';

import LandingPage from './pages/public/LandingPage';
import Onboarding from './pages/public/Onboarding';
import MemberHome from './pages/member/MemberHome';
import ExploreGyms from './pages/member/ExploreGyms';
import GymDetails from './pages/member/GymDetails';
import DigitalPass from './pages/member/DigitalPass';
import CheckInFlow from './pages/member/CheckInFlow';
import Activity from './pages/member/Activity';
import GymOwnerDashboard from './pages/partner/GymOwnerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'onboarding', element: <Onboarding /> },
    ],
  },
  {
    path: '/member',
    element: <MemberLayout />,
    children: [
      { index: true, element: <MemberHome /> },
      { path: 'explore', element: <ExploreGyms /> },
      { path: 'gym/:id', element: <GymDetails /> },
      { path: 'pass', element: <DigitalPass /> },
      { path: 'check-in/:id', element: <CheckInFlow /> },
      { path: 'activity', element: <Activity /> },
    ],
  },
  {
    path: '/partner',
    element: <GymOwnerLayout />,
    children: [
      { index: true, element: <GymOwnerDashboard /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <AdminDashboard /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
