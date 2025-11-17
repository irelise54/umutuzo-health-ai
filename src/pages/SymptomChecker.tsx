import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const commonSymptoms = [
    "Headache",
    "Fever",
    "Cough",
    "Fatigue",
    "Nausea",
    "Sore throat",
    "Body aches",
    "Dizziness",
  ];

  const handleAnalyze = () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter at least one symptom to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      setResult({
        severity: "Moderate",
        possibleConditions: ["Common Cold", "Seasonal Flu", "Allergic Reaction"],
        recommendations: [
          "Rest and stay hydrated",
          "Monitor temperature regularly",
          "Consider over-the-counter pain relief",
          "Consult a doctor if symptoms worsen",
        ],
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const addSymptom = (symptom: string) => {
    setSymptoms((prev) => (prev ? `${prev}, ${symptom}` : symptom));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="mb-3 text-4xl font-bold tracking-tight">AI Symptom Checker</h1>
            <p className="text-lg text-muted-foreground">
              Describe your symptoms and get smart health insights
            </p>
          </div>

          <Card className="p-6 shadow-large hover-lift animate-fade-up">
            <div className="space-y-6">
              <div>
                <label className="mb-3 block text-sm font-medium">
                  Describe your symptoms
                </label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="e.g., I have a headache and feel tired..."
                  className="min-h-[120px] resize-none rounded-2xl border-input focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">Common symptoms:</p>
                <div className="flex flex-wrap gap-2">
                  {commonSymptoms.map((symptom) => (
                    <Badge
                      key={symptom}
                      variant="outline"
                      className="cursor-pointer rounded-full px-4 py-1.5 transition-all hover:bg-primary hover:text-primary-foreground"
                      onClick={() => addSymptom(symptom)}
                    >
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full gap-2 rounded-full py-6 text-base shadow-medium transition-all hover:shadow-large"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="h-5 w-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </div>
          </Card>

          {result && (
            <Card className="mt-6 p-6 shadow-large animate-scale-in">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-xl font-semibold">
                    <Info className="h-5 w-5 text-primary" />
                    Analysis Results
                  </h3>
                  <Badge
                    variant="outline"
                    className="rounded-full px-4 py-1.5 text-sm"
                  >
                    Severity: {result.severity}
                  </Badge>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Possible Conditions:</h4>
                  <ul className="space-y-2">
                    {result.possibleConditions.map((condition: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {condition}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 font-medium">Recommendations:</h4>
                  <ul className="space-y-3">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                        <span className="text-muted-foreground">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-muted p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Disclaimer:</strong> This is not medical advice. Always consult
                    a healthcare professional for proper diagnosis and treatment.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default SymptomChecker;
