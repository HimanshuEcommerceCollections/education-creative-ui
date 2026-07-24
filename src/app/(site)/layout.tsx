import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

/**
 * Layout for the public marketing site — wraps every page in the shared header
 * and footer. Auth routes live in the sibling `(auth)` group, which omits this
 * chrome intentionally.
 */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
