import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import AppLayout from "@/components/Layout/AppLayout";
import Home from "@/pages/Home";
import Records from "@/pages/SystemRecords";
import PricingHistory from "@/pages/PrincingHistory";
import Alchemy from "@/pages/Professions/Alchemy";
import Gemcutting from "@/pages/Professions/Gemcutting";
import Enchanting from "@/pages/Professions/Enchanting";
import Engineering from "@/pages/Professions/Engineering";
import Cooking from "@/pages/Professions/Cooking";
import Boes from "@/pages/Professions/Boes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/records" element={<Records />} />
            <Route path="/pricing" element={<PricingHistory />} />
            <Route path="/professions/alchemy" element={<Alchemy />} />
            <Route path="/professions/gemcutting" element={<Gemcutting />} />
            <Route path="/professions/enchanting" element={<Enchanting />} />
            <Route path="/professions/engineering" element={<Engineering />} />
            <Route path="/professions/cooking" element={<Cooking />} />
            <Route path="/professions/boes" element={<Boes />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
