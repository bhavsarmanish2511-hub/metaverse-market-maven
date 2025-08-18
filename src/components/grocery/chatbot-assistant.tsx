import React, { useState } from 'react';
import { CyberButton } from '@/components/ui/cyber-button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Phone, User, Headphones } from 'lucide-react';

export const ChatbotAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleCallAssistant = () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setIsOpen(false);
      // In a real app, this would initiate actual human assistant connection
      alert('Connecting you to our in-store human assistant...');
    }, 2000);
  };

  return (
    <>
      {/* Fixed Chatbot Icon */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <CyberButton
            variant="cyber"
            size="icon"
            className="fixed bottom-6 left-6 z-50 w-16 h-16 rounded-full shadow-cyber animate-pulse hover:animate-none"
          >
            <MessageCircle className="w-8 h-8" />
          </CyberButton>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-md glass border-primary/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 holographic">
              <Headphones className="w-5 h-5" />
              Human Assistant
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto">
                <User className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Connect to Store Assistant</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized help from our in-store human assistant
                </p>
              </div>
            </div>
            
            <div className="bg-glass/20 rounded-lg p-4 border border-accent/20">
              <h4 className="font-medium text-accent mb-2">Available Services:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Product location assistance</li>
                <li>• Nutritional guidance</li>
                <li>• Special dietary requirements</li>
                <li>• Child-friendly product recommendations</li>
                <li>• Real-time shopping support</li>
              </ul>
            </div>
            
            <CyberButton
              variant="hologram"
              size="lg"
              className="w-full"
              onClick={handleCallAssistant}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Human Assistant
                </>
              )}
            </CyberButton>
            
            <p className="text-xs text-center text-muted-foreground">
              Available 24/7 • Average response time: 30 seconds
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};