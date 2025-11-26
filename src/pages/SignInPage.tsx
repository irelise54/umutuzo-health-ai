// src/pages/SignInPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Mail, Lock, ArrowRight } from "lucide-react";

const SignInPage = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would integrate with your auth system
    // For now, just go back to SymptomChecker
    navigate("/symptom-checker");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <Heart className="h-12 w-12 text-primary animate-heartbeat" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            {language === "rw" ? "Injira muri Konti Yawe"
              : language === "fr" ? "Connectez-vous à votre compte"
              : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-base">
            {language === "rw" ? "Fata ubuzima bwawe mu mutwe mu buryo bwihariye"
              : language === "fr" ? "Prenez soin de votre santé mentale de façon personnalisée"
              : "Continue your mental health journey with personalized care"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={language === "rw" ? "email@urugero.rw" : "exemple@email.com"}
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{language === "rw" ? "Ijambobanga" : "Mot de passe"}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium" size="lg">
              {language === "rw" ? "Injira" : language === "fr" ? "Se connecter" : "Sign In"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {language === "rw" ? "Nta konti ufite?" : language === "fr" ? "Pas encore de compte ?" : "Don't have an account?"}{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                {language === "rw" ? "Rikora Konti" : language === "fr" ? "Créer un compte" : "Create one"}
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-center text-xs text-muted-foreground">
              {language === "rw"
                ? "Ukomeza winjira, wemeye amategeko yacu n'ibanga ry'amakuru."
                : language === "fr"
                ? "En vous connectant, vous acceptez nos conditions et notre politique de confidentialité."
                : "By signing in, you agree to our Terms and Privacy Policy."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;