import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Activity,
  Sparkles,
  Shield,
  Smartphone,
  Heart,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import heroIllustration from "@/assets/hero-illustration.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Sparkles,
      title: t("feature.aiAnalysis"),
      description: t("feature.aiDescription"),
    },
    {
      icon: Heart,
      title: t("feature.monitoring"),
      description: t("feature.monitoringDescription"),
    },
    {
      icon: BarChart3,
      title: t("feature.dashboard"),
      description: t("feature.dashboardDescription"),
    },
    {
      icon: Shield,
      title: t("feature.privacy"),
      description: t("feature.privacyDescription"),
    },
    {
      icon: Smartphone,
      title: t("feature.mobile"),
      description: t("feature.mobileDescription"),
    },
    {
      icon: Activity,
      title: t("feature.realtime"),
      description: t("feature.realtimeDescription"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroIllustration} 
            alt="Health and wellness illustration" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>{t("hero.badge")}</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              {t("hero.title")}
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("hero.subtitle")}
              </span>
            </h1>
            
            <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
              {t("hero.description")}
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/symptom-checker">
                <Button
                  size="lg"
                  className="gap-2 rounded-full px-8 py-6 text-lg shadow-large transition-all hover:shadow-glow"
                >
                  {t("hero.getStarted")}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 rounded-full px-8 py-6 text-lg hover-lift"
                >
                  {t("hero.viewDashboard")}
                  <BarChart3 className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <div className="mb-16 text-center animate-fade-up">
          <h2 className="mb-4 text-4xl font-bold tracking-tight">
            {t("features.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("features.description")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group p-6 shadow-medium hover-lift animate-fade-up transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-3 transition-all group-hover:bg-primary/20">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container pb-20">
        <Card className="gradient-primary overflow-hidden p-12 text-center shadow-large animate-fade-up">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              {t("cta.title")}
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              {t("cta.description")}
            </p>
            <Link to="/symptom-checker">
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 rounded-full px-8 py-6 text-lg shadow-large transition-all hover:scale-105"
              >
                {t("cta.button")}
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Index;
