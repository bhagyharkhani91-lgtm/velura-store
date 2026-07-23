import { Container } from '../../../components/layout/Container/Container';
import { Heart, Leaf, ShieldCheck, Truck } from 'lucide-react';

export function AboutPage() {
  return (
    <Container style={{ paddingTop: '100px', paddingBottom: '100px', minHeight: '60vh' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="heading-4xl mb-4 text-center">About Personal Care</h1>
        <p className="text-secondary text-lg text-center mb-12">Your trusted destination for premium personal care and wellness products.</p>

        <div className="space-y-8">
          <section>
            <h2 className="heading-2xl mb-4">Our Story</h2>
            <p className="text-secondary leading-relaxed">
              Personal Care was founded with a simple mission: to provide high-quality personal care and wellness products 
              that enhance everyday life. We believe that self-care is essential to a happy and healthy lifestyle, and we are 
              committed to making premium wellness products accessible to everyone.
            </p>
          </section>

          <section>
            <h2 className="heading-2xl mb-4">Our Mission</h2>
            <p className="text-secondary leading-relaxed">
              We curate and deliver the finest personal care products, from body massagers and wellness tools to premium 
              lotions and oils. Every product in our collection is carefully selected for quality, safety, and effectiveness. 
              We partner with leading brands and manufacturers to bring you products that meet the highest standards of 
              material safety and design.
            </p>
          </section>

          <section>
            <h2 className="heading-2xl mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-surface border border-border rounded-lg p-6 flex gap-4">
                <ShieldCheck size={28} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Quality Assured</h3>
                  <p className="text-sm text-secondary">All our products are made from body-safe, medical-grade materials that meet international safety standards.</p>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-6 flex gap-4">
                <Truck size={28} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Private Delivery</h3>
                  <p className="text-sm text-secondary">All orders are shipped in plain, unmarked packaging. Your privacy is always protected.</p>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-6 flex gap-4">
                <Heart size={28} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Customer First</h3>
                  <p className="text-sm text-secondary">Our dedicated support team is here to help you find the right products and answer any questions.</p>
                </div>
              </div>
              <div className="bg-surface border border-border rounded-lg p-6 flex gap-4">
                <Leaf size={28} className="text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2 text-primary">Premium Selection</h3>
                  <p className="text-sm text-secondary">We carefully curate every product, working only with trusted brands who share our commitment to quality.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
