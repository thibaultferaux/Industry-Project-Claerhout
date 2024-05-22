import Image from "next/image";

const Header = () => (
  <header className="pt-8 pb-4 flex justify-between items-center">
    <h1 className="font-semibold text-h1 font-sans">RoofRadar</h1>
    <Image
      src="/claerhout-aluminium-logo.png"
      alt="Clearhout Aluminium logo"
      height={200}
      width={150}
    />
  </header>
);

export default Header;
