import React, { useState } from 'react';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';

import { SmartCart, CartItem } from './smart-cart';
import { ChatbotAssistant } from './chatbot-assistant';
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
    { id: 'r1', name: 'Quinoa Blend', price: 4.99, category: 'Grains', reason: 'Complements your protein choices', isChildFriendly: false },
    { id: 'r2', name: 'Organic Spinach', price: 3.49, category: 'Produce', reason: 'High in nutrients you need', isChildFriendly: true },
    { id: 'r3', name: 'Greek Yogurt', price: 5.99, category: 'Dairy', reason: 'Based on your health goals', isChildFriendly: true },
    { id: 'r4', name: 'Wild Salmon', price: 18.99, category: 'Seafood', reason: 'Omega-3 rich protein source', isChildFriendly: false },
    { id: 'r5', name: 'Sweet Potatoes', price: 2.99, category: 'Produce', reason: 'Complex carbs for energy', isChildFriendly: true },
    { id: 'r6', name: 'Blueberries', price: 6.49, category: 'Produce', reason: 'Antioxidant superfruit', isChildFriendly: true },
    { id: 'r7', name: 'Coconut Oil', price: 12.99, category: 'Pantry', reason: 'Healthy cooking fats', isChildFriendly: false },
    { id: 'r8', name: 'Chia Seeds', price: 8.99, category: 'Health', reason: 'Plant-based omega-3', isChildFriendly: false },
  ];

  const childNutritionRecommendations = [
    { id: 'c1', name: 'Fortified Cereal', price: 6.99, category: 'Baby Food', reason: 'Iron & vitamins for 5-year-old', isChildFriendly: true },
    { id: 'c2', name: 'Whole Milk', price: 4.49, category: 'Dairy', reason: 'Essential calcium for growing bones', isChildFriendly: true },
    { id: 'c3', name: 'Organic Apple Sauce', price: 3.99, category: 'Baby Food', reason: 'Natural fiber & vitamins', isChildFriendly: true },
    { id: 'c4', name: 'String Cheese', price: 4.99, category: 'Dairy', reason: 'Protein snack for active kids', isChildFriendly: true },
    { id: 'c5', name: 'Mini Bananas', price: 3.49, category: 'Produce', reason: 'Potassium for muscle development', isChildFriendly: true },
    { id: 'c6', name: 'Vitamin Gummies', price: 12.99, category: 'Health', reason: 'Complete daily nutrition support', isChildFriendly: true },
    { id: 'c7', name: 'Goldfish Crackers', price: 3.99, category: 'Snacks', reason: 'Whole grain finger food', isChildFriendly: true },
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

        {/* Main Dashboard Layout - Smart Cart Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
          {/* Left Column - Smart Cart 3.0 (Full Height) */}
          <div className="lg:col-span-1 h-full">
            <SmartCart
              items={cartItems}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeCartItem}
              onNavigateToFinalization={onNavigateToFinalization}
            />
          </div>

          {/* Right Columns - AI Recommendations & Analytics */}
          <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* AI Recommendations with Child Nutrition */}
            <div className="space-y-6">
              {/* AI Recommendations */}
              <CyberCard variant="neon">
                <CyberCardHeader>
                  <CyberCardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    AI Recommendations
                  </CyberCardTitle>
                </CyberCardHeader>
                <CyberCardContent className="space-y-3 max-h-96 overflow-y-auto">
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

              {/* Child Nutrition Recommendations */}
              <CyberCard variant="hologram">
                <CyberCardHeader>
                  <CyberCardTitle className="flex items-center gap-2">
                    <span className="text-lg">👶</span>
                    Child Nutrition (5-year-old)
                  </CyberCardTitle>
                </CyberCardHeader>
                <CyberCardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {childNutritionRecommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="glass p-3 rounded-lg border border-primary/20 hover:border-primary/40 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{rec.name}</h4>
                          <p className="text-xs text-primary">{rec.category}</p>
                        </div>
                        <span className="font-bold text-accent">${rec.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{rec.reason}</p>
                      <CyberButton
                        variant="cyber"
                        size="sm"
                        className="w-full"
                        onClick={() => addRecommendation(rec)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add for Child
                      </CyberButton>
                    </div>
                  ))}
                </CyberCardContent>
              </CyberCard>
            </div>

            {/* Analytics & Purchase History */}
            <div className="space-y-6">

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
      
      {/* Chatbot Assistant - Fixed Bottom Left */}
      <ChatbotAssistant />
    </div>
  );
};