import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Screen } from '../types';
import Spinner from './Spinner';

const SettingsHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
        <button onClick={onBack} className="text-gray-500 hover:text-black w-8">
            <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <h1 className="font-semibold text-lg text-gray-800">{title}</h1>
        <div className="w-8"></div>
    </header>
);

const SettingsScreen: React.FC<{ onNavigate: (screen: Screen) => void }> = ({ onNavigate }) => {
    const { user, signOut, deleteUser } = useAuth();
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
            setIsDeleting(true);
            setDeleteError(null);
            try {
                await deleteUser();
                // The onAuthStateChange listener in AuthContext will handle session change and UI update.
            } catch (error: any) {
                setDeleteError(error.message || 'An unknown error occurred while deleting your account.');
                setIsDeleting(false);
            }
        }
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <SettingsHeader title="Settings" onBack={() => onNavigate('dashboard')} />
            <main className="flex-1 overflow-y-auto p-4 space-y-6 animate-fade-in-up">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Account Information</h3>
                    <div className="text-sm text-gray-600">
                        <p><strong>Email:</strong> {user?.email}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Actions</h3>
                    <button
                        onClick={signOut}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <i className="fa-solid fa-right-from-bracket w-6 mr-2"></i> Logout
                    </button>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mt-4">
                    <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                    <button
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="w-full flex justify-center items-center px-4 py-3 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300 transition-colors"
                    >
                        {isDeleting ? <Spinner /> : 'Delete My Account'}
                    </button>
                    {deleteError && <p className="text-xs text-red-500 mt-2 text-center">{deleteError}</p>}
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;
