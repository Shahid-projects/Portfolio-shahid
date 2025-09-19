import React, { useState, useRef, useEffect } from 'react';

// --- SVG Icon Components ---
// Using slightly more modern/cleaner icons and adding a custom one for the AI.

const ShahidAIIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3.75H6.375c-1.036 0-1.875.84-1.875 1.875v1.5c0 1.036.84 1.875 1.875 1.875h1.5v-3.375c0-.966.784-1.75 1.75-1.75h.5c.966 0 1.75.784 1.75 1.75v1.5c0 1.036-.84 1.875-1.875 1.875h-1.5v1.125c0 .621.504 1.125 1.125 1.125h1.5c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3.75v9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 3.75H17.625c1.036 0 1.875.84 1.875 1.875v1.5c0 1.036-.84 1.875-1.875 1.875h-1.5v-3.375c0-.966-.784-1.75-1.75-1.75h-.5c-.966 0-1.75.784-1.75 1.75v1.5c0 1.036.84 1.875 1.875 1.875h1.5v1.125c0 .621-.504 1.125-1.125 1.125h-1.5c-.621 0-1.125-.504-1.125-1.125V9.75" />
    </svg>
);

const UserIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const SendIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
    </svg>
);

const MenuIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

const CopyIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
    </svg>
);

const LogoutIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);


// --- Main Components ---

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        // Use document.execCommand for broader compatibility in sandboxed environments
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
        document.body.removeChild(textArea);
    };

    return (
        <div className="bg-gray-900/70 backdrop-blur-sm rounded-lg my-4 relative shadow-lg border border-gray-700/50">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 rounded-t-lg border-b border-gray-700/50">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Code Block</span>
                <button onClick={handleCopy} className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-md px-2 py-1">
                    <CopyIcon className="w-4 h-4" />
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto">
                <code className="text-sm text-gray-200 font-mono">{code.trim()}</code>
            </pre>
        </div>
    );
};

const LoadingIndicator = () => (
    <div className="flex items-center space-x-1">
      <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
      <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
      <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
    </div>
);


