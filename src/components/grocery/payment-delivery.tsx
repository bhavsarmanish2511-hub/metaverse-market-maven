import React, { useState } from 'react';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Bitcoin,
  Truck,
  Plane,
  Clock,
  MapPin,
  Check,
  Shield,
  Zap,
  Package
} from 'lucide-react';
import deliveryDroneImage from '@/assets/delivery-drone.jpg';

interface PaymentDeliveryProps {
  totalAmount?: number;
  onCompleteOrder?: () => void;
  onBackToCart?: () => void;
}

export const PaymentDelivery: React.FC<PaymentDeliveryProps> = ({
  totalAmount = 89.47,
  onCompleteOrder,
  onBackToCart
}) => {
  const [selectedPayment, setSelectedPayment] = useState('digital-wallet');
  const [selectedDelivery, setSelectedDelivery] = useState('drone');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'digital-wallet',
      name: 'MetaPay Wallet',
      icon: Smartphone,
      description: 'Instant & Secure',
      fee: 0,
      recommended: true
    },
    {
      id: 'credit-card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, MasterCard, Amex',
      fee: 2.99
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Bitcoin,
      description: 'Bitcoin, Ethereum, MetaCoin',
      fee: 0,
      bonus: '2% cashback'
    }
  ];

  const deliveryOptions = [
    {
      id: 'drone',
      name: 'Quantum Drone Delivery',
      icon: Plane,
      time: '15-30 minutes',
      price: 4.99,
      description: 'AI-powered autonomous delivery',
      features: ['Real-time tracking', 'Temperature controlled', 'Eco-friendly'],
      recommended: true
    },
    {
      id: 'standard',
      name: 'Standard Delivery',
      icon: Truck,
      time: '2-4 hours',
      price: 0,
      description: 'Free delivery on orders over $50',
      features: ['Professional drivers', 'Contactless delivery', 'Scheduled delivery']
    },
    {
      id: 'instant',
      name: 'Hyperloop Express',
      icon: Zap,
      time: '5-10 minutes',
      price: 12.99,
      description: 'Ultra-fast delivery via hyperloop network',
      features: ['Fastest option', 'Premium packaging', 'Live delivery feed']
    }
  ];

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onCompleteOrder?.();
    }, 3000);
  };

  const selectedPaymentMethod = paymentMethods.find(p => p.id === selectedPayment);
  const selectedDeliveryOption = deliveryOptions.find(d => d.id === selectedDelivery);
  
  const deliveryFee = selectedDeliveryOption?.price || 0;
  const paymentFee = selectedPaymentMethod?.fee || 0;
  const finalTotal = totalAmount + deliveryFee + paymentFee;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold holographic">Payment & Delivery</h1>
          <p className="text-muted-foreground text-lg">Choose your payment method and delivery option</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="space-y-6">
            <CyberCard variant="glass">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment Method
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent>
                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment}>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`glass p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedPayment === method.id 
                            ? 'border-primary/60 bg-primary/10' 
                            : 'border-primary/20 hover:border-primary/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={method.id} id={method.id} />
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`p-2 rounded-lg ${
                              selectedPayment === method.id 
                                ? 'bg-gradient-cyber text-primary-foreground' 
                                : 'bg-glass/40'
                            }`}>
                              <method.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                                  {method.name}
                                </Label>
                                {method.recommended && (
                                  <Badge className="bg-accent text-accent-foreground text-xs">
                                    Recommended
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                              {method.bonus && (
                                <p className="text-sm text-accent">{method.bonus}</p>
                              )}
                            </div>
                            <div className="text-right">
                              {method.fee > 0 ? (
                                <span className="text-sm font-medium">+${method.fee}</span>
                              ) : (
                                <Badge variant="outline" className="text-accent border-accent/30">
                                  Free
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Payment Form */}
                {selectedPayment === 'credit-card' && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input 
                          id="card-name" 
                          placeholder="John Doe"
                          className="bg-glass/20 border-primary/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input 
                          id="card-number" 
                          placeholder="1234 5678 9012 3456"
                          className="bg-glass/20 border-primary/30"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input 
                          id="expiry" 
                          placeholder="MM/YY"
                          className="bg-glass/20 border-primary/30"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          placeholder="123"
                          className="bg-glass/20 border-primary/30"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CyberCardContent>
            </CyberCard>
          </div>

          {/* Right Column - Delivery Options */}
          <div className="space-y-6">
            <CyberCard variant="neon">
              <CyberCardHeader>
                <CyberCardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-secondary" />
                  Delivery Options
                </CyberCardTitle>
              </CyberCardHeader>
              <CyberCardContent>
                <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
                  <div className="space-y-4">
                    {deliveryOptions.map((option) => (
                      <div
                        key={option.id}
                        className={`glass p-4 rounded-lg border transition-all cursor-pointer ${
                          selectedDelivery === option.id 
                            ? 'border-secondary/60 bg-secondary/10' 
                            : 'border-secondary/20 hover:border-secondary/40'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`p-2 rounded-lg ${
                                selectedDelivery === option.id 
                                  ? 'bg-gradient-hologram text-background' 
                                  : 'bg-glass/40'
                              }`}>
                                <option.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <Label htmlFor={option.id} className="font-semibold cursor-pointer">
                                    {option.name}
                                  </Label>
                                  {option.recommended && (
                                    <Badge className="bg-secondary text-secondary-foreground text-xs">
                                      Popular
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {option.time}
                                  </div>
                                  <div className="text-sm font-medium">
                                    {option.price > 0 ? `$${option.price}` : 'FREE'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {option.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Check className="w-2 h-2 mr-1" />
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {/* Drone Delivery Visual */}
                {selectedDelivery === 'drone' && (
                  <div className="mt-6 glass p-4 rounded-lg border border-accent/20">
                    <div className="flex items-center gap-3 mb-3">
                      <img 
                        src={deliveryDroneImage} 
                        alt="Delivery Drone" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-accent">Quantum Drone Fleet</h4>
                        <p className="text-sm text-muted-foreground">Advanced AI navigation with real-time tracking</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <MapPin className="w-4 h-4" />
                      Delivery to: 123 Metaverse Avenue, Neo City
                    </div>
                  </div>
                )}
              </CyberCardContent>
            </CyberCard>
          </div>
        </div>

        {/* Order Summary & Completion */}
        <CyberCard variant="glass">
          <CyberCardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold holographic mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  {paymentFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Payment fee</span>
                      <span>+${paymentFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Delivery</span>
                    <span>{deliveryFee > 0 ? `+$${deliveryFee.toFixed(2)}` : 'FREE'}</span>
                  </div>
                  <Separator className="bg-primary/20" />
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="holographic">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-accent" />
                  <span>Secure 256-bit encryption</span>
                </div>
                
                <div className="space-y-2">
                  <CyberButton
                    variant="cyber"
                    size="xl"
                    className="w-full"
                    onClick={handleCompleteOrder}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Complete Order - ${finalTotal.toFixed(2)}
                      </>
                    )}
                  </CyberButton>
                  
                  <CyberButton
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={onBackToCart}
                    disabled={isProcessing}
                  >
                    Back to Cart
                  </CyberButton>
                </div>
              </div>
            </div>
          </CyberCardContent>
        </CyberCard>
      </div>
    </div>
  );
};