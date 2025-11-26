import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
  X,
  Copy,
  Check,
  Undo2,
  Redo2,
  LogIn,
  UserPlus,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Chat History Management Class
class ChatHistoryManager {
  private history: string[][];
  private future: string[][];
  private currentState: string[];

  constructor() {
    this.history = [];
    this.future = [];
    this.currentState = [];
  }

  saveState(state: string[]) {
    // Clear future when new state is saved (after undo + new action)
    this.future = [];
    // Save deep copy of current state to history
    this.history.push(JSON.parse(JSON.stringify(state)));
    this.currentState = state;
    
    // Limit history size to prevent memory issues
    if (this.history.length > 50) {
      this.history.shift();
    }
  }

  undo(): string[] | null {
    if (this.history.length > 0) {
      // Save current state to future for redo
      this.future.push(JSON.parse(JSON.stringify(this.currentState)));
      // Restore previous state
      const previousState = this.history.pop()!;
      this.currentState = previousState;
      return previousState;
    }
    return null;
  }

  redo(): string[] | null {
    if (this.future.length > 0) {
      // Save current state back to history
      this.history.push(JSON.parse(JSON.stringify(this.currentState)));
      // Restore future state
      const nextState = this.future.pop()!;
      this.currentState = nextState;
      return nextState;
    }
    return null;
  }

  canUndo(): boolean {
    return this.history.length > 0;
  }

  canRedo(): boolean {
    return this.future.length > 0;
  }

  getHistorySize(): number {
    return this.history.length;
  }

  getFutureSize(): number {
    return this.future.length;
  }
}

// Define types for symptom categories
interface Symptom {
  name: string;
  icon: string;
  isHighRisk?: boolean;
}

interface SymptomCategory {
  name: string;
  icon: string;
  symptoms: Symptom[];
}

interface SymptomCategories {
  [key: string]: SymptomCategory;
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [conversation, setConversation] = useState<Array<{type: string, content: string, timestamp: Date}>>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("emotional");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [copiedMessageId, setCopiedMessageId] = useState<number | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Initialize chat history manager
  const chatHistoryManager = useRef(new ChatHistoryManager());

  // Device detection with improved mobile detection
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    setWindowWidth(window.innerWidth);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const isDesktop = windowWidth >= 1024;

