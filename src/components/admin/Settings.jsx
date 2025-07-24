import React, { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  BellIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TruckIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  PaintBrushIcon,
  ServerIcon,
  CloudIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  PlusIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  RectangleStackIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState({});
  const [previewMode, setPreviewMode] = useState('desktop');
  
  // Default settings with comprehensive project control
  const defaultSettings = {
    general: {
      siteName: 'E-commerce Store',
      siteDescription: 'Your trusted online shopping destination',
      siteTagline: 'Shop with confidence',
      siteLogo: '',
      siteFavicon: '',
      contactEmail: 'admin@example.com',
      contactPhone: '+1234567890',
      address: '123 Business Street, City, Country',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
      maintenanceMode: false,
      allowRegistration: true,
      defaultUserRole: 'customer',
      enableGuestCheckout: true,
      enableWishlist: true,
      enableReviews: true,
      enableCoupons: true,
      enableNewsletter: true
    },
    frontend: {
      // Header Settings
      headerStyle: 'modern',
      showSearchBar: true,
      showLanguageSelector: false,
      showCurrencySelector: false,
      headerHeight: '80px',
      stickyHeader: true,
      
      // Navigation Settings
      navbarStyle: 'horizontal',
      showMegaMenu: true,
      maxMenuItems: 8,
      showCategoryIcons: true,
      
      // Homepage Settings
      heroSectionEnabled: true,
      heroTitle: 'Welcome to Our Store',
      heroSubtitle: 'Discover amazing products at great prices',
      heroButtonText: 'Shop Now',
      heroBackgroundImage: '',
      heroVideoUrl: '',
      
      // Product Display
      productsPerPage: 12,
      productGridColumns: 4,
      showProductRatings: true,
      showProductWishlist: true,
      showProductQuickView: true,
      showProductCompare: true,
      enableProductZoom: true,
      
      // Footer Settings
      footerStyle: 'modern',
      showSocialLinks: true,
      showNewsletterSignup: true,
      footerCopyright: '© 2024 E-commerce Store. All rights reserved.',
      
      // Page Settings
      enableBreadcrumbs: true,
      showPageTitles: true,
      enableBackToTop: true,
      enableLiveChat: false,
      
      // Mobile Settings
      mobileMenuStyle: 'slide',
      enablePullToRefresh: true,
      enableSwipeGestures: true,
      mobileProductColumns: 2
    },
    appearance: {
      // Color Scheme
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#06b6d4',
      backgroundColor: '#ffffff',
      textColor: '#1f2937',
      linkColor: '#3b82f6',
      borderColor: '#e5e7eb',
      successColor: '#10b981',
      warningColor: '#f59e0b',
      errorColor: '#ef4444',
      
      // Typography
      fontFamily: 'Inter',
      headingFont: 'Inter',
      fontSize: '16px',
      lineHeight: '1.6',
      fontWeight: '400',
      headingWeight: '600',
      
      // Layout
      containerMaxWidth: '1200px',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      
      // Branding
      logoUrl: '',
      logoWidth: '150px',
      logoHeight: 'auto',
      faviconUrl: '',
      
      // Custom CSS
      customCSS: '',
      customJS: '',
      
      // Theme
      darkMode: false,
      enableThemeToggle: false,
      
      // Animations
      enableAnimations: true,
      animationSpeed: 'normal',
      enableParallax: false
    }
  };

  const [settings, setSettings] = useState(defaultSettings);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          // Deep merge with default settings
          const mergedSettings = deepMerge(defaultSettings, parsedSettings);
          setSettings(mergedSettings);
          console.log('Settings loaded from localStorage:', mergedSettings);
          
          // Apply settings to document
          applySettingsToDocument(mergedSettings);
        } else {
          console.log('No saved settings found, using defaults');
          applySettingsToDocument(defaultSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Error loading settings. Using defaults.');
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Deep merge function
  const deepMerge = (target, source) => {
    const result = { ...target };
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    return result;
  };

  // Apply settings to document (real-time preview)
  const applySettingsToDocument = (currentSettings) => {
    try {
      // Update document title
      document.title = currentSettings.general.siteName;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', currentSettings.general.siteDescription);
      }
      
      // Update CSS custom properties
      const root = document.documentElement;
      root.style.setProperty('--primary-color', currentSettings.appearance.primaryColor);
      root.style.setProperty('--secondary-color', currentSettings.appearance.secondaryColor);
      root.style.setProperty('--accent-color', currentSettings.appearance.accentColor);
      root.style.setProperty('--background-color', currentSettings.appearance.backgroundColor);
      root.style.setProperty('--text-color', currentSettings.appearance.textColor);
      root.style.setProperty('--font-family', currentSettings.appearance.fontFamily);
      root.style.setProperty('--font-size', currentSettings.appearance.fontSize);
      root.style.setProperty('--border-radius', currentSettings.appearance.borderRadius);
      
      // Apply custom CSS
      let customStyleElement = document.getElementById('custom-admin-styles');
      if (!customStyleElement) {
        customStyleElement = document.createElement('style');
        customStyleElement.id = 'custom-admin-styles';
        document.head.appendChild(customStyleElement);
      }
      customStyleElement.textContent = currentSettings.appearance.customCSS;
      
    } catch (error) {
      console.error('Error applying settings to document:', error);
    }
  };

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    if (!initialLoading) {
      try {
        localStorage.setItem('adminSettings', JSON.stringify(settings));
        applySettingsToDocument(settings);
        console.log('Settings auto-saved to localStorage');
      } catch (error) {
        console.error('Error saving settings to localStorage:', error);
      }
    }
  }, [settings, initialLoading]);

  const tabs = [
    { id: 'general', name: 'General', icon: Cog6ToothIcon, color: 'indigo' },
    { id: 'frontend', name: 'Frontend', icon: ComputerDesktopIcon, color: 'blue' },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon, color: 'purple' },
    { id: 'layout', name: 'Layout', icon: DevicePhoneMobileIcon, color: 'pink' },
    { id: 'email', name: 'Email', icon: EnvelopeIcon, color: 'green' },
    { id: 'payment', name: 'Payment', icon: CreditCardIcon, color: 'yellow' },
    { id: 'shipping', name: 'Shipping', icon: TruckIcon, color: 'orange' },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon, color: 'red' },
    { id: 'notifications', name: 'Notifications', icon: BellIcon, color: 'cyan' },
    { id: 'seo', name: 'SEO', icon: ChartBarIcon, color: 'emerald' },
    { id: 'social', name: 'Social', icon: UserGroupIcon, color: 'rose' },
    { id: 'performance', name: 'Performance', icon: ServerIcon, color: 'violet' },
    { id: 'api', name: 'API', icon: CodeBracketIcon, color: 'slate' },
    { id: 'backup', name: 'Backup', icon: CloudIcon, color: 'gray' }
  ];

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, parentField, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parentField]: {
          ...prev[section][parentField],
          [field]: value
        }
      }
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async (section) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Export settings for backend integration
      const exportData = {
        section,
        data: settings[section],
        timestamp: new Date().toISOString()
      };
      
      console.log('Settings export for backend:', exportData);
      
      toast.success(`${tabs.find(tab => tab.id === section)?.name} settings saved successfully!`, {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Export all settings for backend
      const exportData = {
        allSettings: settings,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      console.log('Complete settings export:', exportData);
      
      toast.success('All settings saved successfully!', {
        duration: 3000,
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
    } catch (error) {
      console.error('Error saving all settings:', error);
      toast.error('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setSettings(defaultSettings);
      localStorage.removeItem('adminSettings');
      applySettingsToDocument(defaultSettings);
      toast.success('Settings reset to default values!');
    }
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ecommerce-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success('Settings exported successfully!');
  };

  const importSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          const mergedSettings = deepMerge(defaultSettings, importedSettings);
          setSettings(mergedSettings);
          toast.success('Settings imported successfully!');
        } catch (error) {
          toast.error('Invalid settings file!');
        }
      };
      reader.readAsText(file);
    }
  };

  // Responsive preview component
  const ResponsivePreview = () => (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-medium">Live Preview</h4>
        <div className="flex space-x-2">
          {[
            { mode: 'mobile', icon: DevicePhoneMobileIcon, width: '375px' },
            { mode: 'tablet', icon: RectangleStackIcon, width: '768px' },
            { mode: 'desktop', icon: ComputerDesktopIcon, width: '100%' }
          ].map(({ mode, icon: Icon, width }) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`p-2 rounded-lg transition-colors ${
                previewMode === mode 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-hidden" style={{
        width: previewMode === 'mobile' ? '375px' : previewMode === 'tablet' ? '768px' : '100%',
        height: '400px',
        margin: '0 auto',
        transition: 'width 0.3s ease'
      }}>
        <div 
          className="h-full overflow-auto"
          style={{
            fontFamily: settings.appearance.fontFamily,
            fontSize: settings.appearance.fontSize,
            color: settings.appearance.textColor,
            backgroundColor: settings.appearance.backgroundColor
          }}
        >
          {/* Preview content */}
          <div className="p-6">
            <h1 style={{ color: settings.appearance.primaryColor, fontSize: '24px', marginBottom: '16px' }}>
              {settings.general.siteName}
            </h1>
            <p style={{ marginBottom: '16px' }}>
              {settings.general.siteDescription}
            </p>
            <button 
              style={{
                backgroundColor: settings.appearance.primaryColor,
                color: 'white',
                padding: '12px 24px',
                borderRadius: settings.appearance.borderRadius,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {settings.frontend.heroButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Input component with validation
  const SettingInput = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    placeholder, 
    required = false,
    validation,
    description,
    ...props 
  }) => {
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
      const newValue = e.target.value;
      
      if (validation) {
        const validationResult = validation(newValue);
        setIsValid(validationResult.isValid);
        setErrorMessage(validationResult.message || '');
      }
      
      onChange(e);
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-200">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gray-400">{description}</p>
        )}
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all ${
              isValid 
                ? 'border-gray-600/50 focus:ring-indigo-500' 
                : 'border-red-500 focus:ring-red-500'
            }`}
            {...props}
          />
          {!isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
          )}
        </div>
        {!isValid && errorMessage && (
          <p className="text-sm text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  };

  // Toggle switch component
  const ToggleSwitch = ({ label, checked, onChange, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer ml-4">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
      </label>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      {/* Site Information */}
      <div className="bg-gradient-to-br from-gray-800/60 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <GlobeAltIcon className="h-6 w-6 mr-3 text-indigo-400" />
          Site Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingInput
            label="Site Name"
            value={settings.general.siteName}
            onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
            placeholder="Enter site name"
            required
            validation={(value) => ({
              isValid: value.length >= 3,
              message: 'Site name must be at least 3 characters'
            })}
          />
          <SettingInput
            label="Site Tagline"
            value={settings.general.siteTagline}
            onChange={(e) => handleInputChange('general', 'siteTagline', e.target.value)}
            placeholder="Enter site tagline"
          />
          <SettingInput
            label="Contact Email"
            type="email"
            value={settings.general.contactEmail}
            onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
            placeholder="admin@example.com"
            required
            validation={(value) => ({
              isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
              message: 'Please enter a valid email address'
            })}
          />
          <SettingInput
            label="Contact Phone"
            value={settings.general.contactPhone}
            onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
            placeholder="+1234567890"
          />
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">Currency</label>
            <select
              value={settings.general.currency}
              onChange={(e) => handleInputChange('general', 'currency', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="BDT">BDT (৳)</option>
              <option value="INR">INR (₹)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="AUD">AUD (A$)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">Language</label>
            <select
              value={settings.general.language}
              onChange={(e) => handleInputChange('general', 'language', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              <option value="en">English</option>
              <option value="bn">বাংলা</option>
              <option value="hi">हिन्दी</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">Site Description</label>
            <textarea
              value={settings.general.siteDescription}
              onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Describe your store..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">Business Address</label>
            <textarea
              value={settings.general.address}
              onChange={(e) => handleInputChange('general', 'address', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter business address..."
            />
          </div>
        </div>
      </div>

      {/* System Settings */}
      <div className="bg-gradient-to-br from-gray-800/60 to-purple-900/20 p-6 rounded-xl border border-purple-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <WrenchScrewdriverIcon className="h-6 w-6 mr-3 text-purple-400" />
          System Settings
        </h3>
        <div className="space-y-4">
          <ToggleSwitch
            label="Maintenance Mode"
            description="Temporarily disable the site for maintenance"
            checked={settings.general.maintenanceMode}
            onChange={(e) => handleInputChange('general', 'maintenanceMode', e.target.checked)}
          />
          <ToggleSwitch
            label="Allow User Registration"
            description="Allow new users to register accounts"
            checked={settings.general.allowRegistration}
            onChange={(e) => handleInputChange('general', 'allowRegistration', e.target.checked)}
          />
          <ToggleSwitch
            label="Enable Guest Checkout"
            description="Allow users to checkout without creating an account"
            checked={settings.general.enableGuestCheckout}
            onChange={(e) => handleInputChange('general', 'enableGuestCheckout', e.target.checked)}
          />
          <ToggleSwitch
            label="Enable Wishlist"
            description="Allow users to save products to wishlist"
            checked={settings.general.enableWishlist}
            onChange={(e) => handleInputChange('general', 'enableWishlist', e.target.checked)}
          />
          <ToggleSwitch
            label="Enable Reviews"
            description="Allow customers to leave product reviews"
            checked={settings.general.enableReviews}
            onChange={(e) => handleInputChange('general', 'enableReviews', e.target.checked)}
          />
        </div>
      </div>
    </div>
  );

  const renderFrontendSettings = () => (
    <div className="space-y-8">
      {/* Header Settings */}
      <div className="bg-gradient-to-br from-gray-800/60 to-blue-900/20 p-6 rounded-xl border border-blue-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <ComputerDesktopIcon className="h-6 w-6 mr-3 text-blue-400" />
          Header & Navigation
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Header Style</label>
            <select
              value={settings.frontend.headerStyle}
              onChange={(e) => handleInputChange('frontend', 'headerStyle', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="bold">Bold</option>
            </select>
          </div>
          <SettingInput
            label="Header Height"
            value={settings.frontend.headerHeight}
            onChange={(e) => handleInputChange('frontend', 'headerHeight', e.target.value)}
            placeholder="80px"
            description="CSS value (px, rem, em)"
          />
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">Navigation Style</label>
            <select
              value={settings.frontend.navbarStyle}
              onChange={(e) => handleInputChange('frontend', 'navbarStyle', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="dropdown">Dropdown</option>
            </select>
          </div>
          <SettingInput
            label="Max Menu Items"
            type="number"
            value={settings.frontend.maxMenuItems}
            onChange={(e) => handleInputChange('frontend', 'maxMenuItems', parseInt(e.target.value))}
            min="3"
            max="15"
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <ToggleSwitch
            label="Show Search Bar"
            description="Display search functionality in header"
            checked={settings.frontend.showSearchBar}
            onChange={(e) => handleInputChange('frontend', 'showSearchBar', e.target.checked)}
          />
          <ToggleSwitch
            label="Sticky Header"
            description="Keep header visible when scrolling"
            checked={settings.frontend.stickyHeader}
            onChange={(e) => handleInputChange('frontend', 'stickyHeader', e.target.checked)}
          />
          <ToggleSwitch
            label="Show Mega Menu"
            description="Enable mega menu for categories"
            checked={settings.frontend.showMegaMenu}
            onChange={(e) => handleInputChange('frontend', 'showMegaMenu', e.target.checked)}
          />
        </div>
      </div>

      {/* Homepage Settings */}
      <div className="bg-gradient-to-br from-gray-800/60 to-green-900/20 p-6 rounded-xl border border-green-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <PhotoIcon className="h-6 w-6 mr-3 text-green-400" />
          Homepage Settings
        </h3>
        
        <ToggleSwitch
          label="Enable Hero Section"
          description="Show hero banner on homepage"
          checked={settings.frontend.heroSectionEnabled}
          onChange={(e) => handleInputChange('frontend', 'heroSectionEnabled', e.target.checked)}
        />
        
        {settings.frontend.heroSectionEnabled && (
          <div className="mt-6 space-y-6">
            <SettingInput
              label="Hero Title"
              value={settings.frontend.heroTitle}
              onChange={(e) => handleInputChange('frontend', 'heroTitle', e.target.value)}
              placeholder="Welcome to Our Store"
            />
            <SettingInput
              label="Hero Subtitle"
              value={settings.frontend.heroSubtitle}
              onChange={(e) => handleInputChange('frontend', 'heroSubtitle', e.target.value)}
              placeholder="Discover amazing products"
            />
            <SettingInput
              label="Hero Button Text"
              value={settings.frontend.heroButtonText}
              onChange={(e) => handleInputChange('frontend', 'heroButtonText', e.target.value)}
              placeholder="Shop Now"
            />
            <SettingInput
              label="Hero Background Image URL"
              value={settings.frontend.heroBackgroundImage}
              onChange={(e) => handleInputChange('frontend', 'heroBackgroundImage', e.target.value)}
              placeholder="https://example.com/hero-bg.jpg"
            />
          </div>
        )}
      </div>

      {/* Product Display Settings */}
      <div className="bg-gradient-to-br from-gray-800/60 to-purple-900/20 p-6 rounded-xl border border-purple-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Cog6ToothIcon className="h-6 w-6 mr-3 text-purple-400" />
          Product Display
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingInput
            label="Products Per Page"
            type="number"
            value={settings.frontend.productsPerPage}
            onChange={(e) => handleInputChange('frontend', 'productsPerPage', parseInt(e.target.value))}
            min="6"
            max="48"
          />
          <SettingInput
            label="Desktop Grid Columns"
            type="number"
            value={settings.frontend.productGridColumns}
            onChange={(e) => handleInputChange('frontend', 'productGridColumns', parseInt(e.target.value))}
            min="2"
            max="6"
          />
          <SettingInput
            label="Mobile Grid Columns"
            type="number"
            value={settings.frontend.mobileProductColumns}
            onChange={(e) => handleInputChange('frontend', 'mobileProductColumns', parseInt(e.target.value))}
            min="1"
            max="3"
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <ToggleSwitch
            label="Show Product Ratings"
            description="Display star ratings on product cards"
            checked={settings.frontend.showProductRatings}
            onChange={(e) => handleInputChange('frontend', 'showProductRatings', e.target.checked)}
          />
          <ToggleSwitch
            label="Show Wishlist Button"
            description="Add wishlist button to product cards"
            checked={settings.frontend.showProductWishlist}
            onChange={(e) => handleInputChange('frontend', 'showProductWishlist', e.target.checked)}
          />
          <ToggleSwitch
            label="Enable Quick View"
            description="Allow quick product preview in modal"
            checked={settings.frontend.showProductQuickView}
            onChange={(e) => handleInputChange('frontend', 'showProductQuickView', e.target.checked)}
          />
          <ToggleSwitch
            label="Enable Product Zoom"
            description="Allow zooming on product images"
            checked={settings.frontend.enableProductZoom}
            onChange={(e) => handleInputChange('frontend', 'enableProductZoom', e.target.checked)}
          />
        </div>
      </div>

      {/* Live Preview */}
      <ResponsivePreview />
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-8">
      {/* Color Scheme */}
      <div className="bg-gradient-to-br from-gray-800/60 to-indigo-900/20 p-6 rounded-xl border border-indigo-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <PaintBrushIcon className="h-6 w-6 mr-3 text-indigo-400" />
          Color Scheme
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { key: 'primaryColor', label: 'Primary Color', description: 'Main brand color' },
            { key: 'secondaryColor', label: 'Secondary Color', description: 'Accent brand color' },
            { key: 'accentColor', label: 'Accent Color', description: 'Highlight color' },
            { key: 'backgroundColor', label: 'Background Color', description: 'Page background' },
            { key: 'textColor', label: 'Text Color', description: 'Main text color' },
            { key: 'linkColor', label: 'Link Color', description: 'Hyperlink color' },
            { key: 'successColor', label: 'Success Color', description: 'Success messages' },
            { key: 'warningColor', label: 'Warning Color', description: 'Warning messages' },
            { key: 'errorColor', label: 'Error Color', description: 'Error messages' }
          ].map(({ key, label, description }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-indigo-200 mb-2">{label}</label>
              <p className="text-xs text-gray-400 mb-2">{description}</p>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.appearance[key]}
                  onChange={(e) => handleInputChange('appearance', key, e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-600 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance[key]}
                  onChange={(e) => handleInputChange('appearance', key, e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div className="bg-gradient-to-br from-gray-800/60 to-purple-900/20 p-6 rounded-xl border border-purple-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <DocumentTextIcon className="h-6 w-6 mr-3 text-purple-400" />
          Typography
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Font Family</label>
            <select
              value={settings.appearance.fontFamily}
              onChange={(e) => handleInputChange('appearance', 'fontFamily', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Lato">Lato</option>
              <option value="Source Sans Pro">Source Sans Pro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">Heading Font</label>
            <select
              value={settings.appearance.headingFont}
              onChange={(e) => handleInputChange('appearance', 'headingFont', e.target.value)}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Playfair Display">Playfair Display</option>
              <option value="Merriweather">Merriweather</option>
              <option value="Oswald">Oswald</option>
            </select>
          </div>
          <SettingInput
            label="Base Font Size"
            value={settings.appearance.fontSize}
            onChange={(e) => handleInputChange('appearance', 'fontSize', e.target.value)}
            placeholder="16px"
          />
          <SettingInput
            label="Line Height"
            value={settings.appearance.lineHeight}
            onChange={(e) => handleInputChange('appearance', 'lineHeight', e.target.value)}
            placeholder="1.6"
          />
        </div>
      </div>

      {/* Layout & Spacing */}
      <div className="bg-gradient-to-br from-gray-800/60 to-green-900/20 p-6 rounded-xl border border-green-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <Cog6ToothIcon className="h-6 w-6 mr-3 text-green-400" />
          Layout & Spacing
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingInput
            label="Container Max Width"
            value={settings.appearance.containerMaxWidth}
            onChange={(e) => handleInputChange('appearance', 'containerMaxWidth', e.target.value)}
            placeholder="1200px"
          />
          <SettingInput
            label="Border Radius"
            value={settings.appearance.borderRadius}
            onChange={(e) => handleInputChange('appearance', 'borderRadius', e.target.value)}
            placeholder="8px"
          />
          <SettingInput
            label="Logo Width"
            value={settings.appearance.logoWidth}
            onChange={(e) => handleInputChange('appearance', 'logoWidth', e.target.value)}
            placeholder="150px"
          />
          <SettingInput
            label="Logo URL"
            value={settings.appearance.logoUrl}
            onChange={(e) => handleInputChange('appearance', 'logoUrl', e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
        
        <div className="mt-6 space-y-4">
          <ToggleSwitch
            label="Enable Animations"
            description="Add smooth transitions and animations"
            checked={settings.appearance.enableAnimations}
            onChange={(e) => handleInputChange('appearance', 'enableAnimations', e.target.checked)}
          />
          <ToggleSwitch
            label="Dark Mode"
            description="Enable dark theme"
            checked={settings.appearance.darkMode}
            onChange={(e) => handleInputChange('appearance', 'darkMode', e.target.checked)}
          />
        </div>
      </div>

      {/* Custom CSS */}
      <div className="bg-gradient-to-br from-gray-800/60 to-orange-900/20 p-6 rounded-xl border border-orange-500/10">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
          <CodeBracketIcon className="h-6 w-6 mr-3 text-orange-400" />
          Custom CSS
        </h3>
        <div>
          <label className="block text-sm font-medium text-orange-200 mb-2">Custom CSS Code</label>
          <textarea
            value={settings.appearance.customCSS}
            onChange={(e) => handleInputChange('appearance', 'customCSS', e.target.value)}
            rows={10}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all font-mono text-sm"
            placeholder="/* Add your custom CSS here */
.custom-button {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: white;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.custom-button:hover {
  transform: translateY(-2px);
}"
          />
        </div>
      </div>

      {/* Live Preview */}
      <ResponsivePreview />
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'frontend':
        return renderFrontendSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'layout':
        return <div className="text-white text-center py-12">Layout settings coming soon...</div>;
      case 'email':
        return <div className="text-white text-center py-12">Email settings coming soon...</div>;
      case 'payment':
        return <div className="text-white text-center py-12">Payment settings coming soon...</div>;
      case 'shipping':
        return <div className="text-white text-center py-12">Shipping settings coming soon...</div>;
      case 'security':
        return <div className="text-white text-center py-12">Security settings coming soon...</div>;
      case 'notifications':
        return <div className="text-white text-center py-12">Notification settings coming soon...</div>;
      case 'seo':
        return <div className="text-white text-center py-12">SEO settings coming soon...</div>;
      case 'social':
        return <div className="text-white text-center py-12">Social settings coming soon...</div>;
      case 'performance':
        return <div className="text-white text-center py-12">Performance settings coming soon...</div>;
      case 'api':
        return <div className="text-white text-center py-12">API settings coming soon...</div>;
      case 'backup':
        return <div className="text-white text-center py-12">Backup settings coming soon...</div>;
      default:
        return renderGeneralSettings();
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mx-auto mb-6"></div>
          <p className="text-white text-xl font-medium">Loading Settings...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing your control panel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-900/20 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6IiBzdHJva2U9IiM0MzM0NkQiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-5 pointer-events-none"></div>
      
      <div className="relative z-10 space-y-6 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Project Control Center
            </h1>
            <p className="text-gray-400 text-base sm:text-lg">
              Complete control over your e-commerce platform
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircleIcon className="h-4 w-4 text-green-400" />
              <span className="text-green-300">Auto-save enabled</span>
              <span className="text-gray-500">•</span>
              <span className="text-indigo-300">Last updated: {new Date().toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSave(activeTab)}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={handleSaveAll}
              disabled={loading}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base font-medium"
            >
              {loading ? 'Saving...' : 'Save All'}
            </button>
            <button
              onClick={exportSettings}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg text-sm sm:text-base font-medium"
            >
              Export
            </button>
            <label className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-700 hover:to-orange-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg text-sm sm:text-base font-medium cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importSettings}
                className="hidden"
              />
            </label>
            <button
              onClick={resetSettings}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-700 hover:to-rose-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 shadow-lg text-sm sm:text-base font-medium"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gradient-to-r from-gray-800/60 to-indigo-900/30 backdrop-blur-xl rounded-2xl p-2 border border-indigo-500/10 shadow-2xl">
          <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 xl:grid-cols-14 gap-2" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50 hover:scale-102'
                } group relative overflow-hidden py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-center rounded-xl transition-all duration-200 flex flex-col items-center space-y-1 min-h-[80px] justify-center`}
              >
                <tab.icon className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                <span className="hidden sm:block leading-tight">{tab.name}</span>
                <span className="sm:hidden text-[10px] leading-tight">{tab.name.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-gray-800/40 to-indigo-900/20 backdrop-blur-xl rounded-2xl border border-indigo-500/10 shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;