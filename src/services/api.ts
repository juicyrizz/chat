import { supabase } from '../lib/supabase';

// User Profile Services
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async searchUsers(query: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(20);
    
    if (error) throw error;
    return data;
  }
};

// Posts Services
export const postsService = {
  async getPosts(limit = 20, offset = 0) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:profiles(username, full_name, avatar_url),
        likes:likes(count),
        comments:comments(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  async createPost(userId: string, content: string, imageUrl?: string) {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content,
        image_url: imageUrl
      })
      .select(`
        *,
        user:profiles(username, full_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async likePost(userId: string, postId: string) {
    const { data, error } = await supabase
      .from('likes')
      .insert({ user_id: userId, post_id: postId })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async unlikePost(userId: string, postId: string) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
    
    if (error) throw error;
  },

  async getPostLikes(postId: string) {
    const { data, error } = await supabase
      .from('likes')
      .select('*, user:profiles(username, full_name)')
      .eq('post_id', postId);
    
    if (error) throw error;
    return data;
  }
};

// Comments Services
export const commentsService = {
  async getComments(postId: string) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:profiles(username, full_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async createComment(userId: string, postId: string, content: string) {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        post_id: postId,
        content
      })
      .select(`
        *,
        user:profiles(username, full_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Friends Services
export const friendsService = {
  async getFriends(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        friend:profiles!friendships_friend_id_fkey(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted');
    
    if (error) throw error;
    return data;
  },

  async getFriendRequests(userId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .select(`
        *,
        user:profiles!friendships_user_id_fkey(*)
      `)
      .eq('friend_id', userId)
      .eq('status', 'pending');
    
    if (error) throw error;
    return data;
  },

  async sendFriendRequest(userId: string, friendId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async acceptFriendRequest(requestId: string) {
    const { data, error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async rejectFriendRequest(requestId: string) {
    const { error } = await supabase
      .from('friendships')
      .delete()
      .eq('id', requestId);
    
    if (error) throw error;
  }
};

// Messages Services
export const messagesService = {
  async getConversations(userId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        receiver:profiles!messages_receiver_id_fkey(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Group by conversation partner
    const conversations = new Map();
    data?.forEach(message => {
      const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      const partner = message.sender_id === userId ? message.receiver : message.sender;
      
      if (!conversations.has(partnerId)) {
        conversations.set(partnerId, {
          partner,
          lastMessage: message,
          unreadCount: 0
        });
      }
      
      if (message.receiver_id === userId && !message.read) {
        conversations.get(partnerId).unreadCount++;
      }
    });
    
    return Array.from(conversations.values());
  },

  async sendMessage(senderId: string, receiverId: string, content: string) {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(*),
        receiver:profiles!messages_receiver_id_fkey(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async markAsRead(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
    
    if (error) throw error;
  }
};

// Stories Services
export const storiesService = {
  async getStories() {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        user:profiles(username, full_name, avatar_url)
      `)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createStory(userId: string, content: string, imageUrl?: string) {
    const { data, error } = await supabase
      .from('stories')
      .insert({
        user_id: userId,
        content,
        image_url: imageUrl
      })
      .select(`
        *,
        user:profiles(username, full_name, avatar_url)
      `)
      .single();
    
    if (error) throw error;
    return data;
  }
};