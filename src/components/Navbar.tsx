
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
      <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-[#726E75]/98 backdrop-blur-xl shadow-2xl border-b-2 border-[#F19A3E]/50' 
          : 'bg-[#726E75]/95 backdrop-blur-md border-b border-[#F19A3E]/30'
      }`}>
        {/* Enhanced gradient border */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#7FC29B] via-[#F19A3E] to-[#D7F171] opacity-90" />
        
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-20">
            {/* Enhanced Logo */}
            <div className="flex items-center flex-shrink-0 group">
              <Link to="/about" className="flex items-center space-x-3 transform hover:scale-105 transition-all duration-500">
                <div className="relative p-2 sm:p-2.5 bg-gradient-to-br from-[#F19A3E] via-[#D7F171] to-[#7FC29B] rounded-2xl group-hover:rotate-12 transition-all duration-500 shadow-xl group-hover:shadow-2xl border-2 border-white/20">
                  <Palette className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl" />
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-[#D7F171] animate-pulse drop-shadow-md" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent tracking-tight drop-shadow-lg">
                    {siteTitle}
                  </h1>
                  <p className="text-xs sm:text-sm text-[#B5EF8A] -mt-1 font-medium tracking-wide drop-shadow-sm">{siteSubtitle}</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent drop-shadow-lg">
                    {siteTitle}
                  </h1>
                </div>
              </Link>
            </div>

            {/* Enhanced Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`relative px-4 py-3 text-sm font-semibold transition-all duration-300 rounded-xl group transform hover:scale-105 ${
                    activeItem === item.name
                      ? 'text-white bg-gradient-to-r from-[#F19A3E] to-[#D7F171] shadow-xl border-2 border-white/30'
                      : 'text-white hover:text-[#D7F171] hover:bg-white/10 border-2 border-transparent hover:border-[#F19A3E]/40'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  {...(item.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="relative z-10 drop-shadow-sm">{item.name}</span>
                  {activeItem !== item.name && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F19A3E]/20 to-[#D7F171]/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                          className="w-48 bg-white/10 border-2 border-[#F19A3E]/50 text-white placeholder-[#B5EF8A] focus:bg-white/20 focus:border-[#F19A3E] transition-all duration-300 backdrop-blur-md"
                          autoFocus
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 p-2 text-[#B5EF8A] hover:text-white hover:bg-[#F19A3E]/20 rounded-xl"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </form>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2 text-white hover:text-[#D7F171] hover:bg-white/10 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-[#F19A3E]/40"
                        onClick={() => setIsSearchOpen(true)}
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Enhanced Notification Bell */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative p-2 text-white hover:text-[#D7F171] hover:bg-white/10 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-[#F19A3E]/40"
                    onClick={() => navigate('/announcements')}
                  >
                    <Bell className="h-4 w-4" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#F19A3E] to-[#D7F171] rounded-full animate-pulse shadow-lg" />
                  </Button>

                  {/* Enhanced User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 hover:bg-white/10 text-sm rounded-xl px-3 py-2 transition-all duration-300 group border-2 border-transparent hover:border-[#F19A3E]/40">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#F19A3E] to-[#D7F171] flex items-center justify-center text-white font-semibold text-xs group-hover:scale-110 transition-transform duration-300 shadow-lg border-2 border-white/20">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:inline max-w-20 xl:max-w-24 truncate text-white font-medium">{displayName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-[#726E75]/98 backdrop-blur-2xl border-2 border-[#F19A3E]/40 shadow-2xl rounded-2xl">
                      <div className="p-3 border-b border-[#F19A3E]/30 bg-gradient-to-r from-[#F19A3E]/20 to-[#D7F171]/20 rounded-t-xl">
                        <p className="text-sm font-medium text-white drop-shadow-sm">{profile?.full_name || displayName}</p>
                        <p className="text-xs text-[#B5EF8A] drop-shadow-sm">{user?.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-[#F19A3E]/20 text-white rounded-xl m-1 font-medium">
                        <User className="mr-2 h-4 w-4 text-[#B5EF8A]" />
                        Artist Profile
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-[#F19A3E]/20 text-white rounded-xl m-1 font-medium">
                          <Settings className="mr-2 h-4 w-4 text-[#B5EF8A]" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-[#F19A3E]/30" />
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-600/20 text-red-300 rounded-xl m-1 font-medium">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-white/10 text-white hover:text-[#D7F171] rounded-xl transition-all duration-300 border-2 border-transparent hover:border-[#F19A3E]/40 font-medium">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white border-0 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold px-6 border-2 border-white/20">
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
                    className="p-2 text-white hover:text-[#D7F171] hover:bg-white/10 rounded-xl border-2 border-transparent hover:border-[#F19A3E]/40"
                    onClick={() => navigate('/announcements')}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10 rounded-xl border-2 border-transparent hover:border-[#F19A3E]/40">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#F19A3E] to-[#D7F171] flex items-center justify-center text-white font-semibold text-xs shadow-lg border border-white/20">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#726E75]/98 backdrop-blur-2xl border-2 border-[#F19A3E]/40 shadow-2xl rounded-2xl">
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-[#F19A3E]/20 text-white rounded-xl m-1 font-medium">
                        <User className="mr-2 h-4 w-4 text-[#B5EF8A]" />
                        Profile
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-[#F19A3E]/20 text-white rounded-xl m-1 font-medium">
                          <Settings className="mr-2 h-4 w-4 text-[#B5EF8A]" />
                          Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-[#F19A3E]/30" />
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-600/20 text-red-300 rounded-xl m-1 font-medium">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-white hover:text-[#D7F171] hover:bg-white/10 rounded-xl transition-all duration-300 transform hover:scale-110 border-2 border-transparent hover:border-[#F19A3E]/40"
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
            <div className="md:hidden border-t-2 border-[#F19A3E]/30 backdrop-blur-2xl">
              <div className="px-4 pt-4 pb-6 space-y-2 bg-gradient-to-b from-[#726E75]/95 to-[#726E75]/98 rounded-b-3xl shadow-2xl">
                {/* Mobile Search */}
                <div className="mb-4">
                  <form onSubmit={handleSearch} className="flex">
                    <Input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-white/10 border-2 border-[#F19A3E]/40 text-white placeholder-[#B5EF8A] backdrop-blur-md"
                    />
                    <Button type="submit" variant="ghost" size="sm" className="ml-2 text-white hover:text-[#D7F171] hover:bg-white/10 border-2 border-transparent hover:border-[#F19A3E]/40">
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>

                {navItems.map((item, index) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`block px-4 py-3 text-base font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 ${
                      activeItem === item.name
                        ? 'text-white bg-gradient-to-r from-[#F19A3E] to-[#D7F171] shadow-xl border-white/30'
                        : 'text-white hover:text-[#D7F171] hover:bg-white/10 border-transparent hover:border-[#F19A3E]/40'
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
                  <div className="border-t-2 border-[#F19A3E]/30 pt-4 space-y-2">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-base font-semibold text-white hover:text-[#D7F171] hover:bg-white/10 rounded-2xl transition-all duration-300 border-2 border-transparent hover:border-[#F19A3E]/40"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 text-base font-semibold bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white rounded-2xl transition-all duration-300 shadow-xl text-center border-2 border-white/20"
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
