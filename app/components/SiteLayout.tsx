import Header from "./Header";

interface SiteLayoutProps {
  children: React.ReactNode;
}

const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => (
  <div className="w-screen h-screen text-primary-text font-light px-8 pb-8 md:px-20 md:pb-12 flex flex-col">
    <Header />
    {children}
  </div>
);

export default SiteLayout;