  // Comprehensive Symptom Categories with translations
  const symptomCategories: SymptomCategories = {
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

  // Get auth prompt message
  const getAuthPromptMessage = useCallback(() => {
    if (language === "rw") {
      return "🎉 Murakoze gukoresha serivisi yacu! Niba ushaka:\n• Kubika ikiganiro cyawe\n• Kubona inyunganizi zihariye\n• Gukomeza amakuru yawe\n• Kubona ubufasha bwihariye\n\n🔐 Hitamo ubundi buryo wo kwiyandikisha:";
    } else if (language === "fr") {
      return "🎉 Merci d'utiliser notre service ! Si vous souhaitez :\n• Sauvegarder votre conversation\n• Obtenir des conseils personnalisés\n• Continuer votre historique\n• Recevoir un soutien personnalisé\n\n🔐 Choisissez votre méthode d'inscription :";
    } else {
      return "🎉 Thank you for using our service! If you'd like to:\n• Save your conversation\n• Get personalized insights\n• Continue your history\n• Receive personalized support\n\n🔐 Choose your sign-up method:";
    }
  }, [language]);

  // Check if user has sent 5 messages and show auth prompt
  useEffect(() => {
    const userMessageCount = conversation.filter(msg => msg.type === 'user').length;
    if (userMessageCount >= 3 && !showAuthPrompt) { // Reduced to 3 for demo purposes
      setShowAuthPrompt(true);
      
      // Add auth prompt message to conversation
      const authPromptMessage = { 
        type: "ai", 
        content: getAuthPromptMessage(),
        timestamp: new Date() 
      };
      setConversation(prev => [...prev, authPromptMessage]);
    }
  }, [conversation.length, showAuthPrompt, getAuthPromptMessage]);

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
      const newHeight = Math.min(textareaRef.current.scrollHeight, isMobile ? 100 : 140);
      textareaRef.current.style.height = newHeight + "px";
    }
  }, [symptoms, isMobile]);

  // Copy message to clipboard
  const copyMessageToClipboard = async (content: string, messageIndex: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageIndex);
      
      toast({
        title: language === "rw" ? "Ubutumwa Bwakopiwe" : 
               language === "fr" ? "Message Copié" : "Message Copied",
        description: language === "rw" ? "Ubutumya bwakopiwe mu clipboard." :
               language === "fr" ? "Le message a été copié dans le presse-papiers." : "Message has been copied to clipboard.",
        duration: 2000,
      });

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: language === "rw" ? "Ikosa ry'o Gukopiya" : 
               language === "fr" ? "Erreur de Copie" : "Copy Error",
        description: language === "rw" ? "Ntibishoboke gukopiya ubutumwa." :
               language === "fr" ? "Impossible de copier le message." : "Failed to copy message.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Copy entire conversation
  const copyEntireConversation = async () => {
    if (conversation.length === 0) {
      toast({
        title: language === "rw" ? "Nta Kiganiro" : 
               language === "fr" ? "Aucune Conversation" : "No Conversation",
        description: language === "rw" ? "Nta kiganiro cyo gukopiya." :
               language === "fr" ? "Aucune conversation à copier." : "No conversation to copy.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const conversationText = conversation.map(msg => 
        `${msg.type === 'user' ? '👤 You' : '🤖 AI'}: ${msg.content}\n[${formatTime(msg.timestamp)}]`
      ).join('\n\n');

      await navigator.clipboard.writeText(conversationText);
      
      toast({
        title: language === "rw" ? "Ikiganiro Cyakopiwe" : 
               language === "fr" ? "Conversation Copiée" : "Conversation Copied",
        description: language === "rw" ? "Ikiganiro cyose cyakopiwe mu clipboard." :
               language === "fr" ? "Toute la conversation a été copiée." : "Entire conversation has been copied.",
        duration: 2000,
      });
    } catch (err) {
      console.error('Failed to copy conversation: ', err);
      toast({
        title: language === "rw" ? "Ikosa ry'o Gukopiya" : 
               language === "fr" ? "Erreur de Copie" : "Copy Error",
        description: language === "rw" ? "Ntibishoboke gukopiya ikiganiro." :
               language === "fr" ? "Impossible de copier la conversation." : "Failed to copy conversation.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Undo functionality
  const handleUndo = useCallback(() => {
    if (chatHistoryManager.current.canUndo()) {
      const previousState = chatHistoryManager.current.undo();
      if (previousState) {
        const previousConversation = previousState.map((content, index) => ({
          type: index % 2 === 0 ? 'user' : 'ai',
          content,
          timestamp: new Date()
        }));
        setConversation(previousConversation);
        
        toast({
          title: language === "rw" ? "Yahanuwe" : 
                 language === "fr" ? "Annulé" : "Undone",
          description: language === "rw" ? "Igikorwa cyahinduwe." :
                 language === "fr" ? "Action annulée." : "Action undone.",
          duration: 1500,
        });
      }
    } else {
      toast({
        title: language === "rw" ? "Ntacyo Wahinduye" : 
               language === "fr" ? "Rien à Annuler" : "Nothing to Undo",
        description: language === "rw" ? "Nta bikorwa byahinduwe." :
               language === "fr" ? "Aucune action à annuler." : "No actions to undo.",
        duration: 2000,
      });
    }
  }, [language, toast]);

  // Redo functionality
  const handleRedo = useCallback(() => {
    if (chatHistoryManager.current.canRedo()) {
      const nextState = chatHistoryManager.current.redo();
      if (nextState) {
        const nextConversation = nextState.map((content, index) => ({
          type: index % 2 === 0 ? 'user' : 'ai',
          content,
          timestamp: new Date()
        }));
        setConversation(nextConversation);
        
        toast({
          title: language === "rw" ? "Yongeye" : 
                 language === "fr" ? "Refait" : "Redone",
          description: language === "rw" ? "Igikorwa cyongewe." :
                 language === "fr" ? "Action refaite." : "Action redone.",
          duration: 1500,
        });
      }
    } else {
      toast({
        title: language === "rw" ? "Ntacyo Wongeye" : 
               language === "fr" ? "Rien à Refaire" : "Nothing to Redo",
        description: language === "rw" ? "Nta bikorwa byongewe." :
               language === "fr" ? "Aucune action à refaire." : "No actions to redo.",
        duration: 2000,
      });
    }
  }, [language, toast]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') {
        event.preventDefault();
        handleRedo();
      } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Auth handlers
  const handleSignIn = () => {
    navigate('/signin');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleContinueWithoutAccount = () => {
    setShowAuthPrompt(false);
    toast({
      title: language === "rw" ? "Komeza" : 
             language === "fr" ? "Continuer" : "Continue",
      description: language === "rw" ? "Ukomeje utarayiye konti..." :
             language === "fr" ? "Vous continuez sans compte..." : "Continuing without account...",
      duration: 2000,
    });
  };

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

    // Save current state to history before making changes
    const currentConversationContent = conversation.map(msg => msg.content);
    chatHistoryManager.current.saveState(currentConversationContent);

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

  const addSymptom = (symptom: Symptom) => {
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
    
    // Auto-close mobile menu after selecting a symptom on mobile
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const clearConversation = () => {
    // Save current state to history before clearing
    const currentConversationContent = conversation.map(msg => msg.content);
    if (currentConversationContent.length > 0) {
      chatHistoryManager.current.saveState(currentConversationContent);
    }

    setConversation([]);
    setConversationId(null);
    setSymptoms("");
    setShowAuthPrompt(false);
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

  // Enhanced ChatMessage with larger text and better spacing
  const ChatMessage = ({ type, content, timestamp, index }: { type: string, content: string, timestamp: Date, index: number }) => (
    <div className={cn(
      "flex gap-3 sm:gap-4 mb-4 sm:mb-6 animate-in fade-in duration-300 group relative",
      type === 'user' ? 'justify-end' : 'justify-start'
    )}>
      {type === 'ai' && (
        <div className={cn(
          "flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg",
          isMobile ? "h-8 w-8" : isTablet ? "h-10 w-10" : "h-12 w-12"
        )}>
          <Bot className={cn(
            "text-white",
            isMobile ? "h-4 w-4" : isTablet ? "h-5 w-5" : "h-6 w-6"
          )} />
        </div>
      )}
      
      <div className={cn(
        "rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 shadow-sm transition-all duration-200 hover:shadow-md group relative",
        type === 'user' 
          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground rounded-br-md max-w-[90%] sm:max-w-[85%]' 
          : content.includes('🚨') 
            ? 'bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-bl-md max-w-[95%] sm:max-w-[90%]'
            : 'bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-bl-md max-w-[95%] sm:max-w-[90%]'
      )}>
        {/* Copy Button - appears on hover */}
        <button
          onClick={() => copyMessageToClipboard(content, index)}
          className={cn(
            "absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg bg-white/80 shadow-sm hover:bg-white hover:shadow-md",
            type === 'user' ? 'text-primary hover:text-primary/80' : 'text-slate-600 hover:text-slate-800'
          )}
        >
          {copiedMessageId === index ? (
            <Check className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
          ) : (
            <Copy className={isMobile ? "h-4 w-4" : "h-4 w-4"} />
          )}
        </button>
        
        <p className={cn(
          "leading-relaxed whitespace-pre-wrap break-words pr-10",
          isMobile ? "text-base leading-7" : "text-lg leading-8"
        )}>{content}</p>
        <div className={cn(
          "flex items-center gap-2 mt-3",
          isMobile ? "text-sm" : "text-base",
          type === 'user' ? 'text-primary-foreground/80' : 'text-slate-600'
        )}>
          <Clock className={isMobile ? "h-3 w-3" : "h-4 w-4"} />
          {formatTime(timestamp)}
        </div>
      </div>
      
      {type === 'user' && (
        <div className={cn(
          "flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg",
          isMobile ? "h-8 w-8" : isTablet ? "h-10 w-10" : "h-12 w-12"
        )}>
          <User className={cn(
            "text-white",
            isMobile ? "h-4 w-4" : isTablet ? "h-5 w-5" : "h-6 w-6"
          )} />
        </div>
      )}
    </div>
  );

  // Auth Prompt Component
  const AuthPrompt = () => (
    <div className="flex justify-start gap-4 mb-6">
      <div className={cn(
        "flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 shadow-lg",
        isMobile ? "h-8 w-8" : isTablet ? "h-10 w-10" : "h-12 w-12"
      )}>
        <Star className={cn(
          "text-white",
          isMobile ? "h-4 w-4" : isTablet ? "h-5 w-5" : "h-6 w-6"
        )} />
      </div>
      <div className={cn(
        "rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-bl-md max-w-[95%] sm:max-w-[90%]"
      )}>
        <div className="space-y-4">
          <p className={cn(
            "leading-relaxed whitespace-pre-wrap break-words text-yellow-800",
            isMobile ? "text-base leading-7" : "text-lg leading-8"
          )}>
            {getAuthPromptMessage()}
          </p>
          
          <div className={cn(
            "flex flex-wrap gap-2",
            isMobile ? "flex-col" : "flex-row"
          )}>
            <Button
              onClick={handleSignIn}
              className={cn(
                "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200",
                isMobile ? "w-full justify-center" : "flex-1"
              )}
            >
              <LogIn className={cn("mr-2", isMobile ? "h-4 w-4" : "h-4 w-4")} />
              {language === "rw" ? "Injira" : language === "fr" ? "Se Connecter" : "Sign In"}
            </Button>
            
            <Button
              onClick={handleSignUp}
              className={cn(
                "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white transition-all duration-200",
                isMobile ? "w-full justify-center" : "flex-1"
              )}
            >
              <UserPlus className={cn("mr-2", isMobile ? "h-4 w-4" : "h-4 w-4")} />
              {language === "rw" ? "Iyandikishe" : language === "fr" ? "S'inscrire" : "Sign Up"}
            </Button>
            
            <Button
              onClick={handleContinueWithoutAccount}
              variant="outline"
              className={cn(
                "border-slate-300 text-slate-600 hover:bg-slate-50 transition-all duration-200",
                isMobile ? "w-full justify-center" : "flex-1"
              )}
            >
              {language === "rw" ? "Komeza utaranditse" : language === "fr" ? "Continuer sans compte" : "Continue without account"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Navigation />
      
      <main className="container py-3 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          {/* Enhanced Mobile Menu Button */}
          <div className="lg:hidden mb-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className={cn(
                "font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent",
                isMobile ? "text-lg" : "text-xl"
              )}>
                {language === "rw" ? "Umufasha w'Ubuzima" : 
                 language === "fr" ? "Assistant Santé" : "Health Assistant"}
              </h1>
            </div>
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
          {!isMobile && (
            <div className={cn(
              "text-center animate-fade-in",
              isTablet ? "mb-6" : "mb-8"
            )}>
              <div className={cn(
                "flex justify-center",
                isTablet ? "mb-4" : "mb-6"
              )}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className={cn(
                    "relative bg-gradient-to-br from-white to-slate-100 rounded-xl border border-slate-200",
                    isTablet ? "p-4 shadow-xl" : "p-6 shadow-2xl sm:rounded-2xl"
                  )}>
                    <Heart className={cn(
                      "text-primary animate-heartbeat",
                      isTablet ? "h-10 w-10" : "h-12 w-12"
                    )} />
                    <Brain className={cn(
                      "text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
                      isTablet ? "h-5 w-5" : "h-6 w-6"
                    )} />
                  </div>
                </div>
              </div>
              <h1 className={cn(
                "font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent tracking-tight px-2",
                isTablet ? "text-2xl mb-3" : "text-3xl mb-4"
              )}>
                {language === "rw" ? "Umufasha w'Ubuzima w'Ubwenge n'Umutima" : 
                 language === "fr" ? "Assistant Santé Mentale et Cardiaque IA" : "Mental & Heart Health AI Assistant"}
              </h1>
              <p className={cn(
                "text-muted-foreground max-w-2xl mx-auto leading-relaxed",
                isTablet ? "text-sm px-3" : "text-base px-4"
              )}>
                {language === "rw" ? "Umufasha wawe w'ubwenge w'impuhwe wo gusobanukirwa ibimenyetso by'umutima, ubwenge n'umubiri" :
                 language === "fr" ? "Votre partenaire IA compatissant pour comprendre les symptômes émotionnels, mentaux et physiques" : 
                 "Your compassionate AI partner for understanding emotional, mental, and physical symptoms"}
              </p>
            </div>
          )}

          {/* Enhanced Main Layout with better mobile handling */}
          <div className={cn(
            "grid gap-4 lg:grid-cols-3",
            isMobile ? "gap-3" : isTablet ? "gap-5" : "gap-6"
          )}>
            {/* Chat Section - Enhanced for all devices */}
            <div className={cn(
              "space-y-4",
              isMobile ? "col-span-full" : "lg:col-span-2"
            )}>
              <Card className={cn(
                "border-0 bg-white/80 backdrop-blur-sm overflow-hidden",
                isMobile ? "shadow-lg rounded-xl" :
                isTablet ? "shadow-xl rounded-2xl" :
                "shadow-2xl rounded-3xl"
              )}>
                <CardHeader className={cn(
                  "bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60",
                  isMobile ? "py-3" : isTablet ? "py-4" : "py-5"
                )}>
                  <div className={cn(
                    "flex justify-between items-center",
                    isMobile ? "flex-col gap-3" : "flex-row gap-4"
                  )}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={cn(
                        "bg-primary/10 rounded-lg",
                        isMobile ? "p-1.5" : isTablet ? "p-2" : "p-2.5"
                      )}>
                        <MessageCircle className={cn(
                          "text-primary",
                          isMobile ? "h-4 w-4" : isTablet ? "h-5 w-5" : "h-6 w-6"
                        )} />
                      </div>
                      <div>
                        <CardTitle className={cn(
                          "font-bold text-slate-800",
                          isMobile ? "text-base" : 
                          isTablet ? "text-lg" : 
                          "text-xl"
                        )}>
                          {language === "rw" ? "Ikiganiro" : 
                           language === "fr" ? "Conversation" : "Chat"}
                        </CardTitle>
                        <p className={cn(
                          "text-slate-600",
                          isMobile ? "text-xs" : "text-sm"
                        )}>
                          {conversation.length} {language === "rw" ? "ubutumwa" : language === "fr" ? "messages" : "messages"}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1",
                      isMobile ? "justify-center w-full" : "gap-2"
                    )}>
                      {/* Undo/Redo Buttons */}
                      <div className="flex items-center gap-1 border-r border-slate-300 pr-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleUndo}
                          disabled={!chatHistoryManager.current.canUndo()}
                          className={cn(
                            "rounded-full border-slate-300 transition-all duration-200",
                            isMobile ? "h-8 w-8 p-0" : "h-8 w-8 p-0"
                          )}
                          title={language === "rw" ? "Ongera" : language === "fr" ? "Annuler" : "Undo"}
                        >
                          <Undo2 className={cn("h-3.5 w-3.5")} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleRedo}
                          disabled={!chatHistoryManager.current.canRedo()}
                          className={cn(
                            "rounded-full border-slate-300 transition-all duration-200",
                            isMobile ? "h-8 w-8 p-0" : "h-8 w-8 p-0"
                          )}
                          title={language === "rw" ? "Ongera" : language === "fr" ? "Refaire" : "Redo"}
                        >
                          <Redo2 className={cn("h-3.5 w-3.5")} />
                        </Button>
                      </div>

                      {/* Copy Conversation Button */}
                      {conversation.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={copyEntireConversation}
                          className={cn(
                            "rounded-full border-slate-300 transition-all duration-200",
                            isMobile ? "h-8 px-3" : "h-8"
                          )}
                        >
                          <Copy className={cn("mr-1 h-3.5 w-3.5")} />
                          {isMobile ? "" : (language === "rw" ? "Kopiya" : language === "fr" ? "Copier" : "Copy")}
                        </Button>
                      )}

                      {conversation.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={clearConversation}
                          className={cn(
                            "rounded-full border-slate-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200",
                            isMobile ? "h-8 px-3" : "h-8"
                          )}
                        >
                          <Trash2 className={cn("mr-1 h-3.5 w-3.5")} />
                          {isMobile ? "" : (language === "rw" ? "Siba" : language === "fr" ? "Effacer" : "Clear")}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className={cn(
                  isMobile ? "p-3" : isTablet ? "p-4" : "p-5"
                )}>
                  {/* Enhanced Conversation Area with device-specific heights */}
                  <ScrollArea 
                    ref={scrollAreaRef}
                    className={cn(
                      "border border-slate-200 bg-white/50 transition-all duration-300",
                      isMobile ? "rounded-lg p-3" : 
                      isTablet ? "rounded-xl p-4" : 
                      "rounded-2xl p-5",
                      isExpanded ? 
                        (isMobile ? "h-64" : isTablet ? "h-96" : "h-[500px]") : 
                        (isMobile ? "h-48" : isTablet ? "h-80" : "h-96")
                    )}
                  >
                    {conversation.length === 0 ? (
                      <div className={cn(
                        "flex h-full flex-col items-center justify-center text-slate-500 text-center",
                        isMobile ? "p-4" : isTablet ? "p-6" : "p-8"
                      )}>
                        <div className={cn(
                          "bg-slate-100 rounded-lg",
                          isMobile ? "p-3 mb-3" : 
                          isTablet ? "p-4 mb-4" : 
                          "p-5 mb-5"
                        )}>
                          <HeartPulse className={cn(
                            "text-slate-400 mx-auto",
                            isMobile ? "h-8 w-8" : 
                            isTablet ? "h-10 w-10" : 
                            "h-12 w-12"
                          )} />
                        </div>
                        <h3 className={cn(
                          "font-semibold text-slate-700 mb-2",
                          isMobile ? "text-base" : 
                          isTablet ? "text-lg" : 
                          "text-xl"
                        )}>
                          {language === "rw" ? "Tangira Ikiganiro" : 
                           language === "fr" ? "Commencez la Conversation" : "Start Chatting"}
                        </h3>
                        <p className={cn(
                          "text-slate-600 max-w-md leading-relaxed",
                          isMobile ? "text-sm" : "text-base"
                        )}>
                          {language === "rw" ? "Sobanura ibimenyetso byawe by'umutima, ubwenge, cyangwa umubiri." :
                           language === "fr" ? "Décrivez vos symptômes émotionnels, mentaux ou physiques." : 
                           "Describe your emotional, mental, or physical symptoms."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {conversation.map((message, index) => (
                          <ChatMessage
                            key={index}
                            type={message.type}
                            content={message.content}
                            timestamp={message.timestamp}
                            index={index}
                          />
                        ))}
                        
                        {/* Auth Prompt */}
                        {showAuthPrompt && <AuthPrompt />}
                        
                        {isAnalyzing && (
                          <div className="flex justify-start gap-4 mb-6">
                            <div className={cn(
                              "flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg",
                              isMobile ? "h-8 w-8" : isTablet ? "h-10 w-10" : "h-12 w-12"
                            )}>
                              <Bot className={cn(
                                "text-white",
                                isMobile ? "h-4 w-4" : isTablet ? "h-5 w-5" : "h-6 w-6"
                              )} />
                            </div>
                            <div className={cn(
                              "rounded-2xl sm:rounded-3xl px-4 py-3 sm:px-5 sm:py-4 md:px-6 md:py-5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-bl-md max-w-[95%] sm:max-w-[90%]"
                            )}>
                              <div className="flex items-center gap-3">
                                <div className="flex space-x-1">
                                  <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce"></div>
                                  <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                  <div className="w-3 h-3 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className={cn(
                                  "text-slate-600",
                                  isMobile ? "text-base" : "text-lg"
                                )}>
                                  {language === "rw" ? "Avuga..." : language === "fr" ? "En train d'écrire..." : "Thinking..."}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  {/* Input Area */}
                  <div className={cn(
                    "mt-4 space-y-3",
                    isMobile ? "space-y-2" : "space-y-3"
                  )}>
                    <Textarea
                      ref={textareaRef}
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder={
                        language === "rw" ? "Sobanura ibimenyetso byawe hano..." :
                        language === "fr" ? "Décrivez vos symptômes ici..." :
                        "Describe your symptoms here..."
                      }
                      className={cn(
                        "resize-none border-slate-300 focus:border-primary transition-all duration-200 bg-white/80 backdrop-blur-sm",
                        isMobile ? "min-h-[60px] text-base" : "min-h-[80px] text-lg"
                      )}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAnalyze();
                        }
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <div className={cn(
                        "text-slate-500",
                        isMobile ? "text-xs" : "text-sm"
                      )}>
                        {language === "rw" ? "Kanda Enter kwohereza" : 
                         language === "fr" ? "Enter pour envoyer" : 
                         "Enter to send"}
                      </div>
                      <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !symptoms.trim()}
                        className={cn(
                          "bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                          isMobile ? "px-4 py-2 text-base" : "px-6 py-2 text-lg"
                        )}
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                            {language === "rw" ? "Avuga..." : language === "fr" ? "Analyse..." : "Analyzing..."}
                          </>
                        ) : (
                          <>
                            <Sparkles className={cn("mr-2", isMobile ? "h-4 w-4" : "h-5 w-5")} />
                            {language === "rw" ? "Suzuma" : language === "fr" ? "Analyser" : "Analyze"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Symptoms Panel - Enhanced for mobile with better responsiveness */}
            <div className={cn(
              isMobile && !isMobileMenuOpen ? "hidden" : "block",
              isMobile ? "col-span-full" : "lg:col-span-1"
            )}>
              <Card className={cn(
                "border-0 bg-white/80 backdrop-blur-sm overflow-hidden h-full",
                isMobile ? "shadow-lg rounded-xl" :
                isTablet ? "shadow-xl rounded-2xl" :
                "shadow-2xl rounded-3xl"
              )}>
                <CardHeader className={cn(
                  "bg-gradient-to-r from-slate-50 to-slate-100/80 border-b border-slate-200/60",
                  isMobile ? "py-3" : isTablet ? "py-4" : "py-5"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={cn(
                        "bg-primary/10 rounded-lg",
                        isMobile ? "p-1.5" : isTablet ? "p-2" : "p-2.5"
                      )}>
                        <Activity className={cn(
                          "text-primary",
                          isMobile ? "h-4 w-4" : isTablet ? "h-5 w-5" : "h-6 w-6"
                        )} />
                      </div>
                      <div>
                        <CardTitle className={cn(
                          "font-bold text-slate-800",
                          isMobile ? "text-base" : 
                          isTablet ? "text-lg" : 
                          "text-xl"
                        )}>
                          {language === "rw" ? "Ibimenyetso" : 
                           language === "fr" ? "Symptômes" : "Symptoms"}
                        </CardTitle>
                        <p className={cn(
                          "text-slate-600",
                          isMobile ? "text-xs" : "text-sm"
                        )}>
                          {language === "rw" ? "Hitamo mu bimenyetso" :
                           language === "fr" ? "Choisissez vos symptômes" : 
                           "Choose your symptoms"}
                        </p>
                      </div>
                    </div>
                    {/* Close button for mobile */}
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="rounded-full h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className={cn(
                  isMobile ? "p-3" : isTablet ? "p-4" : "p-5"
                )}>
                  {/* Category Tabs - Enhanced for mobile */}
                  <ScrollArea className={cn(
                    "mb-4",
                    isMobile ? "max-w-full" : ""
                  )}>
                    <div className={cn(
                      "flex space-x-1 pb-2",
                      isMobile ? "min-w-max gap-1" : "flex-wrap gap-2"
                    )}>
                      {Object.entries(symptomCategories).map(([key, category]) => (
                        <Button
                          key={key}
                          variant={activeCategory === key ? "default" : "outline"}
                          size="sm"
                          onClick={() => setActiveCategory(key)}
                          className={cn(
                            "rounded-full transition-all duration-200 whitespace-nowrap",
                            isMobile ? "text-xs px-3 py-1 h-8" : "text-sm h-9"
                          )}
                        >
                          <span className="mr-1">{category.icon}</span>
                          {isMobile ? category.name.split(' ')[0] : 
                           isTablet && category.name.length > 15 ? category.name.split(' ')[0] : category.name}
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Symptoms Grid - Enhanced for mobile with better spacing */}
                  <div className={cn(
                    "grid gap-2",
                    isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
                  )}>
                    {symptomCategories[activeCategory as keyof typeof symptomCategories]?.symptoms.map((symptom, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => addSymptom(symptom)}
                        className={cn(
                          "h-auto py-3 px-2 border-slate-200 hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left flex flex-col items-center justify-center gap-2 relative",
                          isMobile ? "min-h-[80px]" : "min-h-[90px]",
                          symptom.isHighRisk ? "border-red-200 bg-red-50 hover:border-red-300 hover:bg-red-100" : ""
                        )}
                      >
                        <span className={cn(
                          symptom.isHighRisk ? "text-2xl" : "text-xl"
                        )}>
                          {symptom.icon}
                        </span>
                        <span className={cn(
                          "font-medium leading-tight text-center",
                          isMobile ? "text-xs" : "text-sm",
                          symptom.isHighRisk ? "text-red-700 font-bold" : "text-slate-700"
                        )}>
                          {symptom.name}
                        </span>
                        {symptom.isHighRisk && (
                          <AlertTriangle className={cn(
                            "text-red-500 absolute top-1 right-1",
                            isMobile ? "h-3 w-3" : "h-4 w-4"
                          )} />
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SymptomChecker;