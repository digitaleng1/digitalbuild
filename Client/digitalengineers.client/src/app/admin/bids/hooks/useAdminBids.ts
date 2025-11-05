import { useState, useEffect, useCallback } from 'react';
import bidService from '@/services/bidService';
import type { AdminBidListItem } from '@/types/admin-bid';

export const useAdminBids = () => {
    const [bids, setBids] = useState<AdminBidListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBids = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await bidService.getAdminBidStatistics();
            setBids(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load bids');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBids();
    }, [fetchBids]);

    return { bids, loading, error, refetch: fetchBids };
};
