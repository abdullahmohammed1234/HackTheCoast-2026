'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { MessageCircle, Send, ArrowLeft, User } from 'lucide-react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import EmptyState from '@/components/EmptyState';
import Skeleton from '@/components/Skeleton';

interface Message {
  _id: string;
  senderId: { _id: string; name: string; email: string };
  receiverId: { _id: string; name: string; email: string };
  listingId: { _id: string; title: string };
  content: string;
  createdAt: Date;
}

export default function MessagesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session]);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedConversation,
          listingId: messages.find(m => m.senderId._id === selectedConversation || m.receiverId._id === selectedConversation)?.listingId._id || '',
          content: newMessage,
        }),
      });

      if (res.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  // Get unique conversations
  const conversations = messages.reduce((acc, msg) => {
    const otherUser = msg.senderId._id === session?.user?.id ? msg.receiverId : msg.senderId;
    if (!acc.find(c => c.userId === otherUser._id)) {
      acc.push({
        userId: otherUser._id,
        name: otherUser.name,
        lastMessage: msg.content,
        listingTitle: msg.listingId?.title || 'Unknown item',
        createdAt: msg.createdAt,
      });
    }
    return acc;
  }, [] as { userId: string; name: string; lastMessage: string; listingTitle: string; createdAt: Date }[]);

  if (!session) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="ubc-gradient p-4 rounded-2xl shadow-lg inline-block mb-4">
              <MessageCircle className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to view messages</h2>
            <button
              onClick={() => router.push('/login')}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-red-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-ubc-blue to-ubc-blue opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM2djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>

          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center mb-4">
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl shadow-lg">
                  <div className="relative w-10 h-10">
                    <Image
                      src="/logo.webp"
                      alt="Exchangify Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Messages
            </h1>
            <p className="text-lg text-white/90">
              Connect with fellow UBC students
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Messages Section */}
      <section className="py-8 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid md:grid-cols-3 min-h-[500px]">
              {/* Conversations List */}
              <div className="border-r border-gray-200 bg-gray-50">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3">
                        <Skeleton variant="circular" width="40px" height="40px" />
                        <div className="flex-1">
                          <Skeleton variant="text" width="60%" height="16px" />
                          <Skeleton variant="text" width="80%" height="14px" className="mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      type="messages"
                      actionLabel="Browse Listings"
                      actionHref="/home"
                    />
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => setSelectedConversation(conv.userId)}
                      className={`w-full p-4 text-left border-b border-gray-100 hover:bg-white transition-colors ${
                        selectedConversation === conv.userId ? 'bg-white border-l-4 border-l-primary' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-ubc-blue/10 rounded-full">
                          <User className="h-5 w-5 text-ubc-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900">{conv.name}</div>
                          <div className="text-sm text-gray-500 truncate">{conv.lastMessage}</div>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>

              {/* Chat Area */}
              <div className="md:col-span-2 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                      {messages
                        .filter(
                          (m) =>
                            (m.senderId._id === session?.user?.id && m.receiverId._id === selectedConversation) ||
                            (m.senderId._id === selectedConversation && m.receiverId._id === session?.user?.id)
                        )
                        .map((msg) => (
                          <div
                            key={msg._id}
                            className={`mb-4 ${
                              msg.senderId._id === session?.user?.id ? 'text-right' : 'text-left'
                            }`}
                          >
                            <div
                              className={`inline-block max-w-[80%] px-4 py-3 rounded-2xl ${
                                msg.senderId._id === session?.user?.id
                                  ? 'bg-primary text-white rounded-br-md'
                                  : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
                              }`}
                            >
                              <p>{msg.content}</p>
                              <p className={`text-xs mt-1 ${
                                msg.senderId._id === session?.user?.id ? 'text-red-200' : 'text-gray-400'
                              }`}>
                                {format(new Date(msg.createdAt), 'MMM d, h:mm a')}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          onClick={sendMessage}
                          disabled={sending || !newMessage.trim()}
                          className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="h-5 w-5" />
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                    <div className="text-center">
                      <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">Select a conversation</p>
                      <p className="text-sm mt-2">Choose a conversation from the list to start messaging</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
