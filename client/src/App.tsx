import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import Checkout from "@/pages/checkout";
import UIDemo from "@/pages/ui-demo";
import AdminDashboard from "@/pages/admin";
import DatabaseView from "@/pages/DatabaseView";
import AdminLogin from "@/pages/AdminLogin";
import CustomCursor from "@/components/CustomCursor";
import AutomaticUI from "@/components/AutomaticUI";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <>
      <CustomCursor />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/ui-demo" component={UIDemo} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/database">
          <ProtectedRoute>
            <DatabaseView />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <Toaster />
      <AutomaticUI />
    </>
  );
}

export default App;
