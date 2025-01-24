"use client"

import Link from "next/link"

import { Logo } from "../common/Logo"
import { Container } from "./Container"
import { NavbarItem, navbarMenus } from "./Navbar"

const socialLinks = [
  {
    title: "Youtube",
    link: "/",
    // icon: YoutubeIcon,
  },
  {
    title: "Twitter",
    link: "/",
    // icon: XIcon,
  },
  {
    title: "Instagram",
    link: "/",
    // icon: InstagramIcon,
  },
]

export function Footer() {
  return (
    <footer className="bg-gradient-to-t from-slate-950 to-slate-800">
      <Container className="flex flex-col md:flex-row justify-between gap-16 pt-48 pb-32">
        <div>
          <Logo />
          {/* <Text className="max-w-sm my-3 text-slate-400">
            We&apos;re here to simplify web development, making it accessible
            and enjoyable for everyone.
          </Text> */}
        </div>

        <div className="grid grid-cols-2 gap-10">
          <ul className="space-y-6">
            {navbarMenus.map((item) => (
              <li key={item.href} className="flex items-center">
                <div className="size-9 hidden md:block"></div>
                <NavbarItem
                  {...item}
                  className="text-slate-400 hover:text-slate-50"
                />
              </li>
            ))}
          </ul>

          <div className="space-y-6">
            {socialLinks.map(({ title, link }) => (
              <Link
                key={title}
                href={link}
                className="flex items-center gap-3 group/socail"
                target="_blank"
              >
                <div className="rounded-md size-9 border border-slate-800 bg-slate-800/20 hover:bg-slate-800/80 relative hidden md:flex">
                  {/* <Icon className="size-5 shrink-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/socail:scale-0 group-hover/socail:opacity-0 transition-all duration-500" /> */}
                  {/* <RedirectIcon className="size-5 shrink-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 group-hover/socail:scale-100 group-hover/socail:opacity-100 transition-all duration-500 text-slate-50" /> */}
                </div>
                <p className="text-slate-400 group-hover/socail:text-slate-50">
                  {title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      <div className="bg-slate-900/50 py-6 border border-slate-800">
        <Container className="flex justify-between flex-col-reverse md:flex-row items-center gap-3">
          <p className="text-slate-600 text-sm">
            Career Edwise {new Date().getFullYear()} © All rights reserved.
          </p>
          <Link className="text-slate-600 text-sm" href="">
            Privacy Policy
          </Link>
        </Container>
      </div>
    </footer>
  )
}
