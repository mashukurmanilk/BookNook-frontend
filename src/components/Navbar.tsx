"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import {
  BookOpen,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  LogOut,
  PlusCircle,
  BookmarkCheck,
  Library,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", isPrivate: false },
    { name: "All Books", href: "/books", isPrivate: false },
    { name: "Add Book", href: "/add-book", isPrivate: true },
    { name: "My Books", href: "/my-books", isPrivate: true },
    { name: "My Borrows", href: "/my-borrows", isPrivate: true },
  ];

  const visibleLinks = navLinks.filter((link) => !link.isPrivate || (link.isPrivate && user));

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Website Logo & Name */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-lg bg-foreground text-background flex flex-col items-center justify-center font-bold tracking-tighter transition-transform group-hover:scale-105">
                  <span className="text-xs uppercase tracking-widest leading-none">BN</span>
                  <BookOpen className="w-4 h-4 mt-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    BOOKNOOK
                  </span>
                  <span className="text-[10px] tracking-widest uppercase text-muted-foreground -mt-1 font-sans">
                    Online Library
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-4 py-1.5 text-xs lg:text-sm font-medium tracking-wide uppercase transition-all duration-200 rounded-full ${
                      isActive
                        ? "border border-foreground text-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Items */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Social links (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 text-muted-foreground mr-1">
                {/* Modern X logo */}
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X (formerly Twitter)"
                  className="p-1.5 hover:text-foreground transition-colors rounded-full hover:bg-muted"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="p-1.5 hover:text-foreground transition-colors rounded-full hover:bg-muted"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="p-1.5 hover:text-foreground transition-colors rounded-full hover:bg-muted"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>

              {/* Theme Toggle Button */}
              {mounted && (
                <button
                  type="button"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Toggle Theme"
                  className="p-2 rounded-full border border-border bg-card hover:bg-muted text-foreground transition-all duration-200"
                >
                  {theme === "dark" ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                </button>
              )}

              {/* Auth Section: Logged In vs Logged Out */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-border hover:border-foreground/40 bg-card transition-all"
                  >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900 flex items-center justify-center border border-border">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs font-semibold uppercase text-brand-700 dark:text-brand-300">
                          {user.name ? user.name[0] : user.email[0]}
                        </span>
                      )}
                    </div>
                    <span className="hidden sm:inline-block text-xs font-medium max-w-[100px] truncate text-foreground">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-border">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            setProfileModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-muted text-left transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                          <span>My Profile</span>
                        </button>

                        <Link
                          href="/add-book"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-muted text-left transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-muted-foreground" />
                          <span>Add New Book</span>
                        </Link>

                        <Link
                          href="/my-books"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-muted text-left transition-colors"
                        >
                          <Library className="w-4 h-4 text-muted-foreground" />
                          <span>My Books</span>
                        </Link>

                        <Link
                          href="/my-borrows"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-muted text-left transition-colors"
                        >
                          <BookmarkCheck className="w-4 h-4 text-muted-foreground" />
                          <span>My Borrows</span>
                        </Link>
                      </div>

                      <div className="border-t border-border pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-1.5 text-xs sm:text-sm font-medium text-foreground hover:text-brand-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-1.5 text-xs sm:text-sm font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-foreground hover:bg-muted"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-6 space-y-3">
            <nav className="flex flex-col space-y-1">
              {visibleLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {!user && (
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium border border-border rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2 text-sm font-medium bg-foreground text-background rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* User Profile Modal */}
      {profileModalOpen && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-card rounded-3xl p-6 sm:p-8 border border-border shadow-2xl">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900 border-2 border-brand-500 shadow-md mb-4 flex items-center justify-center">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="text-2xl font-bold uppercase text-brand-700 dark:text-brand-300">
                    {user.name ? user.name[0] : user.email[0]}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-2xl font-bold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>

              <div className="w-full mt-6 grid grid-cols-2 gap-3 text-left">
                <div className="p-3.5 rounded-2xl bg-muted/50 border border-border">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Role
                  </p>
                  <p className="text-sm font-semibold text-foreground mt-0.5">Library Member</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-muted/50 border border-border">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    Status
                  </p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    Active
                  </p>
                </div>
              </div>

              <div className="w-full mt-6 flex gap-3">
                <Link
                  href="/my-borrows"
                  onClick={() => setProfileModalOpen(false)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-xl bg-foreground text-background text-center hover:opacity-90 transition-opacity"
                >
                  View My Borrows
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setProfileModalOpen(false);
                    logout();
                  }}
                  className="py-2.5 px-4 text-xs font-semibold rounded-xl border border-rose-300 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
