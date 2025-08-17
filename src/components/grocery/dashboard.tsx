import React, { useState } from 'react';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { AIAssistant } from './ai-assistant';
import { SmartCart, CartItem } from './smart-cart';
import { 
  ShoppingBag, 
  TrendingUp, 
  Clock, 
  Star,
  Plus,
  Sparkles,
  Brain,
  Zap
} from 'lucide-react';
import storeBackground from '@/assets/store-background.jpg';

interface DashboardProps {
  onNavigateToCart?: () => void;
  onNavigateToFinalization?: () => void;
}

export const GroceryDashboard: React.FC<DashboardProps> = ({
  onNavigateToCart,
  onNavigateToFinalization
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
    }
  ]);

  const recommendations = [
    { id: 'r1', name: 'Quinoa Blend', price: 4.99, category: 'Grains', reason: 'Complements your protein choices' },
    { id: 'r2', name: 'Organic Spinach', price: 3.49, category: 'Produce', reason: 'High in nutrients you need' },
    { id: 'r3', name: 'Greek Yogurt', price: 5.99, category: 'Dairy', reason: 'Based on your health goals' },
  ];

  const purchaseHistory = [
    { item: 'Organic Bananas', frequency: 'Weekly', lastPurchase: '3 days ago' },
    { item: 'Almond Milk', frequency: 'Bi-weekly', lastPurchase: '1 week ago' },
    { item: 'Sourdough Bread', frequency: 'Weekly', lastPurchase: '2 days ago' },
  ];

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      setCartItems(prev => prev.filter(item => item.id !== id));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const addRecommendation = (recommendation: any) => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      name: recommendation.name,
      price: recommendation.price,
      quantity: 1,
      category: recommendation.category,
      rating: 4.5,
      sustainability: 'A'
    };
    setCartItems(prev => [...prev, newItem]);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{ backgroundImage: `url(${storeBackground})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-5xl font-bold holographic mb-2">
            MetaGrocer 2035
          </h1>
          <p className="text-xl text-muted-foreground">
            Your AI-Powered Shopping Experience in the Metaverse
          </p>
          <div className="flex justify-center gap-4">
            <Badge className="bg-gradient-cyber text-primary-foreground px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              AI Enhanced
            </Badge>
            <Badge className="bg-gradient-hologram text-background px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              Smart Analytics
            </Badge>
            <Badge className="bg-accent text-accent-foreground px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Real-time Updates
            </Badge>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - AI Assistant */}
          <div className="lg:col-span-1">
            <AIAssistant onRecommendation={(product) => console.log('Recommended:', product)} />
          </div>

          {/* Middle Column - Smart Cart */}
          <div className="lg:col-span-1">
            <SmartCart
              items={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeCartItem}
              onNavigateToFinalization={onNavigateToFinalization}
            />
          </div>

          {/* Right Column - Recommendations & Analytics */}
          <div className="lg:col-span-1 space-y-6">
            {/* AI Recommendations */}
            <CyberCard variant="neon">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  AI Recommendations
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className="glass p-3 rounded-lg border border-accent/20 hover:border-accent/40 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{rec.name}</h4>
                        <p className="text-xs text-accent">{rec.category}</p>
                      </div>
                      <span className="font-bold text-primary">${rec.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
                    <CyberButton
                      variant="accent"
                      size="sm"
                      className="w-full"
                      onClick={() => addRecommendation(rec)}
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Add to Cart
                    </CyberButton>
                  </div>
                ))}
              </CyberCardContent>
            </CyberCard>

            {/* Purchase History */}
            <CyberCard variant="glass">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Purchase Analytics
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent className="space-y-3">
                {purchaseHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-glass/20 rounded-lg border border-primary/10"
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.lastPurchase}</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/30">
                      {item.frequency}
                    </Badge>
                  </div>
                ))}
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 pt-8">
          <CyberButton
            variant="hologram"
            size="xl"
            onClick={onNavigateToCart}
            className="min-w-[200px]"
          >
            <ShoppingBag className="w-5 h-5 mr-2" />
            Smart Cart View
          </CyberButton>
          <CyberButton
            variant="cyber"
            size="xl"
            onClick={onNavigateToFinalization}
            className="min-w-[200px]"
          >
            <TrendingUp className="w-5 h-5 mr-2" />
            Finalize Order
          </CyberButton>
        </div>
      </div>
    </div>
  );
};