import {Footer, Navbar} from '@/layout'

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen" >
      {/* <Navbar /> */}
      {children}
      <Footer />
    </div>
  );
}