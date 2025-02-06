import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  ChevronRight,
  Salad,
  ChefHat,
  Scale,
  ShoppingBag,
  PiggyBank,
  TrendingUp,
  Sparkles,
  MessageSquarePlus,
  AlertCircle
} from 'lucide-react';
import { useCartStore } from '../../lib/store';
import { geminiChat } from '../../lib/gemini';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface Prompt {
  text: string;
  icon: JSX.Element;
  color: string;
}

const PREDEFINED_PROMPTS: Prompt[] = [
  {
    text: "Help me find healthy alternatives",
    icon: <Salad className="w-4 h-4" />,
    color: "text-green-600 bg-green-50 border-green-200 hover:bg-green-100"
  },
  {
    text: "Suggest recipes with these items",
    icon: <ChefHat className="w-4 h-4" />,
    color: "text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-100"
  },
  {
    text: "Calculate calories for this cart",
    icon: <Scale className="w-4 h-4" />,
    color: "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
  },
  {
    text: "Recommend complementary items",
    icon: <ShoppingBag className="w-4 h-4" />,
    color: "text-purple-600 bg-purple-50 border-purple-200 hover:bg-purple-100"
  },
  {
    text: "Is this within my budget?",
    icon: <PiggyBank className="w-4 h-4" />,
    color: "text-pink-600 bg-pink-50 border-pink-200 hover:bg-pink-100"
  },
  {
    text: "Compare prices with market average",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
  }
];

export function AIChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { items } = useCartStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    try {
      setError(null);
      const newMessage: Message = { role: 'user', content: text };
      setMessages(prev => [...prev, newMessage]);
      setInput('');
      setLoading(true);
      setShowPrompts(false);

      // Create a temporary message for streaming
      const tempMessage: Message = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, tempMessage]);

      // Get streaming response from Gemini
      await geminiChat(
        [...messages, newMessage],
        {
          cartItems: items,
          userPreferences: [], // Add user preferences from your auth context or store
        },
        (chunk) => {
          setMessages(prev => [
            ...prev.slice(0, -1),
            { ...tempMessage, content: chunk }
          ]);
        }
      );

    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to get response. Please try again.');
      // Remove the temporary message if there's an error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setShowPrompts(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Bot className="w-6 h-6 text-emerald-600" />
          <h2 className="font-medium">Shopping Assistant</h2>
        </div>
        {messages.length > 0 && (
          <button
            onClick={startNewChat}
            className="p-2 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-gray-100"
          >
            <MessageSquarePlus className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-gray-100'
                  : 'bg-emerald-600 text-white'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="w-5 h-5 mt-1 flex-shrink-0" />
                )}
                <div className="prose prose-sm max-w-none">
                  {message.role === 'assistant' ? (
                    <ReactMarkdown>{message.content || ''}</ReactMarkdown>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                {message.role === 'user' && (
                  <User className="w-5 h-5 mt-1 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Predefined Prompts */}
      {showPrompts && (
        <div className="p-4 border-t bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {PREDEFINED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSend(prompt.text)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${prompt.color}`}
              >
                {prompt.icon}
                <span className="text-sm">{prompt.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-gray-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your cart..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
} 