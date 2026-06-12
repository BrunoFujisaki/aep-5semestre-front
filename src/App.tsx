import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { CitizenPage } from "./pages/CitizenPage";
import { HomePage } from "./pages/HomePage";
import { NewRequest } from "./pages/NewRequest";
import { SignInPage } from "./pages/SignInPage";
import { SignUpPage } from "./pages/SignUpPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { ReportsPage } from "./pages/admin/ReportsPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/sign-up",
    element: <SignUpPage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
  {
    path: "/new-request",
    element: <NewRequest />,
  },
  {
    element: <ProtectedRoute allowedRoles={["USER"]} />,
    children: [
      {
        path: "/citizen",
        element: <CitizenPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "reports",
            element: <ReportsPage />,
          },
          {
            path: "users",
            element: <UsersPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </>
  );
}

export default App;
