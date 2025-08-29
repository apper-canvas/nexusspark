import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import ContactsPage from "@/components/pages/ContactsPage";
import DealsPage from "@/components/pages/DealsPage";
import CompaniesPage from "@/components/pages/CompaniesPage";
import ActivitiesPage from "@/components/pages/ActivitiesPage";
import AnalyticsPage from "@/components/pages/AnalyticsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ContactsPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="deals" element={<DealsPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="activities" element={<ActivitiesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;