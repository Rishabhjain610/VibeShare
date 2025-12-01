import React from 'react';
import { Home, Search, User, Film, PlusSquare } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user.userData);
  
  const navItems = [
    { icon: Home, path: '/' },
    { icon: Search, path: '/search' },
    { icon: PlusSquare, path: '/upload', isCenter: true },
    { icon: Film, path: '/reels' },
    { icon: User, path: `/profile/${userData?.userName}` },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50  w-[90%] max-w-md">
      
      <div className="bg-white/90 backdrop-blur-lg border border-gray-200 rounded-full shadow-xl px-6 py-3">
        <div className="flex items-center justify-between">
          {navItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            const isCenter = item.isCenter;
            
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`group ${isCenter ? 'mx-4' : ''}`}
              >
                <div className={`p-2 rounded-full transition-all duration-300 ${
                  isCenter
                    ? 'bg-gradient-to-tr from-purple-600 to-pink-600 shadow-lg scale-110'
                    : isActive 
                      ? 'bg-purple-100' 
                      : 'hover:bg-gray-100'
                }`}>
                  <item.icon 
                    size={24} 
                    className={`transition-colors ${
                      isCenter
                        ? 'text-white'
                        : isActive 
                          ? 'text-purple-600' 
                          : 'text-gray-600 group-hover:text-purple-600'
                    }`}
                    strokeWidth={isCenter ? 2.5 : 2}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;