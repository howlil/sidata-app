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
import PendaftaranTA from "./app/mahasiswa/pendaftaranTA/index";
import PengajuanTA from "./app/mahasiswa/pengajuanTA/index";
import Dokumen from "./app/mahasiswa/Dokumen/index";
import BimbingaTA from "./app/mahasiswa/bimbinganTA/index";
import ListKonsul from "./app/admin/konsul/index";
import DataDosen from "./app/admin/dataMaster/dosen/index";
import DataMhs from "./app/admin/dataMaster/mhs/index";
import ListTA from "./app/admin/TA/index";
import KelolaAkunDosen from "./app/admin/dataMaster/dosen/KelolaAkunDosen";
import KelolaAkunMhs from "./app/admin/dataMaster/mhs/KelolaAkunMhs";
import ChatBot from "./app/mahasiswa/chatBot/index";
import Dashboard from "./app/dosen/dashboard/index";
import BimbinganTA from "./app/dosen/bimbingan/index";
import DospemKelolaTA from "./app/dosen/TA/DospemKelolaTA";
import AjukanBimbingan from "./app/mahasiswa/bimbinganTA/AjukanBimbingan";
import DetailBimbingan from "./app/mahasiswa/bimbinganTA/DetailBimbingan";
import AjukanKonsultasi from "./app/mahasiswa/konsultasi/AjukanKonsultasi";
import DetailBimbinganMhs from "./app/dosen/bimbingan/DetailBimbinganMhs";
import HandleTA from "./app/dosen/TA/index";
import DetailKonsulMhs from "./app/admin/konsul/DetailKonsulMhs";
import DetailTAMhs from "./app/admin/TA/DetailTAMhs";

