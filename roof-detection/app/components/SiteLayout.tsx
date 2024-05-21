interface SiteLayoutProps {
  children: React.ReactNode;
}

export const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => (
  <div className="w-screen h-screen text-primary-text">
    <div>
      <h1>RoofRadar</h1>
    </div>
    {children}
  </div>
);
