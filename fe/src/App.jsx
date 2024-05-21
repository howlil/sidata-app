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

export default function App() {
  return (
    <>
      <Router>
        <ActiveRouteProvider>
          <Routes>
            <Route path="/*" element={<NotFound />} />
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route path="/ubahSandi" element={<UbahSandi />} />

            {/* mahasiswa */}
            <Route path="/mhs/dashboard" element={<DashboardMhs />} />
            {/* Admin */}
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            {/* Admin */}

            {/* Dosen */}
          </Routes>
        </ActiveRouteProvider>
      </Router>
    </>
  );
}
