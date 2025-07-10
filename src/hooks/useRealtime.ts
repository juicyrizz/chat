import { useEffect, useState } from 'react';
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