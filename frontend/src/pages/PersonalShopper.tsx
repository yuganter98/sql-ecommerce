import { useState, useRef, useEffect } from 'react';
import { Send, ShoppingBag, Sparkles } from 'lucide-react';
import client from '../api/client';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const PersonalShopper = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! I'm your Personal Shopper. I can help you find exactly what you're looking for. What are you shopping for today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Send conversation history (last 10 messages to keep context but avoid huge payloads)
            const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }));
            history.push({ role: 'user', content: userMessage });

            const res = await client.post('/chat/personal-shopper', { messages: history });

            setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);

            if (res.data.products && res.data.products.length > 0) {
                const mappedProducts = res.data.products.map((p: any) => ({
                    ...p,
                    id: p.product_id,
                    title: p.name,
                    price: Number(p.price),
                    image: p.image_url || 'https://via.placeholder.com/300',
                    category: p.categories?.name || 'Uncategorized'
                }));
                setRecommendedProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm having a little trouble connecting right now. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-80px)]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">

                {/* Chat Interface */}
                <div className="lg:col-span-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
                    <div className="p-4 bg-primary/5 border-b border-gray-100 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="font-bold text-gray-900">Personal Shopper</h2>
                            <p className="text-xs text-gray-500">AI-Powered Assistance</p>
                        </div>
                    </div>

                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
                    >
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${msg.role === 'user'
                                    ? 'bg-primary text-white rounded-tr-none'
                                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 rounded-full border-gray-200 focus:border-primary focus:ring-primary px-4 py-2 text-sm"
                            />
                            <Button type="submit" size="sm" disabled={isLoading || !input.trim()} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Product Display Area */}
                <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                    {recommendedProducts.length > 0 ? (
                        <div className="h-full overflow-y-auto pr-2">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                    Recommended for You
                                </h3>
                                <span className="text-sm text-gray-500">{recommendedProducts.length} items found</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {recommendedProducts.map(product => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 border-2 border-dashed border-gray-200 rounded-2xl">
                            <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No recommendations yet</p>
                            <p className="text-sm text-center max-w-md mt-2">
                                Chat with the Personal Shopper to get curated product suggestions based on your needs.
                            </p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PersonalShopper;
