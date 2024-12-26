import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <Header />
      <main className="p-4 pt-28">{children}</main>
      <Footer />
    </div>
  );
}
