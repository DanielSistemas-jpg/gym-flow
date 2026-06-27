import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/lib/types";
import { Loader2 } from "lucide-react";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

import UserLayout from "@/components/layout/UserLayout";
import UserDashboard from "@/pages/user/Dashboard";
import UserMembership from "@/pages/user/Membership";
import UserAttendance from "@/pages/user/Attendance";
import UserEvents from "@/pages/user/Events";
import UserNotifications from "@/pages/user/Notifications";
import UserProfile from "@/pages/user/Profile";

import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminMembers from "@/pages/admin/Members";
import AdminAccess from "@/pages/admin/Access";
import AdminDevices from "@/pages/admin/Devices";
import AdminAlerts from "@/pages/admin/Alerts";
import AdminContent from "@/pages/admin/Content";

function Guard({ role, children }: { role: Role; children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role !== role)
    return <Navigate to={profile.role === "admin" ? "/admin" : "/app"} replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/app"
        element={
          <Guard role="user">
            <UserLayout />
          </Guard>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="membresia" element={<UserMembership />} />
        <Route path="asistencias" element={<UserAttendance />} />
        <Route path="eventos" element={<UserEvents />} />
        <Route path="notificaciones" element={<UserNotifications />} />
        <Route path="perfil" element={<UserProfile />} />
      </Route>

      <Route
        path="/admin"
        element={
          <Guard role="admin">
            <AdminLayout />
          </Guard>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="socios" element={<AdminMembers />} />
        <Route path="acceso" element={<AdminAccess />} />
        <Route path="dispositivos" element={<AdminDevices />} />
        <Route path="alertas" element={<AdminAlerts />} />
        <Route path="contenido" element={<AdminContent />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
