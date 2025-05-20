import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";


// صفحات عامة

const Home = React.lazy(() => import("./components/Home/HomePage"));
const Navbar = React.lazy(() => import("./components/Navbar/Navbar"));
const Footer = React.lazy(() => import("./components/Footer/Footer"));
const AuthContainer = React.lazy(() =>
  import("./components/Login/AuthContainer")
);
const RegisterPartner = React.lazy(() =>
  import("./components/RegisterPartner/RegisterPartner")
);
const EquipmentCreationPage = React.lazy(() =>
  import("./components/EquipmentCreationPage/EquipmentCreationPage")
);
const EquipmentDetailPage = React.lazy(() =>
  import("./components/EquipmentDetailPage/EquipmentDetailPage")
);
const EquipmentEditPage = React.lazy(() =>
  import("./components/EquipmentEditPage/EquipmentEditPage")
);
const FavoritesPage = React.lazy(() =>
  import("./components/FavoritesPage/FavoritesPage")
);
const EquipmentCategoryPage = React.lazy(() =>
  import("./components/EquipmentCategoryPage/EquipmentCategoryPage")
);
const UserProfile = React.lazy(() =>
  import("./components/UserProfile/UserProfile")
);
const PartnerProfile = React.lazy(() =>
  import("./components/PartnerProfile/PartnerProfile")
);
const AboutUsPage = React.lazy(() =>
  import("./components/AboutUsPage/AboutUsPage")
);
const ContactUsPage = React.lazy(() =>
  import("./components/ContactUsPage/ContactUsPage")
);
const PaymentPage = React.lazy(() =>
  import("./components/PaymentPage/Payment")
);
const TestimonialsPage = React.lazy(() => import("./pages/TestimonialsPage"));

// الأدمن

const AdminDash = React.lazy(() =>
  import("./components/AdminDashboard/AdminDashboard")
);
const StatsPage = React.lazy(() =>
  import("./components/AdminDashboard/StatsPage")
);
const UsersPage = React.lazy(() =>
  import("./components/AdminDashboard/UsersPage")
);
const EquipmentPage = React.lazy(() =>
  import("./components/AdminDashboard/EquipmentPage")
);
const OrdersPage = React.lazy(() =>
  import("./components/AdminDashboard/OrdersPage")
);
const AdsApprovalPage = React.lazy(() =>
  import("./components/AdminDashboard/AdsApprovalPage")
);
const PartnersApprovalPage = React.lazy(() =>
  import("./components/AdminDashboard/PartnersApprovalPage")
);
const PaymentsPage = React.lazy(() =>
  import("./components/AdminDashboard/PaymentsPage")
);
const ContactMessagesPage = React.lazy(() =>
  import("./components/AdminDashboard/ContactMessagesPage")
);
const TestimonialsManagement = React.lazy(() =>
  import("./pages/AdminDashboard/TestimonialsManagement")
);

const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const noNavbarFooterPaths = [
    "/admin-dashboard",
    "/auth",
    "/Auth",
    "/register-partner",
    "/create-equipment",
    "/profile",
    "/partner",
    "/favorites",
    "/payment",
  ];
  const shouldShowNavbarAndFooter = !noNavbarFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );
  return (
    <div className="App font-cairo">
      {shouldShowNavbarAndFooter && (
        <Suspense fallback={<div>Loading Navbar...</div>}>
          <Navbar />
        </Suspense>
      )}
      {children}
      {shouldShowNavbarAndFooter && (
        <Suspense fallback={<div>Loading Footer...</div>}>
          <Footer />
        </Suspense>
      )}
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId="425777651473-t977gs9qm8tkg7c52j8fmognr5hqodvf.apps.googleusercontent.com">
      <Router>
        <ConditionalLayout>
          <Suspense fallback={<div>Loading...</div>}>
            <Routes>
              {/* صفحات عامة */}
              <Route path="/" element={<Home />} />
              <Route path="/Auth" element={<AuthContainer />} />

              <Route path="/register-partner" element={<RegisterPartner />} />
              <Route
                path="/create-equipment"
                element={<EquipmentCreationPage />}
              />
              <Route path="/equipment/:id" element={<EquipmentDetailPage />} />
              <Route
                path="/equipment/edit/:id"
                element={<EquipmentEditPage />}
              />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/categories" element={<EquipmentCategoryPage />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/partner/:id" element={<PartnerProfile />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/payment/:rentalId" element={<PaymentPage />} />
              <Route path="/testimonials" element={<TestimonialsPage />} />

              {/* لوحة تحكم الأدمن */}
              <Route path="/admin-dashboard" element={<AdminDash />}>
                <Route index element={<StatsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="equipment" element={<EquipmentPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="ads" element={<AdsApprovalPage />} />
                <Route path="partners" element={<PartnersApprovalPage />} />
                <Route path="payments" element={<PaymentsPage />} />
                <Route path="messages" element={<ContactMessagesPage />} />
                <Route
                  path="testimonials"
                  element={<TestimonialsManagement />}
                />
              </Route>
            </Routes>
          </Suspense>
        </ConditionalLayout>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
