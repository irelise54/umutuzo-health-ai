import { Link, useLocation } from "react-router-dom";
import { Activity, LayoutDashboard, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

const Navigation = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Activity className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tracking-tight">UMUTUZO</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to="/symptom-checker">
            <Button
              variant={isActive("/symptom-checker") ? "default" : "ghost"}
              className={cn(
                "gap-2 transition-all duration-200",
                isActive("/symptom-checker") && "shadow-medium"
              )}
            >
              <Stethoscope className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.symptomChecker")}</span>
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              className={cn(
                "gap-2 transition-all duration-200",
                isActive("/dashboard") && "shadow-medium"
              )}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav.dashboard")}</span>
            </Button>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
