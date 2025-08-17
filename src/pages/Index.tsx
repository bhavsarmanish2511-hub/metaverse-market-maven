import React, { useState } from 'react';
import { GroceryDashboard } from '@/components/grocery/dashboard';
import { SmartCart, CartItem } from '@/components/grocery/smart-cart';
import { CartFinalization } from '@/components/grocery/cart-finalization';
import { PaymentDelivery } from '@/components/grocery/payment-delivery';
import { OrderConfirmation } from '@/components/grocery/order-confirmation';

type Screen = 'dashboard' | 'cart' | 'finalization' | 'payment' | 'confirmation';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
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
  ]);

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

  const getTotalAmount = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = subtotal * 0.15; // 15% eco discount
    const tax = (subtotal - discount) * 0.08; // 8% tax
    const delivery = 4.99; // drone delivery
    return subtotal - discount + tax + delivery;
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <GroceryDashboard
            onNavigateToCart={() => setCurrentScreen('cart')}
            onNavigateToFinalization={() => setCurrentScreen('finalization')}
          />
        );
      
      case 'cart':
        return (
          <div className="min-h-screen bg-background p-6">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold holographic mb-4">Smart Cart Experience</h1>
                <p className="text-muted-foreground text-lg">Manage your items with AI-powered assistance</p>
              </div>
              <SmartCart
                items={cartItems}
                onUpdateQuantity={updateCartQuantity}
                onRemoveItem={removeCartItem}
                onNavigateToFinalization={() => setCurrentScreen('finalization')}
              />
              <div className="mt-6 text-center">
                <button 
                  onClick={() => setCurrentScreen('dashboard')}
                  className="text-primary hover:text-primary/80 underline"
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'finalization':
        return (
          <CartFinalization
            items={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeCartItem}
            onProceedToPayment={() => setCurrentScreen('payment')}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
          />
        );
      
      case 'payment':
        return (
          <PaymentDelivery
            totalAmount={getTotalAmount()}
            onCompleteOrder={() => setCurrentScreen('confirmation')}
            onBackToCart={() => setCurrentScreen('finalization')}
          />
        );
      
      case 'confirmation':
        return (
          <OrderConfirmation
            totalAmount={getTotalAmount()}
            onBackToDashboard={() => setCurrentScreen('dashboard')}
          />
        );
      
      default:
        return null;
    }
  };

  return renderScreen();
};

export default Index;
