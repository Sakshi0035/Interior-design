import React from 'react';
import { useAuth } from './contexts/AuthContext';
import AuthScreen from './components/AuthScreen';
import MainApp from './components/MainApp';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
       <div className="w-full h-screen max-w-sm mx-auto flex justify-center items-center bg-gray-50">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="w-full h-screen max-w-sm mx-auto flex flex-col font-sans transition-colors duration-300 bg-gray-50 text-gray-800">
      {!session ? <AuthScreen /> : <MainApp />}
    </div>
  );
};

export default App;