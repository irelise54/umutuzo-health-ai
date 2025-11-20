import { Link, useLocation } from "react-router-dom";
import { Heart, LayoutDashboard, Stethoscope, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      to: "/symptom-checker",
      icon: Stethoscope,
      label: t("nav.symptomChecker"),
    },
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      label: t("nav.dashboard"),
    },
  ];

  const NavContent = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={() => setOpen(false)}
          className="w-full"
        >
          <Button
            variant={isActive(item.to) ? "default" : "ghost"}
            className={cn(
              "w-full justify-start gap-3 text-left text-base h-12 px-4",
              "transition-all duration-200",
              isActive(item.to) && "shadow-lg"
            )}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
          </Button>
        </Link>
      ))}
      <div className="px-4 mt-4">
        <LanguageSwitcher />
      </div>
    </>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 -ml-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">UMUTUZO AI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-3">
          {navItems.map((item) => (
            <Link key={item.to} to={item.to}>
              <Button
                variant={isActive(item.to) ? "default" : "ghost"}
                className={cn(
                  "gap-2 transition-all duration-200 hover:scale-105",
                  isActive(item.to) && "shadow-lg"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Button>
            </Link>
          ))}
          <LanguageSwitcher />
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="sm:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 pt-12">
            <div className="flex flex-col gap-2">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navigation;