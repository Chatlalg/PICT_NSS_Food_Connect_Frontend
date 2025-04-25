import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "@/components/PrivateRoute.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NotFound from "./pages/not-found.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import VolunteerLayout from "./pages/volunteer/VolunteerLayout.jsx";
import PickupDetails from "./pages/volunteer/PickupDetails.jsx";
import Activities from "./pages/volunteer/Activities.jsx";
import Profile from "./pages/volunteer/Profile.jsx"; // Fix import – don't reuse VolunteerLayout here
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Volunteers from "./pages/admin/Volunteers.jsx";
import DonationDetail from "./pages/admin/DonationDetail.jsx";
import Donations from "./pages/admin/Donations.jsx";
import { Switch, Route } from "wouter";

function App() {
  return (
    <>
      <AuthProvider>
        <Switch>
          <Route path="/" component={LoginPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/signup" component={SignupPage} />

          <Route path="/admin/volunteers">
            <PrivateRoute>
              <AdminLayout>
                <Volunteers />
              </AdminLayout>
            </PrivateRoute>
          </Route>


          <Route path="/admin/donations">
            <PrivateRoute requiredRole="admin">
              <AdminLayout>
                <Donations />
              </AdminLayout>
            </PrivateRoute>
          </Route>
          <Route path="/admin/donations/:id">
            <PrivateRoute requiredRole="admin">
              <AdminLayout>
                <DonationDetail />
              </AdminLayout>
            </PrivateRoute>
          </Route>

          <Route path="/volunteer/pickup">
            <PrivateRoute>
              <VolunteerLayout>
                <PickupDetails />
              </VolunteerLayout>
            </PrivateRoute>
          </Route>

          <Route path="/volunteer/activities">
            <PrivateRoute>
              <VolunteerLayout>
                <Activities />
              </VolunteerLayout>
            </PrivateRoute>
          </Route>

          <Route path="/volunteer/profile">
            <PrivateRoute>
              <VolunteerLayout>
                <Profile />
              </VolunteerLayout>
            </PrivateRoute>
          </Route>

          <Route path="*" component={NotFound} />
        </Switch>
      </AuthProvider>
    </>
  );
}

export default App;
