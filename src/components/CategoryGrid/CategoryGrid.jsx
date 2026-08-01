import React from 'react';
import { 
  Smartphone, Shirt, ShoppingBasket, Sofa, Refrigerator, BookOpen, 
  ToyBrick, Dumbbell, Car, HeartPulse, PawPrint, Briefcase, 
  Factory, Flower2, Gem, Gift, Music, Palette, Luggage, Gamepad2, 
  Wifi, Download, Scissors, Crown, Leaf, Shield, Tractor, HardHat 
} from 'lucide-react';
import './CategoryGrid.css';

const categories = [
  { id: 1, name: 'Electronics', icon: Smartphone, color: '#fef2f2' },
  { id: 2, name: 'Fashion', icon: Shirt, color: '#fffbeb' },
  { id: 3, name: 'Grocery', icon: ShoppingBasket, color: '#f0fdf4' },
  { id: 4, name: 'Home & Kitchen', icon: Sofa, color: '#eff6ff' },
  { id: 5, name: 'Appliances', icon: Refrigerator, color: '#faf5ff' },
  { id: 6, name: 'Books', icon: BookOpen, color: '#fdf2f8' },
  { id: 7, name: 'Toys', icon: ToyBrick, color: '#f0fdfa' },
  { id: 8, name: 'Sports', icon: Dumbbell, color: '#fff7ed' },
  { id: 9, name: 'Auto', icon: Car, color: '#f8fafc' },
  { id: 10, name: 'Health', icon: HeartPulse, color: '#fef2f2' },
  { id: 11, name: 'Pet', icon: PawPrint, color: '#fffbeb' },
  { id: 12, name: 'Office', icon: Briefcase, color: '#eff6ff' },
  { id: 13, name: 'Industrial', icon: Factory, color: '#f1f5f9' },
  { id: 14, name: 'Garden', icon: Flower2, color: '#f0fdf4' },
  { id: 15, name: 'Jewellery', icon: Gem, color: '#fdf4ff' },
  { id: 16, name: 'Gifts', icon: Gift, color: '#fff1f2' },
  { id: 17, name: 'Musical', icon: Music, color: '#faf5ff' },
  { id: 18, name: 'Art', icon: Palette, color: '#ecfdf5' },
  { id: 19, name: 'Travel Luggage', icon: Luggage, color: '#f0f9ff' },
  { id: 20, name: 'Gaming', icon: Gamepad2, color: '#fdf2f8' },
  { id: 21, name: 'Smart Home', icon: Wifi, color: '#eef2ff' },
  { id: 22, name: 'Digital', icon: Download, color: '#f0fdfa' },
  { id: 23, name: 'Handmade', icon: Scissors, color: '#fefce8' },
  { id: 24, name: 'Luxury', icon: Crown, color: '#fff7ed' },
  { id: 25, name: 'Eco-friendly', icon: Leaf, color: '#f0fdf4' },
  { id: 26, name: 'Adult', icon: Shield, color: '#fef2f2' },
  { id: 27, name: 'Agriculture', icon: Tractor, color: '#fefce8' },
  { id: 28, name: 'Construction', icon: HardHat, color: '#f1f5f9' }
];

const CategoryGrid = () => {
  const t = (str) => str;

  return (
    <div className="category-section">
      <div className="category-header">
        <h2 className="category-title">{t('Categories')}</h2>
        <a href="#all" className="category-view-all">{t('View All')}</a>
      </div>
      <div className="category-grid-container">
        <div className="category-scroll-area">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.id} className="category-item">
                <div className="category-icon-wrapper" style={{ background: cat.color }}>
                  <Icon size={24} color="#4b5563" strokeWidth={1.5} />
                </div>
                <span className="category-label">{t(cat.name)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryGrid;
