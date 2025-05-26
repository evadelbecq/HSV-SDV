import React from 'react';

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Header Navigation */}
      <header className="flex justify-between items-center px-2 h-30 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src="/assets/svg/HSV-removebg-preview - Copie.svg"
            alt="HSV Logo"
            className="w-[100px] h-auto text-green-500"
          />
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-xl text-gray-800">Bonjour, John Doe !</h1>
        </div>

        <div className="text-green-700">
          <p className="text-sm">Vendredi 27 juin 2025&nbsp;&nbsp;14:18</p>
        </div>
      </header>

      <div className="flex">
        <aside className="w-30 border-r border-gray-200 h-screen flex flex-col items-center py-6 gap-8">
          {/* User Profile Icon */}
          <a href="#" className="text-green-600 hover:text-green-800">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </a>

          {/* Add Icon */}
          <a href="#" className="text-green-600 hover:text-green-800">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </div>
          </a>

          {/* Calendar Icon */}
          <a href="#" className="text-green-600 hover:text-green-800 relative">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="absolute -bottom-1 -right-1 bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">1</span>
          </a>

          {/* Settings Icon */}
          <a href="#" className="text-gray-400 hover:text-gray-600">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </div>
          </a>

          {/* Logout Icon */}
          <a href="#" className="text-green-600 hover:text-green-800 mt-auto">
            <div className="w-10 h-10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-3.293-3.293a1 1 0 00-1.414 1.414L11.586 7H7a1 1 0 100 2h4.586l-2.293 2.293a1 1 0 101.414 1.414L14 9.414V13a1 1 0 102 0V7.414z" clipRule="evenodd" />
              </svg>
            </div>
          </a>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </>
  );
}