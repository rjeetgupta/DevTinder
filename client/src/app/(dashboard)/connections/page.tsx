'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, X, Check, MessageCircle, UserPlus, Users, Send } from 'lucide-react';
import { useConnections } from '@/store/appStore';

type TabType = 'received' | 'sent' | 'matches';

export default function ConnectionsPage() {
  const {
    receivedRequests,
    sentRequests,
    matches,
    reviewConnectionRequest,
    fetchReceivedRequests,
    fetchSentRequests,
    fetchMatches,
    isLoadingConnections,
  } = useConnections();

  const [activeTab, setActiveTab] = useState<TabType>('received');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      if (activeTab === 'received') {
        await fetchReceivedRequests();
      } else if (activeTab === 'sent') {
        await fetchSentRequests();
      } else {
        await fetchMatches();
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await reviewConnectionRequest(requestId, 'accepted');
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await reviewConnectionRequest(requestId, 'rejected');
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const tabs = [
    { id: 'received' as TabType, label: 'Received', icon: UserPlus, count: receivedRequests.length },
    { id: 'sent' as TabType, label: 'Sent', icon: Send, count: sentRequests.length },
    { id: 'matches' as TabType, label: 'Matches', icon: Users, count: matches.length },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Connections</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {isLoadingConnections ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'received' && (
              <>
                {receivedRequests.length === 0 ? (
                  <EmptyState
                    icon={UserPlus}
                    title="No received requests"
                    description="When someone is interested in connecting, you'll see them here"
                  />
                ) : (
                  receivedRequests.map((request) => (
                    <ReceivedRequestCard
                      key={request._id}
                      request={request}
                      onAccept={handleAccept}
                      onReject={handleReject}
                    />
                  ))
                )}
              </>
            )}

            {activeTab === 'sent' && (
              <>
                {sentRequests.length === 0 ? (
                  <EmptyState
                    icon={Send}
                    title="No sent requests"
                    description="Start swiping to send connection requests"
                  />
                ) : (
                  sentRequests.map((request) => (
                    <SentRequestCard key={request._id} request={request} />
                  ))
                )}
              </>
            )}

            {activeTab === 'matches' && (
              <>
                {matches.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No matches yet"
                    description="Accept connection requests to start matching"
                  />
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {matches.map((match) => (
                      <MatchCard key={match._id} match={match} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ReceivedRequestCard({ request, onAccept, onReject }: any) {
  const sender = request.fromUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-violet-500 transition-all w-md"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-violet-500 to-pink-500 shrink-0">
          <img src={sender.photoUrl} alt={sender.firstName} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1">
            {sender.firstName} {sender.lastName}
            {sender.age && <span className="text-zinc-500">, {sender.age}</span>}
          </h3>
          
          {sender.about && sender.about !== 'Write about yourself' && (
            <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-3 line-clamp-2">
              {sender.about}
            </p>
          )}

          {sender.skills && sender.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {sender.skills.slice(0, 3).map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onReject(request._id)}
              className="flex-1 px-4 py-2 border-2 border-red-500 text-red-500 rounded-xl font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => onAccept(request._id)}
              className="flex-1 px-4 py-2 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Accept
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SentRequestCard({ request }: any) {
  const receiver = request.toUserId;
  const statusColors = {
    interested: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    accepted: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    ignored: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-violet-500 to-pink-500 shrink-0">
          <img src={receiver.photoUrl} alt={receiver.firstName} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1">
            {receiver.firstName} {receiver.lastName}
          </h3>
          
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.status as keyof typeof statusColors]}`}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function MatchCard({ match }: any) {
  const otherUser = match.fromUserId._id === match.toUserId._id ? match.toUserId : match.fromUserId;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 hover:border-violet-500 transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-violet-500 to-pink-500">
          <img src={otherUser.photoUrl} alt={otherUser.firstName} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1">
            {otherUser.firstName} {otherUser.lastName}
          </h3>
        </div>
      </div>

      {otherUser.skills && otherUser.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {otherUser.skills.slice(0, 3).map((skill: string, index: number) => (
            <span
              key={index}
              className="px-2 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <button className="w-full px-4 py-3 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
        <MessageCircle className="w-4 h-4" />
        Message
      </button>
    </motion.div>
  );
}

function EmptyState({ icon: Icon, title, description }: any) {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}