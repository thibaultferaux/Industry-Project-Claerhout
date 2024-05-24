import Image from "next/image";

const Header = () => (
  <header className="pt-8 pb-4 flex justify-between items-center">
    <h1 className="font-semibold text-h1 font-sans">RoofRadar</h1>
    <Image
      src="/claerhout-aluminium-logo.png"
      alt="Clearhout Aluminium logo"
      height={600}
      width={193}
      className="object-contain h-12 w-auto"
    />
  </header>
);

export default Header;