const Message = ({ role, content, isLoading }) => {
    const isAssistant = role === 'assistant';

    const renderContent = (text) => {
        const codeBlockRegex = /```([\s\S]*?)```/g;
        const parts = text.split(codeBlockRegex);

        return parts.map((part, index) => {
            if (index % 2 === 1) { // This is a code block
                return <CodeBlock key={index} code={part} />;
            }
            // Render plain text, respecting newlines as paragraphs
            return part.split('\n').map((line, i) => (
                <p key={`${index}-${i}`}>{line || '\u00A0'}</p> // Use non-breaking space for empty lines
            ));
        });
    };

    return (
        <div className="flex items-start gap-4 my-8 animate-fade-in-up">
            <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-lg ${isAssistant ? 'bg-gradient-to-br from-teal-400 to-blue-500' : 'bg-gray-600'}`}>
                {isAssistant ? <ShahidAIIcon className="w-5 h-5 md:w-6 md:h-6 text-white" /> : <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />}
            </div>
            <div className="flex-grow pt-1 min-w-0">
                <p className="font-bold text-gray-200">{isAssistant ? 'Shahid-AI' : 'You'}</p>
                <div className="text-gray-300 text-base md:text-[1.05rem] leading-relaxed mt-1 prose prose-invert max-w-none prose-p:my-1">
                    {isLoading ? <LoadingIndicator /> : renderContent(content)}
                </div>
            </div>
        </div>
    );
};

const ChatView = ({ messages, isLoading, onSendMessage }) => {
    const [inputQuery, setInputQuery] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${scrollHeight}px`;
        }
    }, [inputQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputQuery.trim() && !isLoading) {
            onSendMessage(inputQuery);
            setInputQuery('');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-800/30">
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-12">
                    {messages.length === 1 && messages[0].role === 'assistant' && (
                        <div className="text-center py-16 animate-fade-in-up">
                            <div className="inline-block p-4 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full shadow-2xl shadow-teal-500/20">
                                <ShahidAIIcon className="w-16 h-16 text-white" />
                            </div>
                            <h1 className="mt-6 text-4xl font-extrabold text-gray-100 tracking-tight">Shahid-AI</h1>
                            <h2 className="mt-2 text-xl font-medium text-gray-400">How can I help you today?</h2>
                        </div>
                    )}
                    {messages.map((msg, index) => (
                        <Message key={index} role={msg.role} content={msg.content} />
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === 'user' && <Message role="assistant" content="" isLoading={true} />}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700/50 w-full">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-4">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            value={inputQuery}
                            onChange={(e) => setInputQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    handleSubmit(e);
                                }
                            }}
                            placeholder="Ask Shahid-AI anything..."
                            rows={1}
                            className="w-full bg-gray-700/80 text-gray-200 text-lg rounded-xl py-3 pl-6 pr-20 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all duration-300 max-h-48 custom-scrollbar shadow-inner"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className={`absolute right-3 bottom-2 p-2 rounded-full transition-all duration-300 transform active:scale-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-teal-400 ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-br from-teal-400 to-blue-500 hover:opacity-90'}`}
                            disabled={isLoading}
                        >
                            <SendIcon className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Sidebar = ({ isSidebarOpen, setSidebarOpen, onNewChat }) => (
    <>
        <div className={`fixed inset-0 bg-black/60 z-10 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)}></div>
        <div className={`absolute top-0 left-0 h-full bg-gray-900 text-white w-72 p-4 transform transition-transform duration-300 ease-in-out z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 flex flex-col border-r border-gray-700/50`}>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-300 to-blue-400 text-transparent bg-clip-text">Shahid-AI</h1>
                <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
            </div>
            <button onClick={onNewChat} className="w-full text-left bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-teal-400">
                <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                New Chat
            </button>
            <div className="flex-grow mt-6 overflow-y-auto custom-scrollbar">
                {/* Future chat history items would go here */}
            </div>
             <div className="flex-shrink-0 pt-4 border-t border-gray-700/50">
                <p className="text-xs text-gray-500 text-center">Built with React & Tailwind CSS</p>
            </div>
        </div>
    </>
);

function App() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        handleNewChat();
    }, []);

    const handleNewChat = () => {
        setMessages([{
            role: 'assistant',
            content: "", // Empty content triggers the welcome screen
        }]);
        setSidebarOpen(false);
    }
    
    const handleLogout = () => {
        window.location.href = 'http://localhost:5173/login';
    };

    const handleSendMessage = async (query) => {
        const currentHistory = messages.length === 1 && messages[0].content === ""
            ? []
            : messages;

        const newUserMessage = { role: 'user', content: query };
        setMessages([...currentHistory, newUserMessage]);
        setIsLoading(true);
        setError(null);

        // Add a placeholder for the assistant's response
        setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

        try {
            const response = await fetch(`http://localhost:7000/api/v1/chat-stream?q=${encodeURIComponent(query)}`);

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Failed to fetch response');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantResponse = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop();

                for (const line of lines) {
                    if (line.startsWith('data:')) {
                        const data = line.substring(5).trim();
                        if (data) {
                            assistantResponse += data + ' '; // Append data with a space
                        }
                    }
                }

                setMessages(prev => {
                    const updatedMessages = [...prev];
                    updatedMessages[updatedMessages.length - 1].content = assistantResponse.trim();
                    return updatedMessages;
                });
            }
        } catch (err) {
            console.error("API Error:", err);
            setError(err.message);
            const errorMessage = `Sorry, an error occurred: ${err.message}. Please check the console or try again later.`;
            setMessages(prev => {
                const updatedMessages = [...prev];
                updatedMessages[updatedMessages.length - 1].content = errorMessage;
                return updatedMessages;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <style>{`
                /* Simple custom scrollbar for a cleaner look */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #4A5568;
                    border-radius: 20px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #718096;
                }
                /* Animation for messages */
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
            <div className="h-screen w-screen bg-gray-900 text-white font-sans flex overflow-hidden">
                <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} onNewChat={handleNewChat} />
                <main className="flex-1 flex flex-col h-full min-w-0 relative">
                    {/* Logout button for Desktop */}
                    <div className="absolute top-0 right-0 p-4 z-20 hidden md:block">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm bg-gray-800/60 backdrop-blur-sm text-gray-300 hover:text-red-400 hover:bg-gray-700/80 transition-all duration-200 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500"
                        >
                            <LogoutIcon className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>

                    {/* Header for Mobile */}
                    <header className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 md:hidden z-10">
                        <div className="flex items-center justify-between p-4">
                            <button onClick={() => setSidebarOpen(true)}>
                                <MenuIcon className="w-6 h-6 text-white" />
                            </button>
                            <h2 className="font-semibold text-lg">New Chat</h2>
                            <button onClick={handleLogout} className="text-gray-300 hover:text-red-400 transition-colors duration-200">
                                <LogoutIcon className="w-6 h-6" />
                            </button>
                        </div>
                    </header>
                    <ChatView
                        messages={messages}
                        isLoading={isLoading}
                        onSendMessage={handleSendMessage}
                    />
                </main>
            </div>
        </>
    );
}

export default App;

