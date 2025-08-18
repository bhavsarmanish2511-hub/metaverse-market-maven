import React, { useState } from 'react';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ChatbotAssistant } from './chatbot-assistant';
import { 
  CheckCircle, 
  Minus, 
  Plus, 
  Trash2, 
  Tag,
  MessageCircle,
  Gift,
  Percent,
  CreditCard
} from 'lucide-react';
import { CartItem } from './smart-cart';
import aiAssistantImage from '@/assets/ai-assistant.jpg';

interface CartFinalizationProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToPayment?: () => void;
  onBackToDashboard?: () => void;
}

export const CartFinalization: React.FC<CartFinalizationProps> = ({
  items = [
    {
      id: '1',
      name: 'Organic Avocados',
      price: 2.99,
      quantity: 3,
      category: 'Produce',
      rating: 4.8,
      sustainability: 'A',
      nutrition: { calories: 160, protein: 2, fiber: 7 }
    },
    {
      id: '2',
      name: 'Grass-Fed Beef',
      price: 12.99,
      quantity: 1,
      category: 'Meat',
      rating: 4.9,
      sustainability: 'B',
      nutrition: { calories: 250, protein: 26, fiber: 0 }
    },
    {
      id: '3',
      name: 'Quinoa Blend',
      price: 4.99,
      quantity: 2,
      category: 'Grains',
      rating: 4.7,
      sustainability: 'A',
      nutrition: { calories: 220, protein: 8, fiber: 5 }
    }
  ],
  onUpdateQuantity = () => {},
  onRemoveItem = () => {},
  onProceedToPayment,
  onBackToDashboard
}) => {
  const [appliedDiscounts, setAppliedDiscounts] = useState<string[]>(['ECO15']);
  const [karenSuggestions] = useState([
    { id: 's1', name: 'Olive Oil Premium', price: 8.99, reason: 'Perfect for cooking with your avocados!' },
    { id: 's2', name: 'Himalayan Salt', price: 3.49, reason: 'Enhances the flavor of your grass-fed beef' },
  ]);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = subtotal * 0.15; // 15% eco discount
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + tax;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const getSustainabilityColor = (rating?: string) => {
    switch (rating) {
      case 'A': return 'bg-accent text-accent-foreground';
      case 'B': return 'bg-primary text-primary-foreground';
      case 'C': return 'bg-secondary text-secondary-foreground';
      case 'D': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold holographic">Cart Finalization</h1>
          <p className="text-muted-foreground text-lg">Review your items before proceeding to payment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2">
            <CyberCard variant="glass">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center justify-between">
                  <span>Your Cart ({totalItems} items)</span>
                  <Badge className="bg-gradient-cyber text-primary-foreground">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ready to Checkout
                  </Badge>
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="glass p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-surface rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🛒</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          {item.sustainability && (
                            <Badge className={`text-xs ${getSustainabilityColor(item.sustainability)}`}>
                              Eco {item.sustainability}
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            ⭐ {item.rating}
                          </Badge>
                        </div>

                        {item.nutrition && (
                          <div className="text-xs text-muted-foreground mt-2">
                            {item.nutrition.calories} cal • {item.nutrition.protein}g protein • {item.nutrition.fiber}g fiber
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                          <p className="text-xl font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <CyberButton
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          >
                            <Minus className="w-3 h-3" />
                          </CyberButton>
                          <span className="text-sm font-medium w-8 text-center bg-glass/20 py-1 rounded">
                            {item.quantity}
                          </span>
                          <CyberButton
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </CyberButton>
                        </div>
                        
                        <CyberButton
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </CyberButton>
                      </div>
                    </div>
                  </div>
                ))}
              </CyberCardContent>
            </CyberCard>
          </div>

          {/* Right Column - Karen AI & Summary */}
          <div className="space-y-6">
            {/* Karen AI Assistant */}
            <CyberCard variant="neon">
              <CyberCardHeader>
                <div className="flex items-center gap-3">
                  <img 
                    src={aiAssistantImage} 
                    alt="Karen AI Assistant" 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-secondary/50"
                  />
                  <div>
                    <CyberCardTitle className="text-lg">Karen's Suggestions</CyberCardTitle>
                    <p className="text-sm text-secondary">Your Personal Shopping Expert</p>
                  </div>
                </div>
              </CyberCardHeader>
              <CyberCardContent className="space-y-3">
                <div className="glass p-3 rounded-lg border border-secondary/20">
                  <div className="flex items-start gap-2 mb-3">
                    <MessageCircle className="w-4 h-4 text-secondary mt-1" />
                    <p className="text-sm text-foreground">
                      "Great choices! I notice you're building a healthy meal. Here are some complementary items:"
                    </p>
                  </div>
                </div>
                
                {karenSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="glass p-3 rounded-lg border border-secondary/20 hover:border-secondary/40 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm">{suggestion.name}</h4>
                      <span className="text-sm font-bold text-primary">${suggestion.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{suggestion.reason}</p>
                    <CyberButton variant="neon" size="sm" className="w-full">
                      <Plus className="w-3 h-3 mr-1" />
                      Add to Cart
                    </CyberButton>
                  </div>
                ))}
              </CyberCardContent>
            </CyberCard>

            {/* Order Summary */}
            <CyberCard variant="glass">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-primary" />
                  Order Summary
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedDiscounts.map((discount) => (
                    <div key={discount} className="flex justify-between text-accent">
                      <span className="flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        Eco Discount (15%)
                      </span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator className="bg-primary/20" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="holographic">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <CyberButton
                    variant="cyber"
                    size="lg"
                    className="w-full"
                    onClick={onProceedToPayment}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Proceed to Payment
                  </CyberButton>
                  
                  <CyberButton
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={onBackToDashboard}
                  >
                    Back to Shopping
                  </CyberButton>
                </div>

                <div className="text-center pt-2">
                  <Badge className="bg-accent/20 text-accent border-accent/30">
                    <Gift className="w-3 h-3 mr-1" />
                    Free delivery on orders over $50
                  </Badge>
                </div>
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>
      </div>
      
      {/* Chatbot Assistant - Fixed Bottom Left */}
      <ChatbotAssistant />
    </div>
  );
};