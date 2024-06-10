"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ROUTES = [
  { name: "Home", href: "/" },
  { name: "Results", href: "/results" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="pt-8 pb-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-6 lg:space-x-10 items-baseline">
          <h1 className="font-semibold text-h2 lg:text-h1 font-sans pr-4 lg:pr-6">
            RoofRadar
          </h1>
          {ROUTES.map((route) => (
            <Link
              key={route.name}
              className={cn(
                "hidden md:block uppercase hover:text-primary-orange",
                pathname !== route.href && "text-opacity-40 text-secondary-text"
              )}
              href={route.href}
            >
              {route.name}
            </Link>
          ))}
        </div>
        <Image
          src="/claerhout-aluminium-logo.png"
          alt="Clearhout Aluminium logo"
          height={600}
          width={193}
          className="object-contain h-10 lg:h-12 w-auto"
        />
      </div>
      <div className="space-x-6 md:hidden">
        {ROUTES.map((route) => (
          <Link
            key={route.name}
            className={cn(
              "uppercase hover:text-primary-orange",
              pathname !== route.href && "text-opacity-40 text-secondary-text"
            )}
            href={route.href}
          >
            {route.name}
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;
