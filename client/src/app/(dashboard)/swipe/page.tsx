'use client';

import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'motion/react';
import { X, Heart, MapPin, Star } from 'lucide-react';
import { useConnections } from '@/store/appStore';


export default function SwipeInterface() {

  const { 
    feedUsers, 
    feedPagination,
    sendConnectionRequest, 
    fetchFeedUsers,
    isLoadingConnections 
  } = useConnections();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  // Swipe indicators
  const leftOpacity = useTransform(x, [-200, -100, 0], [1, 1, 0]);
  const rightOpacity = useTransform(x, [0, 100, 200], [0, 1, 1]);

  const currentProfile = feedUsers[currentIndex];

  // Fetch feed users on mount
  useEffect(() => {
    fetchFeedUsers({ page: 1, limit: 10 });
  }, []);

  // Load more users when getting close to end
  useEffect(() => {
    const remainingProfiles = feedUsers.length - currentIndex;
    
    if (remainingProfiles <= 2 && feedPagination?.hasNextPage) {
      fetchFeedUsers({ 
        page: feedPagination.currentPage + 1, 
        limit: 10 
      });
    }
  }, [currentIndex, feedUsers.length, feedPagination]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100;
    
    if (Math.abs(info.offset.x) > threshold) {
      if (info.offset.x > 0) {
        // Swiped right - interested
        handleLike();
      } else {
        // Swiped left - ignore
        handleReject();
      }
    } else {
      // Reset position
      x.set(0);
    }
  };

  const handleLike = async () => {
    if (!currentProfile) return;
    
    try {
      await sendConnectionRequest(currentProfile._id, 'interested');
      
      // Animate card away
      x.set(1000);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        x.set(0);
      }, 300);
    } catch (error) {
      console.error('Failed to send connection request:', error);
      x.set(0);
    }
  };

  const handleReject = async () => {
    if (!currentProfile) return;
    
    try {
      await sendConnectionRequest(currentProfile._id, 'ignored');
      
      // Animate card away
      x.set(-1000);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        x.set(0);
      }, 300);
    } catch (error) {
      console.error('Failed to ignore profile:', error);
      x.set(0);
    }
  };

  if (isLoadingConnections && feedUsers.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400">Loading profiles...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No More Profiles</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {feedPagination?.totalUsers === 0 
              ? "No users available yet. Check back later!"
              : "You've seen all available profiles. Check back later for new matches!"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Stats */}
        {feedPagination && (
          <div className="mb-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            {currentIndex + 1} / {feedPagination.totalUsers} profiles
          </div>
        )}

        {/* Card Stack */}
        <div className="relative ml-14 h-[450px] w-[350px] mb-4">
          {/* Next card preview */}
          {feedUsers[currentIndex + 1] && (
            <div className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 scale-95 opacity-50" />
          )}
          
          {/* Current card */}
          <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden cursor-grab active:cursor-grabbing shadow-xl"
          >
            {/* Profile Image */}
            <div className="relative h-52 bg-linear-to-br from-violet-500 to-pink-500">
              <img
                src={currentProfile.photoUrl}
                alt={currentProfile.firstName}
                className="w-full h-full object-cover"
              />
              {currentProfile.isPremium && (
                <div className="absolute top-4 right-4 px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  Premium
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-3xl font-bold mb-1">
                  {currentProfile.firstName} {currentProfile.lastName}
                  {currentProfile.age && <span className="text-zinc-500">, {currentProfile.age}</span>}
                </h2>
                
                {currentProfile.city && (
                  <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                    <MapPin className="w-4 h-4" />
                    <span>{currentProfile.city}</span>
                  </div>
                )}
              </div>

              {/* About */}
              {currentProfile.about && (
                <p className="text-zinc-700 dark:text-zinc-300 mb-4 line-clamp-3">
                  {currentProfile.about}
                </p>
              )}

              {/* Skills */}
              {currentProfile.skills && currentProfile.skills.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                    Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentProfile.skills.slice(0, 6).map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {currentProfile.skills.length > 6 && (
                      <span className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-full text-sm font-medium">
                        +{currentProfile.skills.length - 6}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleReject}
            className="w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border-2 border-red-500 flex items-center justify-center shadow-lg hover:shadow-red-500/50 transition-shadow"
          >
            <X className="w-8 h-8 text-red-500" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleLike}
            className="w-10 h-10 rounded-full bg-violet-600 flex items-center justify-center shadow-lg hover:shadow-violet-500/50 transition-shadow"
          >
            <Heart className="w-8 h-8 text-white fill-current" />
          </motion.button>
        </div>

        {/* Swipe Indicators */}
        <motion.div
          style={{ opacity: leftOpacity }}
          className="absolute top-24 left-8 text-6xl font-bold text-red-500 rotate-[-25deg] pointer-events-none"
        >
          Ignore
        </motion.div>
        <motion.div
          style={{ opacity: rightOpacity }}
          className="absolute top-24 right-8 text-6xl font-bold text-green-500 rotate-25 pointer-events-none"
        >
          Interested
        </motion.div>
      </div>
    </div>
  );
}