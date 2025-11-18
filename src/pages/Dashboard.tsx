import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, Moon } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const { t, language } = useLanguage();

  const heartRateData = [
    { time: language === "rw" ? "Ku wa mbere" : language === "fr" ? "Lun" : "Mon", bpm: 72 },
    { time: language === "rw" ? "Ku wa kabiri" : language === "fr" ? "Mar" : "Tue", bpm: 68 },
    { time: language === "rw" ? "Ku wa gatatu" : language === "fr" ? "Mer" : "Wed", bpm: 75 },
    { time: language === "rw" ? "Ku wa kane" : language === "fr" ? "Jeu" : "Thu", bpm: 70 },
    { time: language === "rw" ? "Ku wa gatanu" : language === "fr" ? "Ven" : "Fri", bpm: 73 },
    { time: language === "rw" ? "Ku wa gatandatu" : language === "fr" ? "Sam" : "Sat", bpm: 69 },
    { time: language === "rw" ? "Ku cyumweru" : language === "fr" ? "Dim" : "Sun", bpm: 71 },
  ];

  const sleepData = [
    { day: language === "rw" ? "Ku wa mbere" : language === "fr" ? "Lun" : "Mon", hours: 7.5 },
    { day: language === "rw" ? "Ku wa kabiri" : language === "fr" ? "Mar" : "Tue", hours: 6.8 },
    { day: language === "rw" ? "Ku wa gatatu" : language === "fr" ? "Mer" : "Wed", hours: 8.2 },
    { day: language === "rw" ? "Ku wa kane" : language === "fr" ? "Jeu" : "Thu", hours: 7.1 },
    { day: language === "rw" ? "Ku wa gatanu" : language === "fr" ? "Ven" : "Fri", hours: 7.9 },
    { day: language === "rw" ? "Ku wa gatandatu" : language === "fr" ? "Sam" : "Sat", hours: 8.5 },
    { day: language === "rw" ? "Ku cyumweru" : language === "fr" ? "Dim" : "Sun", hours: 8.0 },
  ];

  const stats = [
    {
      title: language === "rw" ? "Umuvuduko w'umutima" : language === "fr" ? "Rythme Cardiaque" : "Heart Rate",
      value: "72 bpm",
      change: "+2%",
      description: language === "rw" ? "kuva icyumweru gishize" : language === "fr" ? "depuis la semaine dernière" : "from last week",
      icon: Heart,
      color: "text-primary",
    },
    {
      title: language === "rw" ? "Imikorere" : language === "fr" ? "Activité" : "Activity",
      value: "8,234",
      change: "+12%",
      description: language === "rw" ? "kuva icyumweru gishize" : language === "fr" ? "depuis la semaine dernière" : "from last week",
      icon: Activity,
      color: "text-secondary",
    },
    {
      title: language === "rw" ? "Icyuro" : language === "fr" ? "Sommeil" : "Sleep",
      value: language === "rw" ? "amasaha 7.5" : language === "fr" ? "7.5 h" : "7.5 hrs",
      change: "+5%",
      description: language === "rw" ? "kuva icyumweru gishize" : language === "fr" ? "depuis la semaine dernière" : "from last week",
      icon: Moon,
      color: "text-accent",
    },
    {
      title: language === "rw" ? "Iterambere" : language === "fr" ? "Progrès" : "Progress",
      value: "85%",
      change: "+8%",
      description: language === "rw" ? "kuva icyumweru gishize" : language === "fr" ? "depuis la semaine dernière" : "from last week",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  const insights = [
    {
      title: language === "rw" ? "Iterambere ryiza muri iki cyumweru! 🎉" : 
              language === "fr" ? "Excellent progrès cette semaine ! 🎉" : 
              "Great progress this week! 🎉",
      description: language === "rw" ? "Imikorere yawe yiyongereye 12% kandi icyuro cyawe kirushije." :
              language === "fr" ? "Vos niveaux d'activité sont en hausse de 12% et la qualité du sommeil s'est améliorée." :
              "Your activity levels are up 12% and sleep quality has improved.",
      gradient: true
    },
    {
      title: language === "rw" ? "Inama" : language === "fr" ? "Recommandation" : "Recommendation",
      description: language === "rw" ? "Gerageza gukomeza gusinzira mu bihe bisanzwe kugirango ubashe kuvura neza." :
              language === "fr" ? "Essayez de maintenir des horaires de sommeil réguliers pour une récupération optimale." :
              "Try to maintain consistent sleep schedules for optimal recovery.",
      gradient: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            {language === "rw" ? "Ikibaho cy'Ubuzima" : language === "fr" ? "Tableau de Bord Santé" : "Health Dashboard"}
          </h1>
          <p className="text-lg text-muted-foreground">
            {language === "rw" ? "Incamake y'ubuzima bwawe bw'icyumweru" : 
             language === "fr" ? "Votre aperçu santé hebdomadaire" : 
             "Your weekly health overview"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-fade-up">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 shadow-medium hover-lift transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="mt-2 text-sm text-accent">
                    {stat.change} {stat.description}
                  </p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6 shadow-large hover-lift animate-fade-up">
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <Heart className="h-5 w-5 text-primary" />
              {language === "rw" ? "Imiterere y'Umuvuduko w'Umutima" : 
               language === "fr" ? "Tendances du Rythme Cardiaque" : 
               "Heart Rate Trends"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: language === "rw" ? "bpm" : language === "fr" ? "bpm" : "bpm",
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: "12px" }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-medium)",
                  }}
                  formatter={(value) => [value, language === "rw" ? "Umuvuduko w'umutima" : language === "fr" ? "Battements par minute" : "Heart Rate"]}
                  labelFormatter={(label) => `${language === "rw" ? "Umunsi" : language === "fr" ? "Jour" : "Day"}: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="bpm"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 shadow-large hover-lift animate-fade-up" style={{ animationDelay: "100ms" }}>
            <h3 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <Moon className="h-5 w-5 text-accent" />
              {language === "rw" ? "Ubwiza bwo Kuryama" : 
               language === "fr" ? "Qualité du Sommeil" : 
               "Sleep Quality"}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: language === "rw" ? "amasaha" : language === "fr" ? "heures" : "hours",
                    angle: -90,
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: "12px" }
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-medium)",
                  }}
                  formatter={(value) => [value, language === "rw" ? "amasaha" : language === "fr" ? "heures" : "hours"]}
                  labelFormatter={(label) => `${language === "rw" ? "Umunsi" : language === "fr" ? "Jour" : "Day"}: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="hsl(var(--accent))"
                  fill="hsl(var(--accent) / 0.2)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="mt-6 p-6 shadow-large animate-fade-up" style={{ animationDelay: "200ms" }}>
          <h3 className="mb-4 text-xl font-semibold">
            {language === "rw" ? "Ubwenge ku Buzima" : 
             language === "fr" ? "Informations Santé" : 
             "Health Insights"}
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-4 ${
                  insight.gradient 
                    ? "bg-gradient-to-r from-primary/10 to-secondary/10" 
                    : "bg-muted"
                }`}
              >
                <p className="font-medium">{insight.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;