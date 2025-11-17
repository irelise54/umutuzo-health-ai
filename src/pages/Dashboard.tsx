import Navigation from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, Moon } from "lucide-react";
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
  const heartRateData = [
    { time: "Mon", bpm: 72 },
    { time: "Tue", bpm: 68 },
    { time: "Wed", bpm: 75 },
    { time: "Thu", bpm: 70 },
    { time: "Fri", bpm: 73 },
    { time: "Sat", bpm: 69 },
    { time: "Sun", bpm: 71 },
  ];

  const sleepData = [
    { day: "Mon", hours: 7.5 },
    { day: "Tue", hours: 6.8 },
    { day: "Wed", hours: 8.2 },
    { day: "Thu", hours: 7.1 },
    { day: "Fri", hours: 7.9 },
    { day: "Sat", hours: 8.5 },
    { day: "Sun", hours: 8.0 },
  ];

  const stats = [
    {
      title: "Heart Rate",
      value: "72 bpm",
      change: "+2%",
      icon: Heart,
      color: "text-primary",
    },
    {
      title: "Activity",
      value: "8,234",
      change: "+12%",
      icon: Activity,
      color: "text-secondary",
    },
    {
      title: "Sleep",
      value: "7.5 hrs",
      change: "+5%",
      icon: Moon,
      color: "text-accent",
    },
    {
      title: "Progress",
      value: "85%",
      change: "+8%",
      icon: TrendingUp,
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-12">
        <div className="mb-8 animate-fade-in">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">Health Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Your weekly health overview
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
                  <p className="mt-2 text-sm text-accent">{stat.change} from last week</p>
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
              Heart Rate Trends
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-medium)",
                  }}
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
              Sleep Quality
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
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "var(--shadow-medium)",
                  }}
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
          <h3 className="mb-4 text-xl font-semibold">Health Insights</h3>
          <div className="space-y-4">
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
              <p className="font-medium">Great progress this week! 🎉</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your activity levels are up 12% and sleep quality has improved.
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <p className="font-medium">Recommendation</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try to maintain consistent sleep schedules for optimal recovery.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
