import React from 'react';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, Trash2, Star } from 'lucide-react';
import smartCartImage from '@/assets/smart-cart.jpg';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
  rating?: number;
  sustainability?: 'A' | 'B' | 'C' | 'D';
  nutrition?: {
    calories: number;
    protein: number;
    fiber: number;
  };
}

interface SmartCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onNavigateToFinalization?: () => void;
}

export const SmartCart: React.FC<SmartCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onNavigateToFinalization
}) => {
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
    <CyberCard variant="glass" className="h-full flex flex-col min-h-[600px]">
      <CyberCardHeader className="pb-4 bg-gradient-cyber/10 rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={smartCartImage} 
              alt="Smart Cart 3.0" 
              className="w-20 h-20 rounded-lg object-cover ring-2 ring-primary/50 shadow-neon"
            />
            <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-glow">
              {totalItems}
            </div>
          </div>
          <div className="flex-1">
            <CyberCardTitle className="text-2xl flex items-center gap-2 holographic">
              <ShoppingCart className="w-6 h-6" />
              Smart Cart 3.0
            </CyberCardTitle>
            <p className="text-accent text-sm font-medium">AI-Enhanced Shopping Experience</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs text-muted-foreground">Live Updates Active</span>
            </div>
          </div>
        </div>
      </CyberCardHeader>

      <CyberCardContent className="flex-1 flex flex-col gap-4">
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-4">
              <div className="w-20 h-20 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-10 h-10 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold holographic">Your cart is empty</h3>
                <p className="text-muted-foreground text-sm">Start adding items to see them here</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass p-4 rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-surface rounded-lg flex items-center justify-center">
                      <span className="text-lg">🛒</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.category}</p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-accent text-accent" />
                            <span className="text-xs text-accent">{item.rating}</span>
                          </div>
                        )}
                        {item.sustainability && (
                          <Badge className={`text-xs ${getSustainabilityColor(item.sustainability)}`}>
                            Eco {item.sustainability}
                          </Badge>
                        )}
                      </div>

                      {item.nutrition && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.nutrition.calories} cal • {item.nutrition.protein}g protein
                        </div>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center gap-1">
                        <CyberButton
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="w-3 h-3" />
                        </CyberButton>
                        <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                        <CyberButton
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </CyberButton>
                        <CyberButton
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </CyberButton>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-primary/20 pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span className="text-foreground">Total ({totalItems} items)</span>
                <span className="holographic text-xl">${totalPrice.toFixed(2)}</span>
              </div>
              
              <CyberButton
                variant="cyber"
                size="lg"
                className="w-full"
                onClick={onNavigateToFinalization}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </CyberButton>
            </div>
          </>
        )}
      </CyberCardContent>
    </CyberCard>
  );
};