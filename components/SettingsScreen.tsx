import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const SettingsHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
    <header className="flex items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
        <button onClick={onBack} className="text-gray-500 hover:text-black">
            <i className="fa-solid fa-arrow-left text-lg"></i>
        </button>
        <h1 className="font-semibold text-lg text-gray-800 mx-auto">{title}</h1>
        <div className="w-8"></div>
    </header>
);

const EditProfileView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="h-full flex flex-col bg-gray-50">
        <SettingsHeader title="Edit Profile" onBack={onBack} />
        <main className="flex-1 p-4 text-center text-gray-500">
            <p>Profile editing functionality will be available here soon.</p>
        </main>
    </div>
);

const NotificationsView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="h-full flex flex-col bg-gray-50">
        <SettingsHeader title="Notifications" onBack={onBack} />
        <main className="flex-1 p-4 text-center text-gray-500">
            <p>Notification settings will be available here soon.</p>
        </main>
    </div>
);

const PrivacyView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="h-full flex flex-col bg-gray-50">
        <SettingsHeader title="Privacy & Security" onBack={onBack} />
        <main className="flex-1 p-4 text-center text-gray-500">
            <p>Privacy and security settings will be available here soon.</p>
        </main>
    </div>
);


const SettingsItem: React.FC<{ icon: string; label: string; onClick?: () => void; isDestructive?: boolean; children?: React.ReactNode }> = ({ icon, label, onClick, isDestructive = false, children }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between p-4 rounded-lg bg-white border border-gray-200 text-left ${isDestructive ? 'text-red-500' : 'text-gray-800'} hover:bg-gray-50 transition-colors`}
    >
        <div className="flex items-center">
            <i className={`fa-solid ${icon} w-6 text-center mr-3 text-gray-400`}></i>
            <span className="font-medium">{label}</span>
        </div>
        <div>
            {children ? children : <i className="fa-solid fa-chevron-right text-gray-400"></i>}
        </div>
    </button>
);

const SettingsScreen: React.FC<{ onNavigate: (screen: 'dashboard') => void }> = ({ onNavigate }) => {
    const { deleteUser } = useAuth();
    const [view, setView] = useState<'main' | 'edit-profile' | 'notifications' | 'privacy'>('main');

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.")) {
            try {
                await deleteUser();
                // AuthProvider will handle signout and state change, which will unmount this component.
                alert("Account deleted successfully.");
            } catch (error) {
                alert(`Error deleting account: ${error instanceof Error ? error.message : "An unknown error occurred."}`);
            }
        }
    };

    if (view === 'edit-profile') return <EditProfileView onBack={() => setView('main')} />;
    if (view === 'notifications') return <NotificationsView onBack={() => setView('main')} />;
    if (view === 'privacy') return <PrivacyView onBack={() => setView('main')} />;

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <header className="flex items-center p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm z-10 sticky top-0">
                <button onClick={() => onNavigate('dashboard')} className="text-gray-500 hover:text-black">
                    <i className="fa-solid fa-arrow-left text-lg"></i>
                </button>
                <h1 className="font-semibold text-lg text-gray-800 mx-auto">Settings</h1>
                <div className="w-8"></div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 space-y-3">
                <SettingsItem icon="fa-user-pen" label="Edit Profile" onClick={() => setView('edit-profile')} />
                <SettingsItem icon="fa-bell" label="Notifications" onClick={() => setView('notifications')} />
                <SettingsItem icon="fa-shield-halved" label="Privacy & Security" onClick={() => setView('privacy')} />
                <div className="pt-4">
                    <SettingsItem icon="fa-trash" label="Delete Account" isDestructive onClick={handleDeleteAccount} />
                </div>
            </main>
        </div>
    );
};

export default SettingsScreen;