import httpClient from '@/common/helpers/httpClient';
import type { Review, CreateReview } from '@/types/review';

class ReviewService {
	/**
	 * Get reviews for specialist
	 */
	async getSpecialistReviews(specialistId: number): Promise<Review[]> {
		const data = await httpClient.get<Review[]>(`/api/reviews/specialists/${specialistId}`);
		return data as Review[];
	}

	/**
	 * Create review
	 */
	async createReview(review: CreateReview): Promise<Review> {
		const data = await httpClient.post<Review>('/api/reviews', review);
		return data as Review;
	}

	/**
	 * Update review
	 */
	async updateReview(id: number, review: CreateReview): Promise<Review> {
		const data = await httpClient.put<Review>(`/api/reviews/${id}`, review);
		return data as Review;
	}

	/**
	 * Delete review
	 */
	async deleteReview(id: number): Promise<void> {
		await httpClient.delete(`/api/reviews/${id}`);
	}
}

export default new ReviewService();
