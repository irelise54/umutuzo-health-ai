// src/pages/SignUpPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { Heart, User, Mail, Lock, ArrowRight } from "lucide-react";

const SignUpPage = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(language === "rw" ? "Amagambo y'ibanga ntayumvikana" : "Passwords do not match");
      return;
    }
    // Here you would register the user
    navigate("/signup");
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
            {language === "rw" ? "Rikora Konti"
              : language === "fr" ? "Créer un compte"
              : "Create Your Account"}
          </CardTitle>
          <CardDescription className="text-base">
            {language === "rw" ? "Tangira ubuzima bwawe bwiza hamwe natwe"
              : language === "fr" ? "Commencez votre parcours bien-être avec nous"
              : "Start your personalized mental wellness journey"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">{language === "rw" ? "Amazina" : "Full Name"}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder={language === "rw" ? "Amazina yawe yose" : "Votre nom complet"}
                  className="pl-10"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemple.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{language === "rw" ? "Ijambobanga" : "Password"}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  className="pl-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                {language === "rw" ? "Emeza Ijambobanga" : "Confirm Password"}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-12 text-lg font-medium" size="lg">
              {language === "rw" ? "Rikora Konti" : language === "fr" ? "Créer le compte" : "Create Account"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {language === "rw" ? "Ushobora konti?" : language === "fr" ? "Déjà un compte ?" : "Already have an account?"}{" "}
              <Link
                to="/signin"
                className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                {language === "rw" ? "Injira" : language === "fr" ? "Se connecter" : "Sign In"}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;