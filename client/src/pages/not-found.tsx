import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function NotFound() {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-4`}>
      <motion.div 
        className="text-center"
        initial="hidden"
        animate="visible"
        variants={fadeIn('up', 0.3)}
      >
        <div className="flex flex-col items-center mb-8">
          <AlertCircle className="h-24 w-24 text-primary mb-4" />
          <h1 className="text-6xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>
          <p className="text-lg max-w-md mb-8">
            Maaf, halaman yang Anda cari tidak dapat ditemukan atau telah dipindahkan.
          </p>
          <Link href="/">
            <Button className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