export default function App() {
  const ProtectedMhsDashboard = withRole(DashboardMhs, ["mahasiswa"]);
  const ProtectedAdminDashboard = withRole(DashboardAdmin, ["admin"]);
  const ProtectedDosenDashboard = withRole(Dashboard, ["dosen"]);
  const ProtectedPendaftaranTA = withRole(PendaftaranTA, ["mahasiswa"]);
  const ProtectedPengajuanTA = withRole(PengajuanTA, ["mahasiswa"]);
  const ProtectedDokumen = withRole(Dokumen, ["mahasiswa"]);
  const ProtectedBimbingaTA = withRole(BimbingaTA, ["mahasiswa"]);
  const ProtectedListKonsul = withRole(ListKonsul, ["admin"]);
  const ProtectedDataDosen = withRole(DataDosen, ["admin"]);
  const ProtectedDataMhs = withRole(DataMhs, ["admin"]);
  const ProtectedListTA = withRole(ListTA, ["admin"]);
  const ProtectedKelolaAkunDosen = withRole(KelolaAkunDosen, ["admin"]);
  const ProtectedKelolaAkunMhs = withRole(KelolaAkunMhs, ["admin"]);
  const ProtectedChatBot = withRole(ChatBot, ["mahasiswa"]);
  const ProtectedAjukanBimbingan = withRole(AjukanBimbingan, ["mahasiswa"]);
  const ProtectedDetailBimbingan = withRole(DetailBimbingan, ["mahasiswa"]);
  const ProtectedAjukanKonsultasi = withRole(AjukanKonsultasi, ["mahasiswa"]);
  const ProtectedDetailBimbinganMhs = withRole(DetailBimbinganMhs, ["dosen"]);
  const ProtectedHandleTA = withRole(HandleTA, ["dosen"]);
  const ProtectedDospemKelolaTA = withRole(DospemKelolaTA, ["dosen"]);
  const ProtectedDetailKonsulMhs = withRole(DetailKonsulMhs, ["admin"]);
  const ProtectedDetailTAMhs = withRole(DetailTAMhs, ["admin"]);

  return (
    <>
      <Router>
        <ActiveRouteProvider>
          <Routes>
            <Route path="/" element={<Navigate replace to="/login" />} />
            <Route path="/*" element={<NotFound />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/register" element={<Auth />} />
            <Route
              path="/ubahSandi"
              element={
                <ProtectRoute>
                  <UbahSandi />
                </ProtectRoute>
              }
            />
            <Route
              path="/infoProfil"
              element={
                <ProtectRoute>
                  <InfoProfile />
                </ProtectRoute>
              }
            />

            {/* mahasiswa */}
            <Route
              path="/mhs/dashboard"
              element={
                <ProtectRoute>
                  <ProtectedMhsDashboard />
                </ProtectRoute>
              }
            />
            <Route
              path="/mhs/pendaftaranTA"
              element={
                <ProtectRoute>
                  <ProtectedPendaftaranTA />
                </ProtectRoute>
              }
            />
            <Route
              path="/mhs/pengajuanTA"
              element={
                <ProtectRoute>
                  <ProtectedPengajuanTA />
                </ProtectRoute>
              }
            />
            <Route
              path="/mhs/dokumen"
              element={
                <ProtectRoute>
                  <ProtectedDokumen />
                </ProtectRoute>
              }
            />

            <Route
              path="/mhs/ajukanJadwalKonsultasi"
              element={
                <ProtectRoute>
                  <ProtectedAjukanKonsultasi />
                </ProtectRoute>
              }
            />

            <Route path="/mhs/bimbinganTA" element={
              <ProtectRoute>
                <ProtectedBimbingaTA />
              </ProtectRoute>
            } />
            <Route
              path="/mhs/bimbinganTA/ajukan"
              element={
                <ProtectRoute>
                  <ProtectedAjukanBimbingan />
                </ProtectRoute>
              }
            />
            <Route
              path="/mhs/bimbinganTA/:id"
              element={
                <ProtectRoute>
                  <ProtectedDetailBimbingan />
                </ProtectRoute>
              }
            />
            <Route
              path="/sidatabot"
              element={
                <ProtectRoute>
                  <ProtectedChatBot />
                </ProtectRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectRoute>
                  <ProtectedAdminDashboard />
                </ProtectRoute>
              }
            />
            <Route
              path="/admin/listMhsKonsul/:id"
              element={
                <ProtectRoute>
                  <ProtectedListKonsul />
                </ProtectRoute>
              }
            />

            <Route
              path="/admin/listMhsKonsul"
              element={
                <ProtectRoute>
                  <ProtectedListKonsul />
                </ProtectRoute>
              }
            />

            <Route
              path="/admin/listPendaftarTA"
              element={
                <ProtectRoute>
                  <ProtectedListTA />
                </ProtectRoute>
              }
            />
            <Route
              path="/admin/listPendaftarTA/:id"
              element={<DetailTAMhs />}
            />

            <Route path="/admin/data/dataMhs" element={<DataMhs />} />
            <Route path="/admin/data/dataDosen" element={<DataDosen />} />
            <Route
              path="/admin/data/dataDosen/tambahAkun"
              element={<KelolaAkunDosen />}
            />
            <Route
              path="/admin/data/dataMhs/tambahAkun"
              element={<KelolaAkunMhs />}
            />
            <Route
              path="/admin/data/dataMhs/editAkun/:id"
              element={<KelolaAkunMhs />}
            />
            <Route
              path="/admin/data/dataDosen/editAkun/:id"
              element={<KelolaAkunDosen />}
            />

            {/* Dosen */}
            <Route
              path="/dosen/dashboard"
              element={
                <ProtectRoute>
                  <ProtectedDosenDashboard />
                </ProtectRoute>
              }
            />
            <Route path="/dosen/kelolaTaMahasiswa" element={<HandleTA />} />
            <Route path="/dosen/detailTA/:id" element={<DospemKelolaTA />} />
            <Route path="/dosen/bimbinganMahasiswa" element={<BimbinganTA />} />
            <Route
              path="/dosen/bimbinganMahasiswa/:id"
              element={<DetailBimbinganMhs />}
            />

            {/* Tambahkan rute dosen di sini jika diperlukan */}
          </Routes>
        </ActiveRouteProvider>
      </Router>
    </>
  );
}
