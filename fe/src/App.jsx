import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Auth from "./app/auth";
import UbahSandi from "./app/auth/ubahsandi";
import DashboardMhs from "./app/mahasiswa/dashboard";
import DashboardAdmin from "./app/admin/dashboard";
import NotFound from "./NotFound";
import { ActiveRouteProvider } from "./utils/ActiveRouteContex";
import { ProtectRoute, withRole } from "./utils/ProtectRoute";
import InfoProfile from "./components/section/InfoProfile";
import PendaftaranTA from "./app/mahasiswa/pendaftaranTA";
import PengajuanTA from "./app/mahasiswa/pengajuanTA";
import Dokumen from "./app/mahasiswa/Dokumen";
import BimbingaTA from "./app/mahasiswa/bimbinganTA";

export default function App() {
  const ProtectedMhsDashboard = withRole(DashboardMhs, ["mahasiswa"]);
  const ProtectedAdminDashboard = withRole(DashboardAdmin, ["admin"]);

  return (
    <>
      <Router>
        <ActiveRouteProvider>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/*" element={<NotFound />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/ubahSandi" element={
            <ProtectRoute>
              <UbahSandi />
            </ProtectRoute>

            } />
            <Route path="/infoProfil" element={
            <ProtectRoute>
              <InfoProfile />
            </ProtectRoute>

            } />

            {/* mahasiswa */}
            {/* <Route
              path="/mhs/dashboard"
              element={
                <ProtectRoute>
                  <ProtectedMhsDashboard />
                </ProtectRoute>
              }
            /> */}
            <Route path="/mhs/dashboard" element={<DashboardMhs />} />
            <Route path="/mhs/pendaftaranTA" element={<PendaftaranTA />} />
            <Route path="/mhs/pengajuanTA" element={<PengajuanTA />} />
            <Route path="/mhs/dokumen" element={<Dokumen />} />
            <Route path="/mhs/bimbinganTA" element={<BimbingaTA />} />
            
            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectRoute>
                  <ProtectedAdminDashboard />
                </ProtectRoute>
              }
            />

            {/* Dosen */}
            {/* Tambahkan rute dosen di sini jika diperlukan */}
          </Routes>
        </ActiveRouteProvider>
      </Router>
    </>
  );
}
