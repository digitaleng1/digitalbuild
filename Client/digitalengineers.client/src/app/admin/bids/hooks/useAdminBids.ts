import { useState, useEffect, useCallback, useMemo } from 'react';
import bidService from '@/services/bidService';
import { BidRequestStatus } from '@/types/bid';
import type { AdminBidListItem, BidStatusFilter, ProjectStatusFilter } from '@/types/admin-bid';

export const useAdminBids = () => {
    const [bids, setBids] = useState<AdminBidListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bidStatusFilter, setBidStatusFilter] = useState<BidStatusFilter>('All');
    const [projectStatusFilter, setProjectStatusFilter] = useState<ProjectStatusFilter>('All');

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

    const filteredBids = useMemo(() => {
        let result = bids;
        
        // Filter by bid status
        if (bidStatusFilter !== 'All') {
            result = result.filter(bid => {
                switch (bidStatusFilter) {
                    case BidRequestStatus.Pending:
                        return bid.pendingBidsCount > 0;
                    case BidRequestStatus.Responded:
                        return bid.respondedBidsCount > 0;
                    case BidRequestStatus.Accepted:
                        return bid.acceptedBidsCount > 0;
                    case BidRequestStatus.Rejected:
                        return bid.rejectedBidsCount > 0;
                    default:
                        return true;
                }
            });
        }
        
        // Filter by project status
        if (projectStatusFilter !== 'All') {
            result = result.filter(bid => bid.projectStatus === projectStatusFilter);
        }
        
        return result;
    }, [bids, bidStatusFilter, projectStatusFilter]);

    return { 
        bids: filteredBids, 
        loading, 
        error, 
        refetch: fetchBids,
        bidStatusFilter,
        setBidStatusFilter,
        projectStatusFilter,
        setProjectStatusFilter
    };
};
