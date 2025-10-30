import { useState, useEffect } from 'react';
import bidService from '@/services/bidService';
import type { AdminBidListItem } from '@/types/admin-bid';

export const useAdminBids = () => {
    const [bids, setBids] = useState<AdminBidListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBids = async () => {
            try {
                setLoading(true);
                const data = await bidService.getAdminBidStatistics();
                setBids(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load bids');
            } finally {
                setLoading(false);
            }
        };

        fetchBids();
    }, []);

    return { bids, loading, error };
};
