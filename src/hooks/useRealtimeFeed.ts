
import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

interface RealtimeFeedOptions {
  channelName: string;
  tableName?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  onNewItems?: (items: unknown[]) => void;
  maxBackoff?: number;
  batchWindow?: number;
}

export function useRealtimeFeed({
  channelName,
  tableName,
  event = '*',
  onNewItems,
  maxBackoff = 30000,
  batchWindow = 500,
}: RealtimeFeedOptions) {
  const [connected, setConnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  const [lastReconnectAttempt, setLastReconnectAttempt] = useState(0);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const backoffTimerRef = useRef<number | null>(null);
  const channelRef = useRef<unknown>(null);
  const queueRef = useRef<unknown[]>([]);
  const batchTimerRef = useRef<number | null>(null);

  const calculateBackoff = (attempts: number): number => {
    const base = 1000; // 1 second
    const max = maxBackoff;
    const backoff = Math.min(base * Math.pow(2, attempts), max);
    // Add jitter to prevent thundering herd
    return backoff + Math.random() * 1000;
  };

  // Process the queue and call onNewItems with batched items
  const flushQueue = useCallback(() => {
    if (queueRef.current.length > 0 && onNewItems) {
      const items = [...queueRef.current];
      queueRef.current = [];
      onNewItems(items);
    }
    batchTimerRef.current = null;
  }, [onNewItems]);

  // Add item to queue and set up debounced flush
  const enqueueItem = useCallback((item: unknown) => {
    queueRef.current.push(item);
    
    if (!batchTimerRef.current) {
      batchTimerRef.current = window.setTimeout(flushQueue, batchWindow);
    }
  }, [flushQueue, batchWindow]);

  const handleConnect = useCallback(() => {
    setReconnecting(true);
    setLastReconnectAttempt(Date.now());

    // Clear any existing backoff timer
    if (backoffTimerRef.current) {
      clearTimeout(backoffTimerRef.current);
      backoffTimerRef.current = null;
    }

    console.log(`[Realtime] Connecting to ${channelName}, attempt ${reconnectAttempts + 1}`);

    // Create Supabase realtime channel
    const channel = supabase.channel(channelName);

    // Subscribe to channel events
    channel
      .on(
        'postgres_changes',
        {
          event: event,
          schema: 'public',
          table: tableName,
        },
        (payload) => {
          enqueueItem(payload.new);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnected(true);
          setReconnecting(false);
          setReconnectAttempts(0);
          console.log(`[Realtime] Connected to ${channelName}`);
        } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
          handleDisconnect();
        }
      });

    channelRef.current = channel;
  }, [channelName, tableName, event, enqueueItem, reconnectAttempts, maxBackoff]);

  const handleDisconnect = useCallback(() => {
    setConnected(false);
    console.log(`[Realtime] Disconnected from ${channelName}`);

    // Cleanup channel
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Start exponential backoff
    const delay = calculateBackoff(reconnectAttempts);
    console.log(`[Realtime] Reconnecting in ${Math.round(delay / 1000)} seconds...`);

    backoffTimerRef.current = window.setTimeout(() => {
      setReconnectAttempts((prev) => prev + 1);
      handleConnect();
    }, delay);
  }, [channelName, reconnectAttempts, calculateBackoff, handleConnect]);

  const cleanup = useCallback(() => {
    if (backoffTimerRef.current) {
      clearTimeout(backoffTimerRef.current);
      backoffTimerRef.current = null;
    }
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = null;
    }
    if (channelRef.current) {
      channelRef.current.unsubscribe();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    // Flush any remaining items in queue before unmounting
    if (queueRef.current.length > 0 && onNewItems) {
      onNewItems([...queueRef.current]);
      queueRef.current = [];
    }
  }, [onNewItems]);

  // Initial connection
  useEffect(() => {
    handleConnect();
    return cleanup;
  }, [handleConnect, cleanup]);

  return {
    connected,
    reconnecting,
    lastReconnectAttempt,
    reconnectAttempts,
    reconnect: handleConnect,
    disconnect: handleDisconnect,
  };
}
