'use client'

import { useState } from "react";
import { Code2, Menu, X, User, Users, Flame, LogOut } from "lucide-react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store/appStore";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAuthenticated = useAppStore((state) => state.isAuthenticated);
  const logout = useAppStore((state) => state.logout);
  const user = useAppStore((state) => state.currentUser);

  const handleLogout = () => {
    logout();
    toast.success("Logout successful");
    router.push("/login");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <nav className="bg-foreground text-white fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Code2 className="w-7 h-7 text-primary transition-transform duration-200 group-hover:scale-110" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              DevTinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link href="/#features" className="nav-link">
              Features
            </Link>
            <Link href="/#pricing" className="nav-link">
              Pricing
            </Link>

            {/* Auth Logic */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none focus:ring-2 focus:ring-primary/20 rounded-full">
                  <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary/30 transition-all duration-200">
                    <AvatarImage
                      src={user?.photoUrl || "https://github.com/shadcn.png"}
                      alt={user?.firstName || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user?.firstName?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent 
                  align="end" 
                  className="w-48 mt-2 bg-popover border border-border shadow-lg"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/connections" className="flex items-center gap-2 cursor-pointer">
                      <Users className="w-4 h-4" />
                      Connections
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link href="/swipe" className="flex items-center gap-2 cursor-pointer">
                      <Flame className="w-4 h-4" />
                      Swipe
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="nav-link">
                  Login
                </Link>
                <Link href="/register" className="btn-primary-gradient">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors duration-200"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-[73px] left-0 right-0 z-40 bg-background border-b border-border md:hidden transition-all duration-300 ease-out ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
          <Link
            href="/#features"
            className="mobile-menu-item"
            onClick={closeMobileMenu}
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="mobile-menu-item"
            onClick={closeMobileMenu}
          >
            Pricing
          </Link>

          <div className="h-px bg-border my-2" />

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                <User className="w-5 h-5" />
                Profile
              </Link>
              <Link
                href="/connections"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                <Users className="w-5 h-5" />
                Connections
              </Link>
              <Link
                href="/swipe"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                <Flame className="w-5 h-5" />
                Swipe
              </Link>

              <div className="h-px bg-border my-2" />

              <button
                onClick={handleLogout}
                className="mobile-menu-item text-destructive hover:text-destructive"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="mobile-menu-item"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="btn-primary-gradient text-center mt-2"
                onClick={closeMobileMenu}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;