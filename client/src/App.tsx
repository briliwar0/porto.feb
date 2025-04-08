import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/Home";
import CustomCursor from "@/components/CustomCursor";

function App() {
  return (
    <>
      <CustomCursor />
      <Home />
      <Toaster />
    </>
  );
}

export default App;
