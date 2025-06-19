
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, LogOut, Settings, Palette, Bell, Search, Globe, Sparkles, Crown } from 'lucide-react';
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
          ? 'bg-gradient-to-r from-[#726E75]/95 via-[#F19A3E]/95 to-[#7FC29B]/95 backdrop-blur-2xl shadow-2xl border-b-4 border-[#F19A3E]' 
          : 'bg-gradient-to-r from-[#726E75]/90 via-[#F19A3E]/90 to-[#7FC29B]/90 backdrop-blur-xl border-b-2 border-[#F19A3E]/60'
      }`}>
        {/* Enhanced gradient border */}
        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#7FC29B] via-[#F19A3E] to-[#D7F171] opacity-90" />
        
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="flex justify-between items-center h-20 lg:h-24">
            {/* Enhanced Logo */}
            <div className="flex items-center flex-shrink-0 group">
              <Link to="/about" className="flex items-center space-x-4 transform hover:scale-105 transition-all duration-500">
                <div className="relative p-3 bg-gradient-to-br from-[#F19A3E] via-[#D7F171] to-[#7FC29B] rounded-3xl group-hover:rotate-12 transition-all duration-500 shadow-2xl group-hover:shadow-3xl border-3 border-white/40">
                  <Palette className="h-6 w-6 lg:h-8 lg:w-8 text-white drop-shadow-lg" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl" />
                  <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-[#D7F171] animate-pulse drop-shadow-md" />
                  <Crown className="absolute -top-2 -left-2 h-4 w-4 text-[#F19A3E] animate-bounce drop-shadow-md" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent tracking-tight drop-shadow-2xl">
                    {siteTitle}
                  </h1>
                  <p className="text-sm sm:text-base text-[#B5EF8A] -mt-1 font-black tracking-wider drop-shadow-lg">{siteSubtitle}</p>
                </div>
                <div className="sm:hidden">
                  <h1 className="text-xl font-black bg-gradient-to-r from-white via-[#D7F171] to-[#B5EF8A] bg-clip-text text-transparent drop-shadow-2xl">
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
                  className={`relative px-6 py-4 text-lg font-black transition-all duration-300 rounded-2xl group transform hover:scale-110 border-3 ${
                    activeItem === item.name
                      ? 'text-white bg-gradient-to-r from-[#F19A3E] to-[#D7F171] shadow-2xl border-white/60 scale-110'
                      : 'text-white hover:text-[#D7F171] hover:bg-white/20 border-transparent hover:border-[#F19A3E]/60 hover:shadow-xl'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  {...(item.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  <span className="relative z-10 drop-shadow-lg tracking-wide">{item.name}</span>
                  {activeItem !== item.name && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#F19A3E]/30 to-[#D7F171]/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </Link>
              ))}
            </div>

            {/* Enhanced Desktop Auth */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* Enhanced Search */}
                  <div className="relative">
                    {isSearchOpen ? (
                      <form onSubmit={handleSearch} className="flex items-center">
                        <Input
                          type="text"
                          placeholder="Search courses..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-56 bg-white/20 border-3 border-[#F19A3E]/60 text-white placeholder-[#B5EF8A] focus:bg-white/30 focus:border-[#F19A3E] transition-all duration-300 backdrop-blur-xl rounded-xl text-lg font-bold"
                          autoFocus
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          className="ml-2 p-3 text-[#B5EF8A] hover:text-white hover:bg-[#F19A3E]/30 rounded-xl border-2 border-transparent hover:border-[#F19A3E]/60"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </form>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-3 text-white hover:text-[#D7F171] hover:bg-white/20 rounded-xl transition-all duration-300 border-3 border-transparent hover:border-[#F19A3E]/60 hover:shadow-xl"
                        onClick={() => setIsSearchOpen(true)}
                      >
                        <Search className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  
                  {/* Enhanced Notification Bell */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative p-3 text-white hover:text-[#D7F171] hover:bg-white/20 rounded-xl transition-all duration-300 border-3 border-transparent hover:border-[#F19A3E]/60 hover:shadow-xl"
                    onClick={() => navigate('/announcements')}
                  >
                    <Bell className="h-5 w-5" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#F19A3E] to-[#D7F171] rounded-full animate-pulse shadow-xl border-2 border-white" />
                  </Button>

                  {/* Enhanced User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-3 hover:bg-white/20 text-lg rounded-xl px-4 py-3 transition-all duration-300 group border-3 border-transparent hover:border-[#F19A3E]/60 hover:shadow-xl">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F19A3E] to-[#D7F171] flex items-center justify-center text-white font-black text-sm group-hover:scale-110 transition-transform duration-300 shadow-xl border-3 border-white/40">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                        <span className="hidden lg:inline max-w-24 xl:max-w-32 truncate text-white font-black">{displayName}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 bg-gradient-to-br from-[#726E75]/98 to-[#F19A3E]/98 backdrop-blur-2xl border-3 border-[#F19A3E]/60 shadow-2xl rounded-2xl">
                      <div className="p-4 border-b-2 border-[#F19A3E]/40 bg-gradient-to-r from-[#F19A3E]/30 to-[#D7F171]/30 rounded-t-xl">
                        <p className="text-lg font-black text-white drop-shadow-lg">{profile?.full_name || displayName}</p>
                        <p className="text-sm text-[#B5EF8A] drop-shadow-sm font-bold">{user?.email}</p>
                      </div>
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-[#F19A3E]/30 text-white rounded-xl m-2 font-black text-lg py-3">
                        <User className="mr-3 h-5 w-5 text-[#B5EF8A]" />
                        Artist Profile
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-[#F19A3E]/30 text-white rounded-xl m-2 font-black text-lg py-3">
                          <Settings className="mr-3 h-5 w-5 text-[#B5EF8A]" />
                          Admin Panel
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-[#F19A3E]/40 my-2" />
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-600/30 text-red-300 rounded-xl m-2 font-black text-lg py-3">
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" asChild className="hover:bg-white/20 text-white hover:text-[#D7F171] rounded-xl transition-all duration-300 border-3 border-transparent hover:border-[#F19A3E]/60 font-black text-lg px-6 py-3">
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild className="bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white border-0 rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 font-black px-8 py-3 text-lg border-3 border-white/40">
                    <Link to="/signup">Join the Elite</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Enhanced Mobile menu button with improved responsiveness */}
            <div className="flex items-center md:hidden space-x-2">
              {user && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 sm:p-3 text-white hover:text-[#D7F171] hover:bg-white/20 rounded-xl border-2 border-transparent hover:border-[#F19A3E]/60 transition-all duration-300"
                    onClick={() => navigate('/announcements')}
                    aria-label="View announcements"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[#F19A3E] to-[#D7F171] rounded-full animate-pulse shadow-lg border border-white" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 sm:p-2 hover:bg-white/20 rounded-xl border-2 border-transparent hover:border-[#F19A3E]/60 transition-all duration-300"
                        aria-label="User menu"
                      >
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#F19A3E] to-[#D7F171] flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg border-2 border-white/40">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 sm:w-56 bg-gradient-to-br from-[#726E75]/98 to-[#F19A3E]/98 backdrop-blur-2xl border-2 border-[#F19A3E]/60 shadow-2xl rounded-xl">
                      <DropdownMenuItem onClick={() => navigate('/dashboard')} className="hover:bg-[#F19A3E]/30 text-white rounded-lg m-2 font-bold text-sm sm:text-base py-2 sm:py-3">
                        <User className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-[#B5EF8A]" />
                        Profile
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-[#F19A3E]/30 text-white rounded-lg m-2 font-bold text-sm sm:text-base py-2 sm:py-3">
                          <Settings className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-[#B5EF8A]" />
                          Admin
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator className="bg-[#F19A3E]/40 my-1" />
                      <DropdownMenuItem onClick={handleLogout} className="hover:bg-red-600/30 text-red-300 rounded-lg m-2 font-bold text-sm sm:text-base py-2 sm:py-3">
                        <LogOut className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 sm:p-3 text-white hover:text-[#D7F171] hover:bg-white/20 rounded-xl transition-all duration-300 transform hover:scale-110 border-2 border-transparent hover:border-[#F19A3E]/60 focus:outline-none focus:ring-2 focus:ring-[#F19A3E] focus:ring-offset-2 focus:ring-offset-transparent"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? 
                  <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300" /> : 
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300" />
                }
              </button>
            </div>
          </div>

          {/* Enhanced Mobile Navigation with smooth animations */}
          <div className={`md:hidden transition-all duration-300 ease-out ${
            isMenuOpen 
              ? 'max-h-screen opacity-100 border-t-2 border-[#F19A3E]/40' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-6 sm:pb-8 space-y-3 bg-gradient-to-b from-[#726E75]/98 to-[#F19A3E]/98 backdrop-blur-2xl rounded-b-2xl shadow-2xl">
              {/* Mobile Search */}
              <div className="mb-4 sm:mb-6">
                <form onSubmit={handleSearch} className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-white/20 border-2 border-[#F19A3E]/60 text-white placeholder-[#B5EF8A]/80 backdrop-blur-xl rounded-lg font-medium text-sm sm:text-base py-2 sm:py-3 focus:border-[#F19A3E] focus:ring-2 focus:ring-[#F19A3E]/20"
                  />
                  <Button 
                    type="submit" 
                    variant="ghost" 
                    size="sm" 
                    className="px-3 sm:px-4 text-white hover:text-[#D7F171] hover:bg-white/20 border-2 border-transparent hover:border-[#F19A3E]/60 rounded-lg transition-all duration-300"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </form>
              </div>

              {/* Navigation Items */}
              <nav className="space-y-2" role="navigation" aria-label="Mobile navigation">
                {navItems.map((item, index) => (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`block px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] border-2 ${
                      activeItem === item.name
                        ? 'text-white bg-gradient-to-r from-[#F19A3E] to-[#D7F171] shadow-lg border-white/60'
                        : 'text-white hover:text-[#D7F171] hover:bg-white/20 border-transparent hover:border-[#F19A3E]/60'
                    }`}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)'
                    }}
                    onClick={() => setIsMenuOpen(false)}
                    {...(item.is_external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </div>
                  </Link>
                ))}
              </nav>
              
              {/* Auth Actions for Non-Logged Users */}
              {!user && (
                <div className="border-t-2 border-[#F19A3E]/40 pt-4 sm:pt-6 space-y-2 sm:space-y-3">
                  <Link
                    to="/login"
                    className="block px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-bold text-white hover:text-[#D7F171] hover:bg-white/20 rounded-xl transition-all duration-300 border-2 border-transparent hover:border-[#F19A3E]/60"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Login</span>
                    </div>
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] rounded-xl transition-all duration-300 border-2 border-white/40 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Join Elite</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
                      to="/signup"
                      className="block px-6 py-4 text-lg font-black bg-gradient-to-r from-[#F19A3E] to-[#D7F171] hover:from-[#e8893a] hover:to-[#c9e961] text-white rounded-2xl transition-all duration-300 shadow-2xl text-center border-3 border-white/40"
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
