
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Palette, Bell, Search, Globe, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useNavigationItems } from '@/hooks/useNavigationItems';
import { useWebsiteSettings } from '@/hooks/useWebsiteSettings';

const Navbar = () => {
  const { user, profile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState('');
  const { navItems } = useNavigationItems();
  const { getSetting } = useWebsiteSettings();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const activeNav = navItems.find(item => item.path === currentPath);
    setActiveItem(activeNav?.name || '');
  }, [location.pathname, navItems]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to courses with search query
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Get dynamic site settings
  const siteTitle = getSetting('site_title', 'Kala Suroop');
  const siteSubtitle = getSetting('site_subtitle', 'Art Academy');
  const showUserFirstName = getSetting('show_user_first_name', true);

  // Extract first name from full_name or fall back to email
  const displayName = showUserFirstName && profile?.full_name?.split(' ')[0] || user?.email || 'User';

  return (
    <>
      {/* Premium Background Blur Overlay */}
      <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-2xl z-40" />
      
      <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-700 ease-out ${
        scrolled 
          ? 'bg-white/10 backdrop-blur-3xl shadow-2xl border-b border-white/20' 
          : 'bg-transparent'
      }`}>
        {/* Animated gradient border */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-60" />
        
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center flex-shrink-0 group">
              <Link to="/" className="flex items-center space-x-3 transform hover:scale-105 transition-all duration-500">
                <div className="relative p-2 sm:p-2.5 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-xl group-hover:shadow-2xl">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-300 animate-pulse" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent tracking-tight">
                    {siteTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-purple-300/80 -mt-1 font-medium tracking-wide">{siteSubtitle}</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                    {siteTitle}
                  </h1>
                </div>
              </Link>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-xl group ${
                    activeItem === item.name
                      ? 'text-white bg-white/10 shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  {...(item.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {activeItem === item.name && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-xl animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* Enhanced Desktop Auth */}
            <div className="hidden md:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  {/* Enhanced Search */}
                  <div className="relative">
                    {isSearchOpen ? (
                      <form onSubmit={handleSearch} className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Search courses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-48 bg-white/10 border-purple-300/30 text-white placeholder-purple-200 focus:bg-white/20 transition-all duration-300"
                          autoFocus
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 p-2 text-purple-200 hover:text-white"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </form>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                        onClick={() => setIsSearchOpen(true)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Enhanced Notification Bell - Now links to Announcements */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300"
                    onClick={() => navigate('/announcements')}
                  >
                    <Bell className="h-4 w-4" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-pulse" />
                  </Button>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10 text-sm rounded-xl px-3 py-2 transition-all duration-300 group">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs group-hover:scale-110 transition-transform duration-300">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:inline max-w-20 xl:max-w-24 truncate text-white font-medium">{displayName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/20 shadow-2xl rounded-2xl">
                      <div className="p-3 border-b border-purple-500/20">
                        <p className="text-sm font-medium text-white">{profile?.full_name || displayName}</p>
                        <p className="text-xs text-purple-300">{user?.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-purple-600/20 text-white rounded-xl m-1">
                        <User className="mr-2 h-4 w-4 text-purple-400" />
                        Artist Profile
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-purple-600/20 text-white rounded-xl m-1">
                          <Settings className="mr-2 h-4 w-4 text-purple-400" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-600/20 text-red-300 rounded-xl m-1">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-white/10 text-purple-200 hover:text-white rounded-xl transition-all duration-300">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Link to="/signup">Join the Elite</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Enhanced Mobile menu button */}
            <div className="flex items-center md:hidden space-x-2">
              {user && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl"
                    onClick={() => navigate('/announcements')}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10 rounded-xl">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xs">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/20 shadow-2xl rounded-2xl">
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-purple-600/20 text-white rounded-xl m-1">
                        <User className="mr-2 h-4 w-4 text-purple-400" />
                        Profile
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-purple-600/20 text-white rounded-xl m-1">
                          <Settings className="mr-2 h-4 w-4 text-purple-400" />
                          Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-purple-500/20" />
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-600/20 text-red-300 rounded-xl m-1">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110"
              >
                {isMenuOpen ? 
                  <X className="h-5 w-5 animate-spin" /> : 
                  <Menu className="h-5 w-5" />
                }
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-white/10 backdrop-blur-2xl">
              <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-slate-900/90 to-purple-900/90 rounded-b-3xl">
                {/* Mobile Search */}
                <div className="mb-4">
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-white/10 border-purple-300/30 text-white placeholder-purple-200"
                    />
                    <Button type="submit" variant="ghost" size="sm" className="ml-2 text-purple-200">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {navItems.map((item, index) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`block px-4 py-3 text-base font-medium rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                      activeItem === item.name
                        ? 'text-white bg-gradient-to-r from-purple-600/30 to-pink-600/30 shadow-lg'
                        : 'text-purple-200 hover:text-white hover:bg-white/10'
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setIsMenuOpen(false)}
                    {...(item.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                ))}
                
                {!user && (
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-base font-medium text-purple-200 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all duration-300 shadow-lg text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Join the Elite Community
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
