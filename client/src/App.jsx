import Login from "./page/Login";
import Landing from "./page/Landing";
import Register from "./page/Register";
import SuperAdminDashboard from "./page/SuperAdminDashboard";
import CompanyDashboard from "./page/CompanyDashboard";
import TeamDashboard from "./page/TeamDashboard";
import UserDashboard from "./page/UserDashboard";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import NewMemberJoinForm from "./components/NewMemberJoinForm";
import Footer from "./components/footer";
import ForgetPassPage from "./page/ForgetPassPage";
import ReSetPassPage from "./page/ReSetPassPage";
import AuthRoute from "./page/AuthRoute";
import AdminDetails from "./page/AdminDetails";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/forget-password" element={<ForgetPassPage />}></Route>
        <Route path="/reset-password" element={<ReSetPassPage />}></Route>
        <Route path="/memberJoin" element={<NewMemberJoinForm />}></Route>

        <Route
          path="/admin"
          element={
            <AuthRoute>
              <SuperAdminDashboard />
            </AuthRoute>
          }
        ></Route>

        <Route path="/admin/details/:userId" element={<AdminDetails />} />

        <Route
          path="/company"
          element={
            <AuthRoute>
              <CompanyDashboard />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/team"
          element={
            <AuthRoute>
              <TeamDashboard />
            </AuthRoute>
          }
        ></Route>
        <Route
          path="/user"
          element={
            <AuthRoute>
              <UserDashboard />
            </AuthRoute>
          }
        ></Route>
      </Routes>
      <Footer />

      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
