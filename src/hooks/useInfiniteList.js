import { useEffect, useState, useRef, useCallback } from 'react';

export default function useInfiniteList(fetchFn, limit = 10) {
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const offsetRef = useRef(0);
    const loadingRef = useRef(false);

    const loadMore = useCallback(async () => {
        if (loadingRef.current || !hasMore) return;
        loadingRef.current = true;
        setLoading(true);
        try {
            const newItems = await fetchFn(offsetRef.current, limit);
            setItems(prev => [...prev, ...newItems]);
            if (newItems.length < limit) setHasMore(false);
            offsetRef.current += limit;
        } catch (e) {
            console.error('InfiniteList load error', e);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [fetchFn, hasMore, limit]);

    const reset = useCallback(() => {
        setItems([]);
        setHasMore(true);
        offsetRef.current = 0;
        loadingRef.current = false;
        setTimeout(() => {
            loadMore();
        }, 0);
    }, [loadMore]);

    const observer = useRef();
    const lastRef = useCallback((node) => {
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        });
        if (node) observer.current.observe(node);
    }, [loadMore]);

    useEffect(() => {
        if (items.length === 0) loadMore();
    }, [items.length, loadMore]);

    return { items, hasMore, loading, lastRef, reset };
}
