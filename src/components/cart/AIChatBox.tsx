import { useState } from 'react';
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
  Sparkles
} from 'lucide-react';

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
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I\'m your AI shopping assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'm processing your request: "${message}". This is a placeholder response. Integrate with your AI service for real responses.`
      }]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-lg">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Shopping Assistant</h2>
            <p className="text-emerald-100 text-sm">Powered by AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start space-x-2 ${
              message.role === 'assistant' ? '' : 'flex-row-reverse space-x-reverse'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'assistant' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                : 'bg-gray-100'
            }`}>
              {message.role === 'assistant' ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <User className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div className={`max-w-[80%] rounded-xl p-3 shadow-sm ${
              message.role === 'assistant' 
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100' 
                : 'bg-gray-100'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-100">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Predefined Prompts */}
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