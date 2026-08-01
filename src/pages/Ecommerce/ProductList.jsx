import React, { useState, useEffect } from 'react';
import './ProductList.css';
import FilterSidebar from '../../components/Ecommerce/FilterSidebar';
import useAppStore from '../../store/appStore';
import { useApi } from '../../services/api';
import { Browser } from '@capacitor/browser';
import { SlidersHorizontal, ArrowLeft, Star, Truck, Tag, ChevronDown, ChevronUp, Zap, ShieldCheck } from 'lucide-react';
import GlobalDisclaimer from '../../components/Global/GlobalDisclaimer';

const ProductList = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('price');
  const [expandedProducts, setExpandedProducts] = useState({});

  const { getTrendingDeals } = useApi();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const goToPDP = useAppStore(state => state.goToPDP);
  const goToDashboard = useAppStore(state => state.goToDashboard);
  const searchQuery = useAppStore(state => state.searchQuery);
  const setGlobalRedirectData = useAppStore(state => state.setGlobalRedirectData);

  useEffect(() => {
    getTrendingDeals().then(res => {
      // Inject Second Hand / Refurbished listings for electronics
      const enhancedDeals = res.map(deal => {
        if (deal.category === 'Electronics') {
          const basePrice = deal.bestPrice || deal.originalPrice || 20000;
          const olxPrice = Math.floor(basePrice * 0.45); // 55% off
          const cashifyPrice = Math.floor(basePrice * 0.55); // 45% off
          
          return {
            ...deal,
            platforms: [
              ...deal.platforms,
              { 
                name: 'Cashify', 
                price: cashifyPrice, 
                logo: 'https://placehold.co/50x50/FFF/000?text=C', 
                url: '#', 
                deliveryDays: 2, 
                inStock: true, 
                shippingCost: 0, 
                bankOffer: 'Refurbished (Superb)', 
                isSecondHand: true 
              },
              { 
                name: 'OLX', 
                price: olxPrice, 
                logo: 'https://placehold.co/50x50/FFF/000?text=O', 
                url: '#', 
                deliveryDays: 0, 
                inStock: true, 
                shippingCost: 0, 
                bankOffer: 'Used (Local Pickup)', 
                isSecondHand: true 
              }
            ]
          };
        }
        return deal;
      });
      setDeals(enhancedDeals);
      setLoading(false);
    });
  }, []);

  const toggleProduct = (id) =>
    setExpandedProducts(prev => ({ ...prev, [id]: !prev[id] }));

  const products = deals.filter(deal => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (q.includes('budget') || q.match(/15000|15k|under/)) return deal.dealScore > 85;
    return deal.title.toLowerCase().includes(q) ||
      deal.category.toLowerCase().includes(q) ||
      deal.brand.toLowerCase().includes(q);
  });

  const sorted = [...products].sort((a, b) => {
    if (sortBy === 'price') return a.bestPrice - b.bestPrice;
    if (sortBy === 'discount') return b.discount - a.discount;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const handleBuy = (url, fallbackName, productTitle) => {
    let finalUrl = url;
    
    // Generate real app links for intent launching if url is missing/dummy
    if (!url || url === '#') {
      const q = encodeURIComponent(productTitle || fallbackName);
      const name = fallbackName.toLowerCase();
      
      if (name.includes('amazon')) finalUrl = `https://www.amazon.in/s?k=${q}`;
      else if (name.includes('flipkart')) finalUrl = `https://www.flipkart.com/search?q=${q}`;
      else if (name.includes('croma')) finalUrl = `https://www.croma.com/search/?q=${q}`;
      else if (name.includes('reliance')) finalUrl = `https://www.reliancedigital.in/search?q=${q}:relevance`;
      else if (name.includes('cashify')) finalUrl = `https://www.cashify.in/buy-refurbished-mobile-phones/search?q=${q}`;
      else if (name.includes('olx')) finalUrl = `https://www.olx.in/items/q-${q}`;
      else if (name.includes('myntra')) finalUrl = `https://www.myntra.com/${q}`;
      else if (name.includes('ajio')) finalUrl = `https://www.ajio.com/search/?text=${q}`;
      else {
        const domain = fallbackName.toLowerCase().replace(/[^a-z0-9]/g, '');
        finalUrl = `https://www.${domain}.com`;
      }
    }
      
    setGlobalRedirectData({
      providerName: fallbackName,
      targetUrl: finalUrl
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="plp-shimmer-card" />
        ))}
      </div>
    );
  }

  return (
    <div className="plp-page">
      <GlobalDisclaimer />
      {/* Header */}
      <div className="plp-header">
        <button className="plp-back-btn" onClick={goToDashboard}>
          <ArrowLeft size={20} />
        </button>
        <div className="plp-header-info">
          <h1 className="plp-title">"{searchQuery || 'All Products'}"</h1>
          <span className="plp-count">{sorted.length} products compared</span>
        </div>
      </div>

      {/* Sort + Filter Bar */}
      <div className="plp-toolbar">
        <button className="plp-filter-btn" onClick={() => setIsFilterOpen(true)}>
          <SlidersHorizontal size={15} /> Filters
        </button>
        <div className="plp-sort-group">
          {[
            { id: 'price', label: 'Lowest Price' },
            { id: 'discount', label: 'Best Discount' },
            { id: 'rating', label: 'Top Rated' },
          ].map(opt => (
            <button
              key={opt.id}
              className={`plp-sort-chip ${sortBy === opt.id ? 'active' : ''}`}
              onClick={() => setSortBy(opt.id)}
            >{opt.label}</button>
          ))}
        </div>
      </div>

      <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />

      {/* Product Cards */}
      {sorted.length === 0 ? (
        <div className="plp-empty">
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <h3>No products found</h3>
          <p>Try a different search term or clear filters</p>
        </div>
      ) : (
        <div className="plp-list">
          {sorted.map(product => {
            const isExpanded = expandedProducts[product.id];
            const platformsSorted = product.platforms
              ? [...product.platforms].sort((a, b) => a.price - b.price)
              : [];
            const cheapest = platformsSorted[0];
            const savings = platformsSorted.length > 1
              ? platformsSorted[platformsSorted.length - 1].price - cheapest.price
              : 0;

            return (
              <div key={product.id} className="plp-product-card">
                {/* Image + badges */}
                <div className="plp-product-image-wrap">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="plp-product-image"
                    loading="lazy"
                    onClick={() => goToPDP(product)}
                  />
                  {product.discount > 0 && (
                    <div className="plp-discount-badge">{product.discount}% OFF</div>
                  )}
                  <div className="plp-score-badge">
                    <Zap size={10} /> {product.dealScore}/100
                  </div>
                </div>

                {/* Info */}
                <div className="plp-product-info">
                  <p className="plp-product-brand">{product.brand} · {product.category}</p>
                  <h3 className="plp-product-title" onClick={() => goToPDP(product)}>
                    {product.title}
                  </h3>

                  {/* Rating + reviews */}
                  <div className="plp-product-meta">
                    <span className="plp-rating">
                      <Star size={12} fill="#FFD700" color="#FFD700" />
                      {product.rating}
                    </span>
                    <span className="plp-reviews">({product.reviewsCount?.toLocaleString()} reviews)</span>
                    {product.specs?.[0] && (
                      <span className="plp-spec-tag">{product.specs[0]}</span>
                    )}
                  </div>

                  {/* AI best deal strip */}
                  {cheapest && (
                    <div className="plp-ai-strip">
                      <ShieldCheck size={13} color="#2563eb" />
                      <span>
                        <strong>{cheapest.name}</strong> is cheapest
                        {savings > 0 && <> — ₹{savings.toLocaleString()} cheaper than others</>}
                        {cheapest.bankOffer && <> · {cheapest.bankOffer}</>}
                      </span>
                    </div>
                  )}

                  {/* Price + expand toggle */}
                  <div className="plp-price-row">
                    <div className="plp-price-group">
                      {product.originalPrice && product.originalPrice > product.bestPrice && (
                        <span className="plp-original-price">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                      <span className="plp-best-price">₹{product.bestPrice?.toLocaleString()}</span>
                    </div>
                    <button
                      className="plp-compare-btn"
                      onClick={() => toggleProduct(product.id)}
                    >
                      {platformsSorted.length} sites {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  {/* Expanded platform comparison */}
                  {isExpanded && platformsSorted.length > 0 && (
                    <div className="plp-platform-list">
                      {platformsSorted.map((plat, idx) => (
                        <div key={plat.name} className={`plp-plat-row ${idx === 0 ? 'cheapest' : ''}`}>
                          <div className="plp-plat-left">
                            <span className="plp-plat-name">{plat.name}</span>
                            <div className="plp-plat-tags">
                              {plat.deliveryDays === 1 && (
                                <span className="plp-delivery-tag">
                                  <Truck size={9} /> Tomorrow
                                </span>
                              )}
                              {plat.bankOffer && (
                                <span className="plp-bank-tag">
                                  <Tag size={9} /> {plat.bankOffer}
                                </span>
                              )}
                              {idx === 0 && (
                                <span className="plp-best-tag">✨ Best Price</span>
                              )}
                              {plat.isSecondHand && (
                                <span className="plp-second-hand-tag">♻️ Refurbished / 2nd Hand</span>
                              )}
                            </div>
                          </div>
                          <div className="plp-plat-right">
                            <div className="plp-plat-price-col">
                              {plat.shippingCost > 0 && (
                                <span className="plp-shipping">+₹{plat.shippingCost} ship</span>
                              )}
                              <span className="plp-plat-price">₹{plat.price.toLocaleString()}</span>
                            </div>
                            <button
                              className="plp-buy-btn"
                              onClick={() => handleBuy(plat.url, plat.name, product.title)}
                            >
                              Buy
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductList;
