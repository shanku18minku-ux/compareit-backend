import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Search, 
  X, 
  SlidersHorizontal 
} from 'lucide-react';
import useAppStore from '../../store/appStore';
import './FilterSidebar.css';

const CATEGORIES = ['All', 'Mobiles', 'Laptops', 'Audio', 'Home Appliances', 'Wearables'];
const BRANDS = ['Apple', 'Samsung', 'Sony', 'Dell', 'Bose', 'LG'];
const RATINGS = [4, 3, 2, 1];

const FilterSidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    brand: true,
    rating: true
  });

  // Local state for UI responsiveness, typically synced with store
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 2000 });
    setSelectedBrands([]);
    setSelectedRating(null);
    setSelectedCategory('All');
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`filter-sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={onClose}
      />

      <aside className={`filter-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="filter-sidebar-header">
          <div className="header-title">
            <SlidersHorizontal size={20} />
            <h2>{t('auto_filters_f3f4', 'Filters')}</h2>
          </div>
          <button className="clear-btn" onClick={clearFilters}>{t('auto_clear_all_e77f', 'Clear All')}</button>
          <button className="close-btn mobile-only" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="filter-sidebar-content">
          {/* Categories */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('category')}
            >
              <h3>{t('auto_category_3adb', 'Category')}</h3>
              {expandedSections.category ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.category && (
              <div className="filter-section-body">
                <ul className="category-list">
                  {CATEGORIES.map(cat => (
                    <li key={cat}>
                      <button 
                        className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('price')}
            >
              <h3>{t('auto_price_range_048a', 'Price Range')}</h3>
              {expandedSections.price ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.price && (
              <div className="filter-section-body">
                <div className="price-inputs">
                  <div className="price-input-group">
                    <span className="currency-symbol">$</span>
                    <input 
                      type="number" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <span className="price-separator">-</span>
                  <div className="price-input-group">
                    <span className="currency-symbol">$</span>
                    <input 
                      type="number" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      min="0"
                    />
                  </div>
                </div>
                <input 
                  type="range" 
                  className="price-slider"
                  min="0"
                  max="5000"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                />
              </div>
            )}
          </div>

          {/* Brands */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('brand')}
            >
              <h3>{t('auto_brand_1be6', 'Brand')}</h3>
              {expandedSections.brand ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.brand && (
              <div className="filter-section-body">
                <div className="search-box">
                  <Search size={16} />
                  <input type="text" placeholder={t('auto_search_brands_ad2c', 'Search brands...')} />
                </div>
                <ul className="checkbox-list">
                  {BRANDS.map(brand => (
                    <li key={brand}>
                      <label className="checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={selectedBrands.includes(brand)}
                          onChange={() => handleBrandToggle(brand)}
                        />
                        <span className="custom-checkbox"></span>
                        <span className="label-text">{brand}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="filter-section">
            <button 
              className="filter-section-header"
              onClick={() => toggleSection('rating')}
            >
              <h3>{t('auto_customer_rating_c006', 'Customer Rating')}</h3>
              {expandedSections.rating ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {expandedSections.rating && (
              <div className="filter-section-body">
                <ul className="rating-list">
                  {RATINGS.map(rating => (
                    <li key={rating}>
                      <label className="radio-label">
                        <input 
                          type="radio" 
                          name="rating"
                          checked={selectedRating === rating}
                          onChange={() => setSelectedRating(rating)}
                        />
                        <span className="custom-radio"></span>
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={16} 
                              className={i < rating ? 'star-filled' : 'star-empty'} 
                            />
                          ))}
                          <span className="rating-text">& Up</span>
                        </div>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="filter-sidebar-footer mobile-only">
          <button className="apply-btn" onClick={onClose}>
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
