import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Store Locations', href: '/stores' },
      { name: 'Our Blog', href: '/blog' },
    ],
    shop: [
      { name: "Men's Collection", href: '/category/mens' },
      { name: "Women's Collection", href: '/category/womens' },
      { name: 'New Arrivals', href: '/new-arrivals' },
      { name: 'Special Offers', href: '/offers' },
    ],
    support: [
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping Info', href: '/shipping' },
      { name: 'Returns', href: '/returns' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Admin Login', href: '/admin/login' },
    ],
    legal: [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Cookie Policy', href: '/cookies' },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 border-b border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 rounded-full mb-8">
              <EnvelopeIcon className="h-6 w-6 text-indigo-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-indigo-200/60 mb-8">
              Stay updated with our latest collections, fashion tips, and exclusive offers
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg text-white placeholder-indigo-200/40 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5"
              >
                <span className="relative flex items-center justify-center w-full h-full px-6 py-2.5 bg-gray-900 rounded-[0.4rem] group-hover:bg-opacity-0 transition-all duration-300">
                  <span className="absolute flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 group-hover:translate-x-0 ease">
                    <EnvelopeIcon className="h-5 w-5" />
                  </span>
                  <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">
                    Subscribe
                  </span>
                  <span className="relative invisible">Subscribe</span>
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="block mb-4">
              <h2 className="text-3xl font-extrabold">FashionFusion</h2>
            </Link>
            <p className="text-indigo-200/60 mb-6 max-w-sm">
              Discover your unique style with our curated collection of the latest trends.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-indigo-400" />
                <span className="text-indigo-200/80">123 Style St, Fashion City</span>
              </div>
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-indigo-400" />
                <a href="mailto:support@fashionfusion.com" className="text-indigo-200/80 hover:text-indigo-300">support@fashionfusion.com</a>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-indigo-200/80 hover:text-indigo-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-indigo-200/80 hover:text-indigo-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-indigo-200/80 hover:text-indigo-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-indigo-200/80 hover:text-indigo-300 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-indigo-200/60 text-sm text-center md:text-left">
              © {currentYear} FashionFusion. All Rights Reserved. Designed with ❤️.
            </div>
            
            {/* Social & Payment */}
            <div className="flex items-center gap-6">
              {/* Social Links */}
              <div className="flex gap-4">
                <a href="#" className="text-indigo-400 hover:text-white transition-colors"><FaFacebook size={20} /></a>
                <a href="#" className="text-indigo-400 hover:text-white transition-colors"><FaTwitter size={20} /></a>
                <a href="#" className="text-indigo-400 hover:text-white transition-colors"><FaInstagram size={20} /></a>
                <a href="#" className="text-indigo-400 hover:text-white transition-colors"><FaLinkedin size={20} /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 