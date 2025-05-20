import React from 'react';

export default function Page() {
  return (
<> 
      <div className="p-8">
        <h2 className="text-4xl font-medium text-green-800 mb-8">Vos Rendez-vous</h2>
        
        <div className="space-y-6 max-w-4xl">
          {/* Premier rendez-vous */}
          <div className="bg-gray-100 rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-medium">Cardiologue</h3>
                <p className="text-gray-700 mt-1">Docteur Thierry Doberman</p>
                <p className="text-lg font-medium mt-2">11H - 12h</p>
                
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">19 mai 2025</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">38 rue du normand</span>
                  </div>
                </div>
              </div>
              
              <button className="text-2xl font-medium">X</button>
            </div>
          </div>
          
          {/* Deuxième rendez-vous (sélectionné) */}
          <div className="bg-white border-2 rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-medium">Orthopediste</h3>
                <p className="text-gray-700 mt-1">Docteur Armand Caniche</p>
                <p className="text-lg font-medium mt-2">11H - 12h</p>
                
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">19 mai 2025</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">38 rue du normand</span>
                  </div>
                </div>
              </div>
              
              <button className="text-2xl font-medium">X</button>
            </div>
          </div>

          {/* Bouton pour ajouter un nouveau rendez-vous */}
          <div className="mt-8">
            <button className="bg-green-100 text-green-800 rounded-md px-6 py-3 hover:bg-green-200 transition-colors flex items-center">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Planifier un nouveau rendez-vous
            </button>
          </div>
        </div>
      </div>
 </>
  );
}