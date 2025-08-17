import React from 'react';
import { CyberCard, CyberCardContent, CyberCardHeader, CyberCardTitle } from '@/components/ui/cyber-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Download, 
  Share2, 
  Truck,
  Clock,
  Star,
  MapPin,
  Smartphone
} from 'lucide-react';

interface OrderConfirmationProps {
  orderNumber?: string;
  totalAmount?: number;
  deliveryTime?: string;
  onBackToDashboard?: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber = 'MG2035-789456',
  totalAmount = 89.47,
  deliveryTime = '15-30 minutes',
  onBackToDashboard
}) => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto max-w-4xl space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-cyber rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-cyber">
            <CheckCircle className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <div>
            <h1 className="text-5xl font-bold holographic mb-4">Order Confirmed!</h1>
            <p className="text-xl text-muted-foreground">
              Thank you for shopping with MetaGrocer 2035
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Badge className="bg-accent text-accent-foreground px-6 py-2 text-lg">
              Order #{orderNumber}
            </Badge>
            <Badge className="bg-gradient-hologram text-background px-6 py-2 text-lg">
              ${totalAmount.toFixed(2)} Paid
            </Badge>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery Tracking */}
          <CyberCard variant="glass">
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Delivery Tracking
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-4">
              <div className="glass p-4 rounded-lg border border-accent/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-cyber rounded-full flex items-center justify-center animate-float">
                    <span className="text-2xl">🚁</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-accent">Quantum Drone #QD-2847</h4>
                    <p className="text-sm text-muted-foreground">Preparing for departure</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-accent" />
                    <span>Estimated delivery: {deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span>123 Metaverse Avenue, Neo City</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order Confirmed</p>
                    <p className="text-sm text-muted-foreground">Payment processed successfully</p>
                  </div>
                  <span className="text-xs text-accent">Now</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Preparing Package</p>
                    <p className="text-sm text-muted-foreground">Items being gathered and packaged</p>
                  </div>
                  <span className="text-xs text-primary">In Progress</span>
                </div>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Drone Dispatch</p>
                    <p className="text-sm text-muted-foreground">En route to delivery location</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Pending</span>
                </div>

                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Delivered</p>
                    <p className="text-sm text-muted-foreground">Package delivered safely</p>
                  </div>
                  <span className="text-xs text-muted-foreground">Pending</span>
                </div>
              </div>
            </CyberCardContent>
          </CyberCard>

          {/* Order Summary */}
          <CyberCard variant="neon">
            <CyberCardHeader>
              <CyberCardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-secondary" />
                Order Summary
              </CyberCardTitle>
            </CyberCardHeader>
            <CyberCardContent className="space-y-4">
              <div className="space-y-3">
                <div className="glass p-3 rounded-lg border border-secondary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Organic Avocados</span>
                    <span>3x $2.99</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Produce • Eco A Rating</p>
                </div>

                <div className="glass p-3 rounded-lg border border-secondary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Grass-Fed Beef</span>
                    <span>1x $12.99</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Meat • Eco B Rating</p>
                </div>

                <div className="glass p-3 rounded-lg border border-secondary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Quinoa Blend</span>
                    <span>2x $4.99</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Grains • Eco A Rating</p>
                </div>
              </div>

              <div className="border-t border-secondary/20 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>$75.95</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>Eco Discount (15%)</span>
                  <span>-$11.39</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>$4.99</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>$5.17</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-secondary/20 pt-2">
                  <span>Total Paid</span>
                  <span className="holographic">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Badge className="w-full justify-center bg-gradient-cyber text-primary-foreground py-2">
                  MetaPay Wallet - Payment Successful
                </Badge>
              </div>
            </CyberCardContent>
          </CyberCard>
        </div>

        {/* Actions */}
        <CyberCard variant="glass">
          <CyberCardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold holographic mb-2">What's Next?</h3>
                <p className="text-muted-foreground">
                  Track your order in real-time and get ready for delivery!
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <CyberButton variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Receipt
                </CyberButton>
                
                <CyberButton variant="hologram" className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Track on Mobile
                </CyberButton>
                
                <CyberButton variant="accent" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Experience
                </CyberButton>
                
                <CyberButton 
                  variant="cyber" 
                  size="lg"
                  onClick={onBackToDashboard}
                  className="flex items-center gap-2"
                >
                  Continue Shopping
                </CyberButton>
              </div>
            </div>
          </CyberCardContent>
        </CyberCard>

        {/* Floating Notification */}
        <div className="fixed bottom-6 right-6 max-w-sm">
          <div className="glass p-4 rounded-lg border border-accent/30 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Real-time updates enabled</p>
                <p className="text-xs text-muted-foreground">You'll receive delivery notifications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};