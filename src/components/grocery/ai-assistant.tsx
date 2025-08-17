import React, { useState } from 'react';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import aiAssistantImage from '@/assets/ai-assistant.jpg';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  onRecommendation?: (product: string) => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ onRecommendation }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm Aria, your AI shopping assistant. I can help you find products, suggest recipes, or answer any questions about your shopping experience!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const generateAIResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('recipe') || lowerInput.includes('cook')) {
      return "I'd love to help you with recipes! Based on your shopping history, I recommend trying a Mediterranean quinoa bowl. Would you like me to add the ingredients to your cart?";
    } else if (lowerInput.includes('healthy') || lowerInput.includes('nutrition')) {
      return "For a healthy shopping experience, I suggest organic vegetables, lean proteins, and whole grains. I notice you often buy avocados - they're packed with healthy fats!";
    } else if (lowerInput.includes('deals') || lowerInput.includes('sale')) {
      return "Great news! We have 30% off organic produce today, and there's a buy-2-get-1-free offer on protein bars. Would you like me to show you these deals?";
    }
    
    return "I understand you're looking for assistance! I can help you find products, suggest complementary items, or provide information about nutritional values. What specific help do you need today?";
  };

  return (
    <CyberCard variant="glass" className="h-full flex flex-col">
      <CyberCardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={aiAssistantImage} 
              alt="AI Assistant Aria" 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/50"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
          </div>
          <div>
            <CyberCardTitle className="text-lg">Aria Assistant</CyberCardTitle>
            <p className="text-sm text-accent">Online & Ready to Help</p>
          </div>
        </div>
      </CyberCardHeader>
      
      <CyberCardContent className="flex-1 flex flex-col gap-4">
        <ScrollArea className="flex-1 h-64">
          <div className="space-y-4 pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === 'ai' 
                    ? 'bg-gradient-cyber text-primary-foreground' 
                    : 'bg-gradient-hologram text-background'
                }`}>
                  {message.sender === 'ai' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'ai'
                    ? 'bg-glass/40 border border-primary/20 text-foreground'
                    : 'bg-gradient-cyber text-primary-foreground'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything about shopping..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="bg-glass/20 border-primary/30 text-foreground placeholder:text-muted-foreground"
          />
          <CyberButton 
            variant="cyber" 
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            <Send size={16} />
          </CyberButton>
        </div>
      </CyberCardContent>
    </CyberCard>
  );
};