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
    { time: language === "rw" ? "Mbe" : language === "fr" ? "Lun" : "Mon", bpm: 72 },
    { time: language === "rw" ? "Kab" : language === "fr" ? "Mar" : "Tue", bpm: 68 },
    { time: language === "rw" ? "Gat" : language === "fr" ? "Mer" : "Wed", bpm: 75 },
    { time: language === "rw" ? "Kan" : language === "fr" ? "Jeu" : "Thu", bpm: 70 },
    { time: language === "rw" ? "Gat" : language === "fr" ? "Ven" : "Fri", bpm: 73 },
    { time: language === "rw" ? "Tan" : language === "fr" ? "Sam" : "Sat", bpm: 69 },
    { time: language === "rw" ? "Cyu" : language === "fr" ? "Dim" : "Sun", bpm: 71 },
  ];

  const sleepData = [
    { day: language === "rw" ? "Mbe" : language === "fr" ? "Lun" : "Mon", hours: 7.5 },
    { day: language === "rw" ? "Kab" : language === "fr" ? "Mar" : "Tue", hours: 6.8 },
    { day: language === "rw" ? "Gat" : language === "fr" ? "Mer" : "Wed", hours: 8.2 },
    { day: language === "rw" ? "Kan" : language === "fr" ? "Jeu" : "Thu", hours: 7.1 },
    { day: language === "rw" ? "Gat" : language === "fr" ? "Ven" : "Fri", hours: 7.9 },
    { day: language === "rw" ? "Tan" : language === "fr" ? "Sam" : "Sat", hours: 8.5 },
    { day: language === "rw" ? "Cyu" : language === "fr" ? "Dim" : "Sun", hours: 8.0 },
  ];

  const stats = [
    { title: t("dashboard.heartRate"), value: "72 bpm", change: "+2%", icon: Heart, color: "text-red-500" },
    { title: t("dashboard.activity"), value: "8,234", change: "+12%", icon: Activity, color: "text-green-500" },
    { title: t("dashboard.sleep"), value: language === "rw" ? "7.5h" : "7.5 hrs", change: "+5%", icon: Moon, color: "text-blue-500" },
    { title: t("dashboard.progress"), value: "85%", change: "+8%", icon: TrendingUp, color: "text-purple-500" },
  ];

  const insights = [
    {
      title: language === "rw" ? "Iterambere ryiza! 🎉" : language === "fr" ? "Super progrès ! 🎉" : "Great progress! 🎉",
      description: language === "rw" ? "Imikorere +12%, icyuro cyiza cyane." :
        language === "fr" ? "Activité +12%, sommeil amélioré." :
        "Activity up 12%, excellent sleep quality.",
      type: "success" as const
    },
    {
      title: language === "rw" ? "Inama y'ubuzima" : language === "fr" ? "Conseil santé" : "Health Tip",
      description: language === "rw" ? "Sinzira saa cyane kugira ngo ubone energie nyinshi." :
        language === "fr" ? "Couche-toi à la même heure chaque soir." :
        "Go to bed at the same time daily for better recovery.",
      type: "tip" as const
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 pb-24 md:pb-12">
      <Navigation />

      <main className="container max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            {language === "rw" ? "Ikibaho cy'Ubuzima" : language === "fr" ? "Tableau de Bord" : "Health Dashboard"}
          </h1>
          <p className="mt-2 text-muted-foreground text-base md:text-lg">
            {language === "rw" ? "Reba uko ubuzima bwawe bumeze" : language === "fr" ? "Votre santé en un coup d'œil" : "Your health at a glance"}
          </p>
        </div>

        {/* Stats Grid - Mobile: 2 cols, Tablet: 2-4, Desktop: 4 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <Card
              key={i}
              className="p-5 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-card/80 backdrop-blur border border-border/50"
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`h-9 w-9 ${stat.color} opacity-90`} />
                  <span className={`text-sm font-bold ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.title}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts - Stack on mobile */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Heart Rate */}
          <Card className="p-5 md:p-6 shadow-xl bg-card/90 backdrop-blur border border-border/50">
            <h3 className="flex items-center gap-2 text-lg md:text-xl font-semibold mb-6">
              <Heart className="h-6 w-6 text-red-500" />
              {t("dashboard.heartRateTrends") || "Heart Rate Trends"}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={heartRateData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[60, 80]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", background: "hsl(var(--popover))" }}
                  labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                />
                <Line
                  type="monotone"
                  dataKey="bpm"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ fill: "#ef4444", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Sleep */}
          <Card className="p-5 md:p-6 shadow-xl bg-card/90 backdrop-blur border border-border/50">
            <h3 className="flex items-center gap-2 text-lg md:text-xl font-semibold mb-6">
              <Moon className="h-6 w-6 text-blue-500" />
              {t("dashboard.sleepQuality") || "Sleep Quality"}
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={sleepData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[5, 10]} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", background: "hsl(var(--popover))" }}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#3b82f6"
                  fill="#93c5fd"
                  strokeWidth={3}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Insights */}
        <Card className="p-6 shadow-xl bg-gradient-to-br from-primary/5 via-background to-secondary/5 border border-border/50">
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            {language === "rw" ? "Inama n'Ibimenyetso" : language === "fr" ? "Insights & Conseils" : "Insights & Tips"}
          </h3>
          <div className="space-y-4">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 border ${
                  insight.type === "success"
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 dark:from-green-950/30 dark:to-emerald-950/30"
                    : "bg-muted/70 border-border/50"
                }`}
              >
                <p className="font-semibold text-foreground">{insight.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;