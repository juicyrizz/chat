import { useEffect, useState, useCallback } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useRealtime = (table: string, callback: (payload: any) => void) => {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table },
        callback
      )
      .subscribe();

    setChannel(subscription);

    return () => {
      subscription.unsubscribe();
    };
  }, [table, callback]);

  return channel;
};

export const useRealtimeMessages = (userId: string, friendId: string) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!userId || !friendId) return;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(username, full_name, avatar_url),
        receiver:profiles!messages_receiver_id_fkey(username, full_name, avatar_url)
      `)
      .or(`and(sender_id.eq.${userId},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${userId})`)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  }, [userId, friendId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useRealtime('messages', (payload) => {
    if (payload.eventType === 'INSERT') {
      const newMessage = payload.new;
      if (
        (newMessage.sender_id === userId && newMessage.receiver_id === friendId) ||
        (newMessage.sender_id === friendId && newMessage.receiver_id === userId)
      ) {
        setMessages(prev => [...prev, newMessage]);
      }
    }
  });

  return { messages, loading, refetch: fetchMessages };
};

export const useRealtimeSearch = (query: string) => {
  const [results, setResults] = useState<any>({ users: [], posts: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults({ users: [], posts: [] });
        return;
      }

      setLoading(true);
      
      // Search users
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(10);

      // Search posts
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          *,
          user:profiles(username, full_name, avatar_url)
        `)
        .ilike('content', `%${query}%`)
        .limit(10);

      setResults({
        users: users || [],
        posts: posts || []
      });
      setLoading(false);
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { results, loading };
};