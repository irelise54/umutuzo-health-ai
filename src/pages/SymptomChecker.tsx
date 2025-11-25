import { useState, useRef, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Sparkles, 
  Info, 
  Heart, 
  MessageCircle, 
  Brain, 
  Zap, 
  Stethoscope,
  AlertTriangle,
  Clock,
  User,
  Bot,
  Trash2,
  Send,
  Plus,
  Shield,
  Activity,
  HeartPulse,
  Brain as BrainIcon,
  Activity as ActivityIcon,
  AlertCircle,
  Menu,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversation, setConversation] = useState<Array<{type: string, content: string, timestamp: Date}>>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("emotional");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Device detection
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Comprehensive Symptom Categories with translations
  const symptomCategories = {
    emotional: {
      name: language === "rw" ? "Ibimenyetso by'umutima" : 
            language === "fr" ? "Symptômes Émotionnels" : "Emotional Symptoms",
      icon: "💖",
      symptoms: [
        { name: language === "rw" ? "Ubwoba" : language === "fr" ? "Anxiété" : "Anxiety", icon: "😰" },
        { name: language === "rw" ? "Agahinda" : language === "fr" ? "Tristesse" : "Sadness", icon: "😔" },
        { name: language === "rw" ? "Guhindagurika mu mutima" : language === "fr" ? "Sautes d'humeur" : "Mood swings", icon: "🎭" },
        { name: language === "rw" ? "Kunenga" : language === "fr" ? "Se sentir submergé" : "Feeling overwhelmed", icon: "🌊" },
        { name: language === "rw" ? "Kurakara" : language === "fr" ? "Irritabilité" : "Irritability", icon: "😠" },
        { name: language === "rw" ? "Ubweryi" : language === "fr" ? "Solitude" : "Loneliness", icon: "👤" },
        { name: language === "rw" ? "Gutakaza umwete" : language === "fr" ? "Perte d'intérêt" : "Loss of interest", icon: "😐" }
      ]
    },
    physical: {
      name: language === "rw" ? "Ibimenyetso by'umubiri" : 
            language === "fr" ? "Symptômes Physiques" : "Physical Symptoms",
      icon: "💪",
      symptoms: [
        { name: language === "rw" ? "Imitsi" : language === "fr" ? "Maux de tête" : "Headaches", icon: "🤕" },
        { name: language === "rw" ? "Umunanizo" : language === "fr" ? "Fatigue" : "Fatigue", icon: "😴" },
        { name: language === "rw" ? "Gukomereka mu gituza" : language === "fr" ? "Serrement de poitrine" : "Chest tightness", icon: "❤️" },
        { name: language === "rw" ? "Kutagona neza" : language === "fr" ? "Problèmes de sommeil" : "Trouble sleeping", icon: "🌙" },
        { name: language === "rw" ? "Kuguruka k'umutima" : language === "fr" ? "Battements cardiaques rapides" : "Rapid heartbeat", icon: "💓" },
        { name: language === "rw" ? "Kudya nke" : language === "fr" ? "Perte d'appétit" : "Loss of appetite", icon: "🍽️" },
        { name: language === "rw" ? "Gukomera ku mitsi" : language === "fr" ? "Tension musculaire" : "Muscle tension", icon: "💪" }
      ]
    },
    mental: {
      name: language === "rw" ? "Ibimenyetso by'ubwenge" : 
            language === "fr" ? "Symptômes Mentaux / Cognitifs" : "Mental / Cognitive",
      icon: "🧠",
      symptoms: [
        { name: language === "rw" ? "Gutekereza cyane" : language === "fr" ? "Rumination" : "Overthinking", icon: "🤔" },
        { name: language === "rw" ? "Kudashobora kwitonda" : language === "fr" ? "Difficulté à se concentrer" : "Difficulty focusing", icon: "🎯" },
        { name: language === "rw" ? "Ibibazo bwo kwibuka" : language === "fr" ? "Problèmes de mémoire" : "Memory problems", icon: "📝" },
        { name: language === "rw" ? "Gutekereza byihuse" : language === "fr" ? "Pensées accélérées" : "Racing thoughts", icon: "💨" },
        { name: language === "rw" ? "Kumva udahuzwe" : language === "fr" ? "Se sentir déconnecté" : "Feeling disconnected", icon: "🔌" },
        { name: language === "rw" ? "Gutakaza ingufu" : language === "fr" ? "Faible motivation" : "Low motivation", icon: "🔋" }
      ]
    },
    behavioral: {
      name: language === "rw" ? "Ibimenyetso by'imyitwarire" : 
            language === "fr" ? "Symptômes Comportementaux" : "Behavioral Symptoms",
      icon: "👥",
      symptoms: [
        { name: language === "rw" ? "Kwihisha abantu" : language === "fr" ? "Se retirer des gens" : "Withdrawing from people", icon: "🚶" },
        { name: language === "rw" ? "Kuryama cyane" : language === "fr" ? "Trop dormir" : "Sleeping too much", icon: "🛌" },
        { name: language === "rw" ? "Kurya cyane cyangwa nke" : language === "fr" ? "Manger trop ou trop peu" : "Overeating or undereating", icon: "🍕" },
        { name: language === "rw" ? "Gukoresha telefone cyane" : language === "fr" ? "Utiliser trop le téléphone" : "Using phone too much", icon: "📱" },
        { name: language === "rw" ? "Kwirinda inshingano" : language === "fr" ? "Éviter les responsabilités" : "Avoiding responsibilities", icon: "📋" },
        { name: language === "rw" ? "Kurira" : language === "fr" ? "Crises de larmes" : "Crying spells", icon: "😢" }
      ]
    },
    crisis: {
      name: language === "rw" ? "Ibimenyetso by'ingorane" : 
            language === "fr" ? "Symptômes de Crise" : "Crisis Symptoms",
      icon: "🚨",
      symptoms: [
        { name: language === "rw" ? "Gutera ubwoba" : language === "fr" ? "Crises de panique" : "Panic attacks", icon: "😨" },
        { name: language === "rw" ? "Kumva udafite icyizere" : language === "fr" ? "Se sentir désespéré" : "Feeling hopeless", icon: "😞" },
        { name: language === "rw" ? "Kutashobora kuduhira" : language === "fr" ? "Incapable de se calmer" : "Unable to calm down", icon: "🌀" },
        { name: language === "rw" ? "Gutekereza kwiyica" : language === "fr" ? "Pensées d'automutilation" : "Thoughts of self-harm", icon: "⚠️", isHighRisk: true }
      ]
    },
    tags: {
      name: language === "rw" ? "Ibirango" : 
            language === "fr" ? "Tags Optionnels" : "Optional Tags",
      icon: "🏷️",
      symptoms: [
        { name: language === "rw" ? "Ishavu" : language === "fr" ? "Stress" : "Stress", icon: "😫" },
        { name: language === "rw" ? "Kunaniwa" : language === "fr" ? "Épuisement" : "Burnout", icon: "🔥" },
        { name: language === "rw" ? "Kuzimira ubwoba" : language === "fr" ? "Poussée d'anxiété" : "Anxiety flare-up", icon: "🌋" },
        { name: language === "rw" ? "Umunsi mubi" : language === "fr" ? "Mauvais jour" : "Bad day", icon: "☁️" },
        { name: language === "rw" ? "Gukorera cyane" : language === "fr" ? "Surmenage" : "Overworked", icon: "💼" },
        { name: language === "rw" ? "Gushaka ubufasha" : language === "fr" ? "Besoin de soutien" : "Need support", icon: "🤝" }
      ]
    }
  };

  // Enhanced auto-scroll to bottom of conversation
  useEffect(() => {
    const scrollToBottom = () => {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "nearest"
        });
      }, 100);
    };

    scrollToBottom();
  }, [conversation]);

  // Scroll when analysis starts
  useEffect(() => {
    if (isAnalyzing) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "nearest"
        });
      }, 150);
    }
  }, [isAnalyzing]);

  // Auto-resize textarea with mobile optimization
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, isMobile ? 120 : 150);
      textareaRef.current.style.height = newHeight + "px";
    }
  }, [symptoms, isMobile]);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) {
      toast({
        title: language === "rw" ? "Nyamuneka sobanura ibimenyetso" : 
               language === "fr" ? "Veuillez décrire vos symptômes" : "Please describe your symptoms",
        description: language === "rw" ? "Andika bimwe mu bimenyetso kugira ngo ubashe kubona ubufasha." :
               language === "fr" ? "Entrez au moins un symptôme pour obtenir de l'aide." : "Enter at least one symptom to get assistance.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsAnalyzing(true);
    const userMessage = { type: "user", content: symptoms, timestamp: new Date() };
    setConversation(prev => [...prev, userMessage]);
    setSymptoms(""); // Clear input immediately for better UX

    try {
      const response = await fetch("https://umutuzo-server-1.onrender.com/api/ai/symptoms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          symptoms,
          conversationId 
        }),
      });

      if (!response.ok) {
        throw new Error("AI API failed");
      }

      const data = await response.json();
      
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      const aiMessage = { 
        type: "ai", 
        content: data.response, 
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, aiMessage]);

      toast({
        title: language === "rw" ? "Gusuzuma Byarakozwe" : 
               language === "fr" ? "Analyse Terminée" : "Analysis Complete",
        description: language === "rw" ? "AI yasubije ibimenyetso byawe" :
               language === "fr" ? "L'IA a répondu à vos symptômes" : "AI has responded to your symptoms",
        duration: 2000,
      });

    } catch (error) {
      console.error(error);
      toast({
        title: language === "rw" ? "Ikibazo cyo guhuza" : 
               language === "fr" ? "Problème de Connexion" : "Connection Issue",
        description: language === "rw" ? "Ntibishoboke guhuza na serivisi ya AI. Nyamuneka ongera ugerageze." :
               language === "fr" ? "Impossible de se connecter au service IA. Veuillez réessayer." : "Unable to connect to AI service. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
      
      const errorMessage = { 
        type: "ai", 
        content: language === "rw" ? "Mbabarira, ariko ndangwa n'amakosa ya tekiniki none. Nyamuneka ongera ugerageze mu minsi mike cyangwa vugana n'abakozi b'ubuzima neza niba ibi bihutaye." :
               language === "fr" ? "Je m'excuse, mais je rencontre des difficultés techniques en ce moment. Veuillez réessayer dans un moment ou contactez directement les services de santé si c'est urgent." : 
               "I apologize, but I'm experiencing technical difficulties right now. Please try again in a moment or contact healthcare directly if this is urgent.", 
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addSymptom = (symptom: { name: string; icon: string; isHighRisk?: boolean }) => {
    if (symptom.isHighRisk) {
      toast({
        title: language === "rw" ? "Ubufasha bwa Mbere Buke" : 
               language === "fr" ? "Soutien d'Urgence Nécessaire" : "Emergency Support Needed",
        description: language === "rw" ? "Nyamuneka shaka ubufasha bwa mbere cyangwa hamagara serivisi z'ingorane." :
               language === "fr" ? "Veuillez contacter immédiatement des professionnels ou appeler les services d'urgence." : "Please seek immediate professional help or call emergency services.",
        variant: "destructive",
        duration: 5000,
      });
      
      // Add emergency message to conversation
      const emergencyMessage = language === "rw" 
        ? "🚨 INGORANE: Niba ufite ibitekerezo bwo kwiyica, nyamuneka hamagara serivisi z'ingorane byihuse cyanguga uguhe umutekano. Nturi wenyine kandi hari ubufasha." 
        : language === "fr" 
        ? "🚨 URGENCE: Si vous avez des pensées d'automutilation, veuillez contacter immédiatement les services d'urgence ou une ligne d'aide en cas de crise. Vous n'êtes pas seul et de l'aide est disponible."
        : "🚨 EMERGENCY: If you're having thoughts of self-harm, please contact emergency services immediately or reach out to a crisis helpline. You are not alone and there is help available.";
      
      setConversation(prev => [...prev, { type: "ai", content: emergencyMessage, timestamp: new Date() }]);
      return;
    }

    setSymptoms((prev) => (prev ? `${prev}, ${symptom.name}` : symptom.name));
    textareaRef.current?.focus();
  };

  const clearConversation = () => {
    setConversation([]);
    setConversationId(null);
    setSymptoms("");
    toast({
      title: language === "rw" ? "Ikiganiro Cyasibwe" : 
             language === "fr" ? "Conversation Effacée" : "Conversation Cleared",
      description: language === "rw" ? "Watangiye ikiganiro gishya" :
             language === "fr" ? "Nouvelle conversation commencée" : "Started a new conversation",
      duration: 2000,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Enhanced ChatMessage with better mobile optimization
  const ChatMessage = ({ type, content, timestamp }: { type: string, content: string, timestamp: Date }) => (
    <div className={cn(
      "flex gap-2 sm:gap-3 mb-3 sm:mb-4 animate-in fade-in duration-300",
      type === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {type === 'ai' && (
        <div className={cn(
          "flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg",
          isMobile ? "h-7 w-7" : isTablet ? "h-8 w-8" : "h-10 w-10"
        )}>
          <Bot className={cn(
            "text-white",
            isMobile ? "h-3 w-3" : isTablet ? "h-4 w-4" : "h-5 w-5"
          )} />
        </div>
      )}
      
      <div className={cn(
        "rounded-2xl sm:rounded-3xl px-3 py-2 sm:px-4 sm:py-3 md:px-5 md:py-4 shadow-sm transition-all duration-200 hover:shadow-md",
        type === 'user' 
          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md max-w-[85%] sm:max-w-[80%]' 
          : content.includes('🚨') 
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-bl-md max-w-[90%] sm:max-w-[85%]'
            : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-bl-md max-w-[90%] sm:max-w-[85%]'
      )}>
        <p className={cn(
          "leading-relaxed whitespace-pre-wrap break-words",
          isMobile ? "text-xs" : "text-sm"
        )}>{content}</p>
        <div className={cn(
          "flex items-center gap-1",
          isMobile ? "text-xs mt-1" : "text-xs mt-2",
          type === 'user' ? 'text-primary-foreground/70' : 'text-slate-500'
        )}>
          <Clock className={isMobile ? "h-2 w-2" : "h-3 w-3"} />
          {formatTime(timestamp)}
        </div>
      </div>
      
      {type === 'user' && (
        <div className={cn(
          "flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg",
          isMobile ? "h-7 w-7" : isTablet ? "h-8 w-8" : "h-10 w-10"
        )}>
          <User className={cn(
            "text-white",
            isMobile ? "h-3 w-3" : isTablet ? "h-4 w-4" : "h-5 w-5"
          )} />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Navigation />
      
      <main className="container py-3 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Enhanced Mobile Menu Button */}
          <div className="lg:hidden mb-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Enhanced Header with device-specific optimizations */}
          <div className={cn(
            "text-center animate-fade-in",
            isMobile ? "mb-4" : isTablet ? "mb-8" : "mb-12"
          )}>
            <div className={cn(
              "flex justify-center",
              isMobile ? "mb-3" : isTablet ? "mb-4" : "mb-6"
            )}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className={cn(
                  "relative bg-gradient-to-br from-white to-slate-100 rounded-xl border border-slate-200",
                  isMobile ? "p-3 shadow-lg" : 
                  isTablet ? "p-4 sm:p-5 shadow-xl" : 
                  "p-6 shadow-2xl sm:rounded-2xl md:rounded-3xl"
                )}>
                  <Heart className={cn(
                    "text-primary animate-heartbeat",
                    isMobile ? "h-8 w-8" : 
                    isTablet ? "h-10 w-10 sm:h-12 sm:w-12" : 
                    "h-16 w-16"
                  )} />
                  <Brain className={cn(
                    "text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                    isMobile ? "h-4 w-4" : 
                    isTablet ? "h-5 w-5 sm:h-6 sm:w-6" : 
                    "h-8 w-8"
                  )} />
                </div>
              </div>
            </div>
            <h1 className={cn(
              "font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-tight px-2",
              isMobile ? "text-xl mb-2" : 
              isTablet ? "text-2xl sm:text-3xl mb-3" : 
              "text-4xl lg:text-5xl mb-4"
            )}>
              {language === "rw" ? "Umufasha w'Ubuzima w'Ubwenge n'Umutima" : 
               language === "fr" ? "Assistant Santé Mentale et Cardiaque IA" : "Mental & Heart Health AI Assistant"}
            </h1>
            <p className={cn(
              "text-muted-foreground max-w-2xl mx-auto leading-relaxed",
              isMobile ? "text-xs px-2" : 
              isTablet ? "text-sm sm:text-base px-3" : 
              "text-lg lg:text-xl px-4"
            )}>
              {language === "rw" ? "Umufasha wawe w'ubwenge w'impuhwe wo gusobanukirwa ibimenyetso by'umutima, ubwenge n'umubiri" :
               language === "fr" ? "Votre partenaire IA compatissant pour comprendre les symptômes émotionnels, mentaux et physiques" : 
               "Your compassionate AI partner for understanding emotional, mental, and physical symptoms"}
            </p>
          </div>

          {/* Enhanced Main Layout with better device handling */}
          <div className={cn(
            "grid gap-4 lg:grid-cols-3",
            isMobile ? "gap-3" : isTablet ? "gap-5 sm:gap-6" : "gap-6"
          )}>
            {/* Chat Section - Enhanced for all devices */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card className={cn(
                "border-0 bg-white/80 backdrop-blur-sm overflow-hidden",
                isMobile ? "shadow-lg rounded-xl" :
                isTablet ? "shadow-xl sm:rounded-2xl" :
                "shadow-2xl md:rounded-3xl"
              )}>
                <CardHeader className={cn(
                  "bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60",
                  isMobile ? "pb-2" : isTablet ? "pb-3" : "pb-4"
                )}>
                  <div className={cn(
                    "flex justify-between",
                    isMobile ? "flex-col gap-2" : "flex-row sm:items-center gap-3"
                  )}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={cn(
                        "bg-primary/10 rounded-lg",
                        isMobile ? "p-1" : isTablet ? "p-1.5 sm:p-2" : "p-2"
                      )}>
                        <MessageCircle className={cn(
                          "text-primary",
                          isMobile ? "h-4 w-4" : isTablet ? "h-4 w-4 sm:h-5 sm:w-5" : "h-6 w-6"
                        )} />
                      </div>
                      <div>
                        <CardTitle className={cn(
                          "font-bold text-slate-800",
                          isMobile ? "text-base" : 
                          isTablet ? "text-lg sm:text-xl" : 
                          "text-xl lg:text-2xl"
                        )}>
                          {language === "rw" ? "Ikiganiro cy'Ubuzima" : 
                           language === "fr" ? "Conversation Santé" : "Health Conversation"}
                        </CardTitle>
                        <p className={cn(
                          "text-slate-600",
                          isMobile ? "text-xs mt-0.5" : "text-xs mt-1"
                        )}>
                          {conversation.length} {language === "rw" ? "ubutumwa" : language === "fr" ? "messages" : "messages"} • {language === "rw" ? "Isesengura ryuzuye rya AI" : language === "fr" ? "Analyse holistique IA" : "Holistic AI analysis"}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1",
                      isMobile ? "justify-end gap-1" : "gap-2"
                    )}>
                      {conversation.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearConversation}
                          className={cn(
                            "rounded-full border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200",
                            isMobile ? "text-xs h-7 px-2" : "text-xs h-8"
                          )}
                        >
                          <Trash2 className={cn("mr-1", isMobile ? "h-3 w-3" : "h-3 w-3")} />
                          {language === "rw" ? "Siba" : language === "fr" ? "Effacer" : "Clear"}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={cn(
                          "rounded-full border-slate-300 transition-all duration-200",
                          isMobile ? "text-xs h-7 px-2" : "text-xs h-8"
                        )}
                      >
                        {isExpanded ? 
                          (language === "rw" ? "Gutumba" : language === "fr" ? "Réduire" : "Collapse") : 
                          (language === "rw" ? "Gukura" : language === "fr" ? "Développer" : "Expand")}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className={cn(
                  isMobile ? "p-3" : isTablet ? "p-4" : "p-6"
                )}>
                  {/* Enhanced Conversation Area with device-specific heights */}
                  <ScrollArea 
                    ref={scrollAreaRef}
                    className={cn(
                      "border border-slate-200 bg-white/50 transition-all duration-300",
                      isMobile ? "rounded-lg p-2" : 
                      isTablet ? "rounded-xl p-3" : 
                      "rounded-2xl p-4",
                      isExpanded ? 
                        (isMobile ? "h-48" : isTablet ? "h-64 sm:h-72" : "h-80 lg:h-96") : 
                        (isMobile ? "h-32" : isTablet ? "h-48 sm:h-56" : "h-64 lg:h-80")
                    )}
                  >
                    {conversation.length === 0 ? (
                      <div className={cn(
                        "flex h-full flex-col items-center justify-center text-slate-500 text-center",
                        isMobile ? "p-3" : isTablet ? "p-4" : "p-6 lg:p-8"
                      )}>
                        <div className={cn(
                          "bg-slate-100 rounded-lg",
                          isMobile ? "p-2 mb-2" : 
                          isTablet ? "p-3 mb-3" : 
                          "p-4 mb-4 sm:rounded-xl md:rounded-2xl"
                        )}>
                          <HeartPulse className={cn(
                            "text-slate-400 mx-auto",
                            isMobile ? "h-6 w-6" : 
                            isTablet ? "h-8 w-8 sm:h-10 sm:w-10" : 
                            "h-10 w-10 lg:h-12 lg:w-12"
                          )} />
                        </div>
                        <h3 className={cn(
                          "font-semibold text-slate-700",
                          isMobile ? "text-sm mb-1" : 
                          isTablet ? "text-base mb-2" : 
                          "text-lg mb-2"
                        )}>
                          {language === "rw" ? "Tangira Ikiganiro cyawe cy'Ubuzima" : 
                           language === "fr" ? "Commencez Votre Conversation Santé" : "Start Your Health Conversation"}
                        </h3>
                        <p className={cn(
                          "text-slate-600 max-w-md leading-relaxed",
                          isMobile ? "text-xs" : "text-sm"
                        )}>
                          {language === "rw" ? "Sobanura ibimenyetso byawe by'umutima, ubwenge, cyangwa umubiri. Ndi hano kumva no gutanga ubufasha n'ubwenge." :
                           language === "fr" ? "Décrivez vos symptômes émotionnels, mentaux ou physiques. Je suis ici pour écouter et fournir un soutien compatissant et des conseils." : 
                           "Describe your emotional, mental, or physical symptoms. I'm here to listen and provide compassionate support and insights."}
                        </p>
                      </div>
                    ) : (
                      <div className={isMobile ? "space-y-1" : "space-y-2"}>
                        {conversation.map((msg, index) => (
                          <ChatMessage 
                            key={index} 
                            type={msg.type} 
                            content={msg.content} 
                            timestamp={msg.timestamp}
                          />
                        ))}
                        {isAnalyzing && (
                          <div className={cn(
                            "flex items-center bg-blue-50 border border-blue-200 animate-pulse",
                            isMobile ? "gap-2 p-2 rounded-lg" : 
                            isTablet ? "gap-3 p-3 rounded-xl" : 
                            "gap-3 p-4 rounded-2xl"
                          )}>
                            <div className={cn(
                              "bg-blue-100 rounded-full",
                              isMobile ? "p-1" : "p-2"
                            )}>
                              <Zap className={cn(
                                "text-blue-600 animate-spin",
                                isMobile ? "h-2 w-2" : 
                                isTablet ? "h-3 w-3" : 
                                "h-4 w-4"
                              )} />
                            </div>
                            <div className="flex-1">
                              <p className={cn(
                                "font-medium text-blue-800",
                                isMobile ? "text-xs" : "text-sm"
                              )}>
                                {language === "rw" ? "Gusuzuma ibimenyetso byawe..." : 
                                 language === "fr" ? "Analyse de vos symptômes..." : "Analyzing your symptoms..."}
                              </p>
                              <p className={cn(
                                "text-blue-600",
                                isMobile ? "text-xs mt-0.5" : "text-xs mt-1"
                              )}>
                                {language === "rw" ? "Bishobora gutora iminsi mike" : 
                                 language === "fr" ? "Cela peut prendre quelques instants" : "This may take a few moments"}
                              </p>
                            </div>
                            <div className={cn(
                              "flex",
                              isMobile ? "space-x-0.5" : "space-x-1"
                            )}>
                              {[0, 0.1, 0.2].map((delay) => (
                                <div 
                                  key={delay}
                                  className={cn(
                                    "bg-blue-600 rounded-full animate-bounce",
                                    isMobile ? "w-1 h-1" : 
                                    isTablet ? "w-1.5 h-1.5" : 
                                    "w-2 h-2"
                                  )}
                                  style={{animationDelay: `${delay}s`}}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Enhanced Input Area */}
                  <div className={cn(
                    "space-y-3",
                    isMobile ? "mt-3" : isTablet ? "mt-4" : "mt-6"
                  )}>
                    <div className="relative">
                      <Textarea
                        ref={textareaRef}
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder={language === "rw" 
                          ? "Sobanura ukuntu urumva... (urugero: 'Numvise ubwoba kandi ndagorwa no gusinzira icyumweru gishize...')" 
                          : language === "fr" 
                          ? "Décrivez comment vous vous sentez... (ex: 'Je me sens anxieux et j'ai du mal à dormir depuis une semaine...')"
                          : "Describe how you're feeling... (e.g., 'I've been feeling anxious and having trouble sleeping for the past week...')"}
                        className={cn(
                          "resize-none border-slate-300 bg-white/80 focus:bg-white transition-all duration-200 leading-relaxed",
                          isMobile ? 
                            "min-h-[60px] rounded-lg text-xs pr-8" :
                          isTablet ? 
                            "min-h-[80px] rounded-xl text-sm sm:text-base pr-10" :
                            "min-h-[100px] rounded-2xl text-base pr-12"
                        )}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAnalyze();
                          }
                        }}
                      />
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !symptoms.trim()}
                        size="icon"
                        className={cn(
                          "absolute bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none",
                          isMobile ? 
                            "bottom-1 right-1 h-6 w-6 rounded-md" :
                          isTablet ? 
                            "bottom-2 right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-lg" :
                            "bottom-3 right-3 h-8 w-8 lg:h-10 lg:w-10 rounded-xl"
                        )}
                      >
                        {isAnalyzing ? (
                          <Zap className={cn(
                            "animate-spin",
                            isMobile ? "h-2 w-2" : 
                            isTablet ? "h-3 w-3" : 
                            "h-4 w-4"
                          )} />
                        ) : (
                          <Send className={cn(
                            isMobile ? "h-2 w-2" : 
                            isTablet ? "h-3 w-3" : 
                            "h-4 w-4"
                          )} />
                        )}
                      </Button>
                    </div>

                    {/* Enhanced Quick Symptoms Section */}
                    <div className={cn(
                      "space-y-3",
                      isMobile ? "space-y-2" : "space-y-4"
                    )}>
                      <div className="flex items-center justify-between">
                        <p className={cn(
                          "font-semibold text-slate-700 flex items-center gap-1",
                          isMobile ? "text-xs gap-1" : "text-xs gap-2"
                        )}>
                          <Plus className={isMobile ? "h-3 w-3" : "h-3 w-3"} />
                          {language === "rw" ? "Ongeraho ibimenyetso byihuse" : 
                           language === "fr" ? "Ajouter Rapidement des Symptômes" : "Quick Add Symptoms"}
                        </p>
                        <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
                          {language === "rw" ? "Kanda kugira wongere" : language === "fr" ? "Cliquez pour ajouter" : "Click to add"}
                        </Badge>
                      </div>
                      
                      {/* Enhanced Category Tabs */}
                      <ScrollArea className="w-full">
                        <div className={cn(
                          "flex pb-2 min-w-max",
                          isMobile ? "space-x-1" : "space-x-2"
                        )}>
                          {Object.entries(symptomCategories).map(([key, category]) => (
                            <Button
                              key={key}
                              variant={activeCategory === key ? "default" : "outline"}
                              size="sm"
                              onClick={() => setActiveCategory(key)}
                              className={cn(
                                "rounded-full whitespace-nowrap transition-all duration-200 text-xs",
                                isMobile ? "h-7 px-2" : "h-7 px-2 sm:px-3",
                                activeCategory === key 
                                  ? "bg-primary text-primary-foreground shadow-sm" 
                                  : "border-slate-300 bg-white/80 hover:bg-slate-100"
                              )}
                            >
                              <span className={cn(
                                "mr-1",
                                isMobile ? "hidden" : "inline"
                              )}>{category.icon}</span>
                              <span className={cn(
                                isMobile ? "text-xs" : "text-xs"
                              )}>
                                {isMobile ? category.name.split(' ')[0] : category.name.split(' ')[0]}
                              </span>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Enhanced Symptoms Grid */}
                      <div className={cn(
                        "grid overflow-y-auto",
                        isMobile ? 
                          "grid-cols-2 gap-1 max-h-20" :
                        isTablet ? 
                          "grid-cols-3 gap-2 max-h-28 sm:max-h-32" :
                          "grid-cols-3 gap-2 max-h-32 md:max-h-40"
                      )}>
                        {symptomCategories[activeCategory as keyof typeof symptomCategories].symptoms.map((symptom) => (
                          <Badge
                            key={symptom.name}
                            variant="outline"
                            className={cn(
                              "cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 justify-center text-center rounded-full",
                              isMobile ? 
                                "px-1.5 py-1 text-xs" :
                              isTablet ? 
                                "px-2 py-1.5 text-xs" :
                                "px-3 py-2 text-xs",
                              symptom.isHighRisk
                                ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-400 hover:text-red-800"
                                : "border-slate-300 bg-white/80 hover:bg-primary hover:text-white hover:border-primary"
                            )}
                            onClick={() => addSymptom(symptom)}
                          >
                            <span className="text-xs">{symptom.icon}</span>
                            <span className="truncate text-xs">{symptom.name}</span>
                          </Badge>
                        ))}
                      </div>

                      {activeCategory === "crisis" && (
                        <div className={cn(
                          "bg-red-50 border border-red-200 animate-pulse",
                          isMobile ? "rounded-lg p-2" : 
                          isTablet ? "rounded-xl p-2 sm:p-3" : 
                          "rounded-2xl p-3"
                        )}>
                          <div className={cn(
                            "flex items-center gap-1 text-red-800",
                            isMobile ? "gap-1" : "gap-2"
                          )}>
                            <AlertCircle className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
                            <p className={cn(
                              "font-semibold",
                              isMobile ? "text-xs" : "text-xs"
                            )}>
                              {language === "rw" ? "Niba uri mu ngrorane, nyamuneka shaka ubufasha byihuse" :
                               language === "fr" ? "Si vous êtes en crise, veuillez chercher une aide immédiate" : 
                               "If you're in crisis, please seek immediate help"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Information Panel */}
            <div className={cn(
              "space-y-4 transition-all duration-300",
              isMobileMenuOpen ? "block lg:block" : "hidden lg:block",
              isMobile ? "space-y-3" : "sm:space-y-6"
            )}>
              <Card className={cn(
                "border-0 bg-gradient-to-br from-white to-blue-50/50 overflow-hidden",
                isMobile ? "shadow-lg rounded-xl" :
                isTablet ? "shadow-xl sm:rounded-2xl" :
                "shadow-2xl md:rounded-3xl"
              )}>
                <CardHeader className={cn(
                  isMobile ? "pb-2" : "pb-3 sm:pb-4"
                )}>
                  <CardTitle className={cn(
                    "flex items-center",
                    isMobile ? "gap-2 text-base" : "gap-2 sm:gap-3 text-lg sm:text-xl"
                  )}>
                    <div className={cn(
                      "bg-blue-100 rounded-xl",
                      isMobile ? "p-1.5" : "p-1.5 sm:p-2"
                    )}>
                      <Info className={cn(
                        "text-blue-600",
                        isMobile ? "h-4 w-4" : "h-4 w-4 sm:h-5 sm:w-5"
                      )} />
                    </div>
                    {language === "rw" ? "Uko Bikora" : language === "fr" ? "Comment Cela Fonctionne" : "How This Works"}
                  </CardTitle>
                </CardHeader>
                <CardContent className={cn(
                  "space-y-3",
                  isMobile ? "space-y-2" : "sm:space-y-4"
                )}>
                  {[
                    {
                      icon: MessageCircle,
                      title: language === "rw" ? "Ubufasha Buzuye" : language === "fr" ? "Soutien Holistique" : "Holistic Support",
                      description: language === "rw" ? "Suzuma ibimenyetso by'umutima, ubwenge n'umubiri hamwe." :
                               language === "fr" ? "Discutez des symptômes émotionnels, mentaux et physiques ensemble." : 
                               "Discuss emotional, mental, and physical symptoms together."
                    },
                    {
                      icon: HeartPulse,
                      title: language === "rw" ? "Kumenya Ubuzima bw'Ubwenge" : language === "fr" ? "Conscient de la Santé Mentale" : "Mental Health Aware",
                      description: language === "rw" ? "Yihariye mu buzima bw'umutima n'ibimenyetso by'ubwenge." :
                               language === "fr" ? "Spécialisé dans le bien-être émotionnel et les symptômes de santé mentale." : 
                               "Specialized in emotional wellbeing and mental health symptoms."
                    },
                    {
                      icon: BrainIcon,
                      title: language === "rw" ? "Ubwenge bwa AI" : language === "fr" ? "Conseils IA" : "AI-Powered Insights",
                      description: language === "rw" ? "Habwa isesengura rifite impuhwe ku bikoresho byawe." :
                               language === "fr" ? "Obtenez une analyse compatissante basée sur vos sentiments décrits." : 
                               "Get compassionate analysis based on your described feelings."
                    },
                    {
                      icon: Shield,
                      title: language === "rw" ? "Ubufasha bw'Ingorane" : language === "fr" ? "Soutien de Crise" : "Crisis Support",
                      description: language === "rw" ? "Ubuyobozi bwa mbere ku bihe by'ingorane." :
                               language === "fr" ? "Conseils immédiats pour les situations d'urgence." : 
                               "Immediate guidance for emergency situations."
                    }
                  ].map((item, index) => (
                    <div key={index} className={cn(
                      "flex items-start hover:bg-white/50 transition-all duration-200",
                      isMobile ? "gap-2 p-2 rounded-lg" : 
                      isTablet ? "gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl" : 
                      "gap-3 p-3 rounded-xl md:rounded-2xl"
                    )}>
                      <div className={cn(
                        "bg-slate-100 rounded-lg flex-shrink-0",
                        isMobile ? "p-1.5" : "p-1.5 sm:p-2"
                      )}>
                        <item.icon className={cn(
                          "text-slate-600",
                          isMobile ? "h-3 w-3" : "h-3 w-3 sm:h-4 sm:w-4"
                        )} />
                      </div>
                      <div>
                        <h4 className={cn(
                          "font-semibold text-slate-800",
                          isMobile ? "text-sm" : "text-sm"
                        )}>{item.title}</h4>
                        <p className={cn(
                          "text-slate-600",
                          isMobile ? "text-xs mt-0.5" : "text-xs mt-0.5"
                        )}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Enhanced Emergency Card */}
              <Card className={cn(
                "border-0 bg-gradient-to-br from-red-50 to-orange-50/50 overflow-hidden border-l-4 border-l-red-400",
                isMobile ? "shadow-lg rounded-xl" :
                isTablet ? "shadow-xl sm:rounded-2xl" :
                "shadow-2xl md:rounded-3xl"
              )}>
                <CardHeader className={cn(
                  isMobile ? "pb-2" : "pb-2 sm:pb-3"
                )}>
                  <CardTitle className={cn(
                    "flex items-center text-red-800",
                    isMobile ? "gap-2 text-base" : "gap-2 sm:gap-3 text-base sm:text-lg"
                  )}>
                    <AlertTriangle className={isMobile ? "h-4 w-4" : "h-4 w-4 sm:h-5 sm:w-5"} />
                    {language === "rw" ? "Ubufasha bw'Ingorane" : language === "fr" ? "Soutien de Crise" : "Crisis Support"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    "text-red-700",
                    isMobile ? "text-xs mb-2" : "text-xs sm:text-sm mb-2 sm:mb-3"
                  )}>
                    {language === "rw" ? "Niba ubonye bimwe mu bimenyetso by'ingorane:" :
                     language === "fr" ? "Si vous éprouvez des symptômes de crise :" : 
                     "If you're experiencing any crisis symptoms:"}
                  </p>
                  <ul className={cn(
                    "text-red-600 space-y-1 mb-2",
                    isMobile ? "text-xs space-y-1 mb-2" : "text-xs space-y-1 sm:space-y-2 mb-2 sm:mb-3"
                  )}>
                    <li className="flex items-start gap-1 sm:gap-2">
                      <div className={cn(
                        "bg-red-500 rounded-full flex-shrink-0 mt-1",
                        isMobile ? "w-1 h-1 mt-1" : "w-1.5 h-1.5 mt-1.5"
                      )}></div>
                      {language === "rw" ? "Hamagara serivisi z'ingorane (911) byihuse" :
                       language === "fr" ? "Appelez les services d'urgence (911) immédiatement" : 
                       "Call emergency services (911) immediately"}
                    </li>
                    <li className="flex items-start gap-1 sm:gap-2">
                      <div className={cn(
                        "bg-red-500 rounded-full flex-shrink-0 mt-1",
                        isMobile ? "w-1 h-1 mt-1" : "w-1.5 h-1.5 mt-1.5"
                      )}></div>
                      {language === "rw" ? "Umurongo wo gufasha mu ngrorane: Andika HOME kuri 741741" :
                       language === "fr" ? "Ligne de crise par texto : Textez HOME au 741741" : 
                       "Crisis Text Line: Text HOME to 741741"}
                    </li>
                    <li className="flex items-start gap-1 sm:gap-2">
                      <div className={cn(
                        "bg-red-500 rounded-full flex-shrink-0 mt-1",
                        isMobile ? "w-1 h-1 mt-1" : "w-1.5 h-1.5 mt-1.5"
                      )}></div>
                      {language === "rw" ? "Umurongo wo kurinda abiyica: 988" :
                       language === "fr" ? "Ligne nationale de prévention du suicide : 988" : 
                       "National Suicide Prevention Lifeline: 988"}
                    </li>
                  </ul>
                  <div className={cn(
                    "bg-white/50 border border-red-200",
                    isMobile ? "rounded-md p-1.5" : "rounded-md sm:rounded-lg p-1.5 sm:p-2"
                  )}>
                    <p className={cn(
                      "text-red-700 text-center font-semibold",
                      isMobile ? "text-xs" : "text-xs"
                    )}>
                      {language === "rw" ? "Nturi wenyine. Hari ubufasha buri gihe." :
                       language === "fr" ? "Vous n'êtes pas seul. De l'aide est disponible 24h/24." : 
                       "You are not alone. Help is available 24/7."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Stats Card */}
              {conversation.length > 0 && (
                <Card className={cn(
                  "border-0 bg-gradient-to-br from-slate-50 to-slate-100/50 overflow-hidden",
                  isMobile ? "shadow-lg rounded-xl" :
                  isTablet ? "shadow-xl sm:rounded-2xl" :
                  "shadow-xl md:rounded-3xl"
                )}>
                  <CardHeader className={cn(
                    isMobile ? "pb-2" : "pb-2 sm:pb-3"
                  )}>
                    <CardTitle className={cn(
                      "flex items-center",
                      isMobile ? "gap-1 text-base" : "gap-1 sm:gap-2 text-base sm:text-lg"
                    )}>
                      <Activity className={isMobile ? "h-4 w-4" : "h-4 w-4 sm:h-5 sm:w-5 text-slate-600"} />
                      {language === "rw" ? "Imibare y'Ikiganiro" : language === "fr" ? "Statistiques de Conversation" : "Conversation Stats"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={cn(
                      "grid text-center",
                      isMobile ? "grid-cols-2 gap-2" : "grid-cols-2 gap-2 sm:gap-3"
                    )}>
                      <div className={cn(
                        "bg-white rounded-lg shadow-sm",
                        isMobile ? "p-2" : "p-2 sm:p-3"
                      )}>
                        <div className={cn(
                          "font-bold text-slate-800",
                          isMobile ? "text-lg" : "text-lg sm:text-xl md:text-2xl"
                        )}>{conversation.length}</div>
                        <div className="text-xs text-slate-600">
                          {language === "rw" ? "Ubutumwa Bwose" : language === "fr" ? "Messages Totaux" : "Total Messages"}
                        </div>
                      </div>
                      <div className={cn(
                        "bg-white rounded-lg shadow-sm",
                        isMobile ? "p-2" : "p-2 sm:p-3"
                      )}>
                        <div className={cn(
                          "font-bold text-slate-800",
                          isMobile ? "text-lg" : "text-lg sm:text-xl md:text-2xl"
                        )}>
                          {conversation.filter(msg => msg.type === 'user').length}
                        </div>
                        <div className="text-xs text-slate-600">
                          {language === "rw" ? "Ibyo Wanditse" : language === "fr" ? "Vos Entrées" : "Your Inputs"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Enhanced Footer */}
          <div className={cn(
            "text-center",
            isMobile ? "mt-6" : isTablet ? "mt-8" : "mt-10 lg:mt-12"
          )}>
            <div className={cn(
              "inline-flex items-center bg-white/80 backdrop-blur-sm shadow-lg border border-slate-200/60 max-w-full mx-2",
              isMobile ? "gap-2 px-3 py-2 rounded-lg" :
              isTablet ? "gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl" :
              "gap-3 px-4 md:px-6 py-3 md:py-4 rounded-2xl"
            )}>
              <Shield className={cn(
                "text-slate-600 flex-shrink-0",
                isMobile ? "h-3 w-3" : "h-4 w-4 md:h-5 md:w-5"
              )} />
              <p className={cn(
                "text-slate-700 text-left",
                isMobile ? "text-xs" : "text-xs"
              )}>
                <span className="font-semibold">
                  {language === "rw" ? "Gikurikira:" : language === "fr" ? "Important :" : "Important:"}
                </span>{" "}
                {language === "rw" 
                  ? "Uyu mufasha wa AI utanga ubumenyi gusa. Buri gihe suzuma n'abakozi b'ubuzima ku ngrorane z'ubuzima n'ubwenge." 
                  : language === "fr" 
                  ? "Cet assistant IA fournit uniquement des conseils éducatifs. Consultez toujours des professionnels de santé pour les urgences médicales et de santé mentale." 
                  : "This AI assistant provides educational insights only. Always consult healthcare professionals for medical and mental health emergencies."}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SymptomChecker;