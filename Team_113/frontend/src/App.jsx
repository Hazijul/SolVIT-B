import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Invoice from './pages/Invoice';
// import Dashboard from './pages/Dashboard';
import LoginOTPVerification from './pages/LoginOtpPage';
import PrivateRoute from './context/PrivateRoute';
import MainLayout from './pages/layout/MainLayout';

import Inventory from './pages/Inventory';
import { RoutesPathName } from './constants';
// import PrivateRoute from './context/PrivateRoute';


const router = createBrowserRouter([
  {
    path: RoutesPathName.SIGNUP_PAGE,
    element: <Register />,
  },
  {
    path: RoutesPathName.LOGIN_PAGE,
    element: <Login />,
  },
  {
    path: RoutesPathName.LoginOTPVerification_Page,
    element: <LoginOTPVerification />,
  },


  // {
  //   path: RoutesPathName.DASHBOARD_PAGE,
  //   element: (
  //     <PrivateRoute>
  //         <Dashboard />
  //     </PrivateRoute>
  //   ),
  // },
  {
   
    path: '/',
    element: (
      <PrivateRoute>
        {/* <Dashboard > */}
          <MainLayout />
        {/* </Dashboard> */}
      </PrivateRoute>
    ),
    children: [
      {
        path: RoutesPathName.Inventory_page,
        element: <Inventory />,
      },
      {
        path:RoutesPathName.Invoice_page,
        element: <Invoice />
      }
    ],
  },

]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
