import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VisitorTracker from '@/components/shared/VisitorTracker';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <VisitorTracker />
      <main className="min-h-screen pt-16">{children}</main>
      <Footer />
    </>
  );
}
