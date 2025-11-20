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
  AlertCircle
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
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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
          block: "end"
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
          block: "end"
        });
      }, 150);
    }
  }, [isAnalyzing]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [symptoms]);

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

  const ChatMessage = ({ type, content, timestamp }: { type: string, content: string, timestamp: Date }) => (
    <div className={cn(
      "flex gap-3 mb-4 animate-in fade-in duration-300",
      type === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {type === 'ai' && (
        <div className="flex flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
          <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[85%] rounded-3xl px-4 py-3 sm:px-5 sm:py-4 shadow-sm transition-all duration-200 hover:shadow-md",
        type === 'user' 
          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md' 
          : content.includes('🚨') 
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-bl-md'
            : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-bl-md'
      )}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        <div className={cn(
          "text-xs mt-2 flex items-center gap-1",
          type === 'user' ? 'text-primary-foreground/70' : 'text-slate-500'
        )}>
          <Clock className="h-3 w-3" />
          {formatTime(timestamp)}
        </div>
      </div>
      
      {type === 'user' && (
        <div className="flex flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
          <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Navigation />
      
      <main className="container py-4 sm:py-8 px-3 sm:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Enhanced Header - Mobile Responsive */}
          <div className="mb-6 sm:mb-12 text-center animate-fade-in">
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-white to-slate-100 p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-slate-200">
                  <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-primary animate-heartbeat" />
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
            <h1 className="mb-3 sm:mb-4 text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-tight px-2">
              {language === "rw" ? "Umufasha w'Ubuzima w'Ubwenge n'Umutima" : 
               language === "fr" ? "Assistant Santé Mentale et Cardiaque IA" : "Mental & Heart Health AI Assistant"}
            </h1>
            <p className="text-sm sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4">
              {language === "rw" ? "Umufasha wawe w'ubwenge w'impuhwe wo gusobanukirwa ibimenyetso by'umutima, ubwenge n'umubiri" :
               language === "fr" ? "Votre partenaire IA compatissant pour comprendre les symptômes émotionnels, mentaux et physiques" : 
               "Your compassionate AI partner for understanding emotional, mental, and physical symptoms"}
            </p>
          </div>

          {/* Main Layout - Mobile Responsive */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Chat Section - Takes full width on mobile, 2/3 on large screens */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-xl sm:shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60 pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl sm:rounded-2xl">
                        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-2xl font-bold text-slate-800">
                          {language === "rw" ? "Ikiganiro cy'Ubuzima" : 
                           language === "fr" ? "Conversation Santé" : "Health Conversation"}
                        </CardTitle>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1">
                          {conversation.length} {language === "rw" ? "ubutumwa" : language === "fr" ? "messages" : "messages"} • {language === "rw" ? "Isesengura ryuzuye rya AI" : language === "fr" ? "Analyse holistique IA" : "Holistic AI analysis"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {conversation.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearConversation}
                          className="rounded-full border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 text-xs"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          {language === "rw" ? "Siba" : language === "fr" ? "Effacer" : "Clear"}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="rounded-full border-slate-300 transition-all duration-200 text-xs"
                      >
                        {isExpanded ? 
                          (language === "rw" ? "Gutumba" : language === "fr" ? "Réduire" : "Collapse") : 
                          (language === "rw" ? "Gukura" : language === "fr" ? "Développer" : "Expand")}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 sm:p-6">
                  {/* Conversation Area */}
                  <ScrollArea 
                    ref={scrollAreaRef}
                    className={cn(
                      "rounded-xl sm:rounded-2xl border border-slate-200 bg-white/50 p-3 sm:p-4 transition-all duration-300",
                      isExpanded ? "h-64 sm:h-96" : "h-48 sm:h-80"
                    )}
                  >
                    {conversation.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-slate-500 text-center p-4 sm:p-8">
                        <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-slate-100 rounded-xl sm:rounded-2xl">
                          <HeartPulse className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mx-auto mb-2 sm:mb-3" />
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-slate-700 mb-2">
                          {language === "rw" ? "Tangira Ikiganiro cyawe cy'Ubuzima" : 
                           language === "fr" ? "Commencez Votre Conversation Santé" : "Start Your Health Conversation"}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-md leading-relaxed">
                          {language === "rw" ? "Sobanura ibimenyetso byawe by'umutima, ubwenge, cyangwa umubiri. Ndi hano kumva no gutanga ubufasha n'ubwenge." :
                           language === "fr" ? "Décrivez vos symptômes émotionnels, mentaux ou physiques. Je suis ici pour écouter et fournir un soutien compatissant et des conseils." : 
                           "Describe your emotional, mental, or physical symptoms. I'm here to listen and provide compassionate support and insights."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {conversation.map((msg, index) => (
                          <ChatMessage 
                            key={index} 
                            type={msg.type} 
                            content={msg.content} 
                            timestamp={msg.timestamp}
                          />
                        ))}
                        {isAnalyzing && (
                          <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-200 animate-pulse">
                            <div className="p-2 bg-blue-100 rounded-full">
                              <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 animate-spin" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs sm:text-sm font-medium text-blue-800">
                                {language === "rw" ? "Gusuzuma ibimenyetso byawe..." : 
                                 language === "fr" ? "Analyse de vos symptômes..." : "Analyzing your symptoms..."}
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                {language === "rw" ? "Bishobora gutora iminsi mike" : 
                                 language === "fr" ? "Cela peut prendre quelques instants" : "This may take a few moments"}
                              </p>
                            </div>
                            {/* Enhanced typing indicator */}
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="mt-4 sm:mt-6 space-y-4">
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
                        className="min-h-[80px] sm:min-h-[100px] resize-none rounded-xl sm:rounded-2xl border-slate-300 bg-white/80 focus:bg-white transition-all duration-200 text-sm sm:text-base leading-relaxed pr-10 sm:pr-12"
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
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {isAnalyzing ? (
                          <Zap className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        ) : (
                          <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Enhanced Quick Symptoms with Categories */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-2">
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          {language === "rw" ? "Ongeraho ibimenyetso byihuse" : 
                           language === "fr" ? "Ajouter Rapidement des Symptômes" : "Quick Add Symptoms"}
                        </p>
                        <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs">
                          {language === "rw" ? "Kanda kugira wongere" : language === "fr" ? "Cliquez pour ajouter" : "Click to add"}
                        </Badge>
                      </div>
                      
                      {/* Category Tabs - Mobile Scrollable */}
                      <ScrollArea className="w-full">
                        <div className="flex space-x-2 pb-2 min-w-max">
                          {Object.entries(symptomCategories).map(([key, category]) => (
                            <Button
                              key={key}
                              variant={activeCategory === key ? "default" : "outline"}
                              size="sm"
                              onClick={() => setActiveCategory(key)}
                              className={cn(
                                "rounded-full whitespace-nowrap transition-all duration-200 text-xs",
                                activeCategory === key 
                                  ? "bg-primary text-primary-foreground shadow-sm" 
                                  : "border-slate-300 bg-white/80 hover:bg-slate-100"
                              )}
                            >
                              <span className="mr-1 hidden xs:inline">{category.icon}</span>
                              <span className="max-xs:hidden">{category.name.split(' ')[0]}</span>
                              <span className="xs:hidden">{category.icon}</span>
                            </Button>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Symptoms Grid - Responsive */}
                      <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 max-h-32 sm:max-h-40 overflow-y-auto">
                        {symptomCategories[activeCategory as keyof typeof symptomCategories].symptoms.map((symptom) => (
                          <Badge
                            key={symptom.name}
                            variant="outline"
                            className={cn(
                              "cursor-pointer px-2 py-1.5 sm:px-3 sm:py-2 text-xs rounded-full transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 justify-center text-center",
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
                        <div className="bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl p-3 animate-pulse">
                          <div className="flex items-center gap-2 text-red-800">
                            <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                            <p className="text-xs font-semibold">
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

            {/* Information Panel - Hidden on small screens, shown on medium and up */}
            <div className="hidden lg:block space-y-6">
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50/50 rounded-3xl overflow-hidden">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-blue-100 rounded-2xl">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                    {language === "rw" ? "Uko Bikora" : language === "fr" ? "Comment Cela Fonctionne" : "How This Works"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <div key={index} className="flex items-start gap-3 p-3 rounded-2xl hover:bg-white/50 transition-all duration-200">
                      <div className="p-2 bg-slate-100 rounded-xl flex-shrink-0">
                        <item.icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Enhanced Emergency Card */}
              <Card className="shadow-2xl border-0 bg-gradient-to-br from-red-50 to-orange-50/50 rounded-3xl overflow-hidden border-l-4 border-l-red-400">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3 text-lg text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    {language === "rw" ? "Ubufasha bw'Ingorane" : language === "fr" ? "Soutien de Crise" : "Crisis Support"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-red-700 mb-3">
                    {language === "rw" ? "Niba ubonye bimwe mu bimenyetso by'ingorane:" :
                     language === "fr" ? "Si vous éprouvez des symptômes de crise :" : 
                     "If you're experiencing any crisis symptoms:"}
                  </p>
                  <ul className="text-xs text-red-600 space-y-2 mb-3">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      {language === "rw" ? "Hamagara serivisi z'ingorane (911) byihuse" :
                       language === "fr" ? "Appelez les services d'urgence (911) immédiatement" : 
                       "Call emergency services (911) immediately"}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      {language === "rw" ? "Umurongo wo gufasha mu ngrorane: Andika HOME kuri 741741" :
                       language === "fr" ? "Ligne de crise par texto : Textez HOME au 741741" : 
                       "Crisis Text Line: Text HOME to 741741"}
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                      {language === "rw" ? "Umurongo wo kurinda abiyica: 988" :
                       language === "fr" ? "Ligne nationale de prévention du suicide : 988" : 
                       "National Suicide Prevention Lifeline: 988"}
                    </li>
                  </ul>
                  <div className="bg-white/50 rounded-lg p-2 border border-red-200">
                    <p className="text-xs text-red-700 text-center font-semibold">
                      {language === "rw" ? "Nturi wenyine. Hari ubufasha buri gihe." :
                       language === "fr" ? "Vous n'êtes pas seul. De l'aide est disponible 24h/24." : 
                       "You are not alone. Help is available 24/7."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Card */}
              {conversation.length > 0 && (
                <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-3xl overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Activity className="h-5 w-5 text-slate-600" />
                      {language === "rw" ? "Imibare y'Ikiganiro" : language === "fr" ? "Statistiques de Conversation" : "Conversation Stats"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <div className="text-2xl font-bold text-slate-800">{conversation.length}</div>
                        <div className="text-xs text-slate-600">
                          {language === "rw" ? "Ubutumwa Bwose" : language === "fr" ? "Messages Totaux" : "Total Messages"}
                        </div>
                      </div>
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <div className="text-2xl font-bold text-slate-800">
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

          {/* Enhanced Footer - Mobile Responsive */}
          <div className="mt-8 sm:mt-12 text-center">
            <div className="inline-flex items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/60 max-w-full mx-2">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 flex-shrink-0" />
              <p className="text-xs sm:text-sm text-slate-700 text-left">
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