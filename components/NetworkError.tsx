import React from 'react';

const NetworkError: React.FC = () => {
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-4 text-gray-800">
            <div className="w-full max-w-sm mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
                <i className="fa-solid fa-circle-exclamation text-4xl text-yellow-500 mb-4"></i>
                <h1 className="text-xl font-bold text-slate-800 mb-2">Connection Error</h1>
                <p className="text-sm text-gray-600 mb-4">
                    The application could not connect to the database. This can be due to a network issue or a Cross-Origin Resource Sharing (CORS) policy on the server.
                </p>
                <div className="text-sm text-gray-600 mb-4 text-left space-y-2">
                    <p><strong>How to fix:</strong></p>
                    <ol className="list-decimal list-inside text-xs bg-gray-100 p-3 rounded-md">
                        <li>Go to your <strong>Supabase Dashboard</strong>.</li>
                        <li>Navigate to <strong>Project Settings</strong> (gear icon).</li>
                        <li>Click on <strong>API</strong> in the sidebar.</li>
                        <li>Find the <strong>CORS Origins</strong> section.</li>
                        <li>Add your application's URL to the list. For development, you can add <code>*</code> to allow all domains.</li>
                    </ol>
                </div>

                <button 
                    onClick={handleReload}
                    className="w-full py-2 mt-2 bg-yellow-500 text-white font-semibold rounded-md hover:bg-yellow-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                    Reload Page
                </button>
            </div>
        </div>
    );
};

export default NetworkError;