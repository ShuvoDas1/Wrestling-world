import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import { SOCIAL_LINKS } from "../../utils/constants/links";
import { RiFacebookFill } from "react-icons/ri";

const subFooterNavigationData: Array<{ label: string; href: string }> = [
  {
    label: "About Us",
    href: "/about-us",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Contact Us",
    href: "/contact-us",
  },
];

function Footer({ className }: { className?: string }) {
  return (
    <footer className={className}>
      <div className="bg-[#0E0E0E]">
        <div className="max-w-5xl mx-auto py-16">
          <div className="space-y-8">
            <div className="flex justify-center">
              <Logo size="xl" />
            </div>
            <div className="flex justify-center">
              <Link href={SOCIAL_LINKS.FACEBOOK}>
                <a
                  rel="noreferrer"
                  target="_blank"
                  className="text-white hover:text-main transition-colors bg-white/5 inline-block p-3"
                >
                  <RiFacebookFill aria-label="Facebook" className="w-5 h-5" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#0D0D0D]">
        <div className="max-w-5xl mx-auto py-3 ">
          <div className="md:flex text-center md:text-right justify-between text-xs text-white px-4 space-y-4 md:space-y-0">
            <p>Copyright © 2018. WrestlingWorld.Co. All Rights Reserved.</p>
            <div>
              <ul className="flex items-center text-xs justify-center md:justify-start space-x-4">
                {subFooterNavigationData.map(({ href, label }) => (
                  <li key={href} className="transition-colors hover:text-main">
                    <Link href={href}>
                      <a>{label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
