import Link from "next/link"
import { Logo } from "@/components/logo"
import { UserNav } from "@/components/user-nav"

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/">
          <Logo />
        </Link>
        <UserNav />
      </div>
    </header>
  )
}
