import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import CustomCursor from "@/components/CustomCursor";
import { Route, Switch } from "wouter";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <>
      <CustomCursor />
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
      <Toaster />
    </>
  );
}

export default App;
