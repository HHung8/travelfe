import { PagedResult } from "../types/destination";
import { CreateReviewRequest, MyReviewItem, ReviewDto, UpdateReviewRequest } from "../types/review";
import { deleteWithAuth, getWithAuth, postWithAuth, putWithAuth } from "./api";

export async function getMyReviews(token: string | null): Promise<MyReviewItem[]> {
    const res = await getWithAuth<PagedResult<MyReviewItem>>("/reviews/mine", token);
    return res.data?.items ?? [];
}

export async function createReview(token: string | null, payload: CreateReviewRequest): Promise<ReviewDto> {
    const res = await postWithAuth<ReviewDto>("/reviews", token, payload as unknown as Record<string, unknown>);
    if (!res.data) throw new Error("Không tạo được đánh giá");
    return res.data;
}


export async function updateReview(token: string | null, id: string, payload: UpdateReviewRequest): Promise<ReviewDto> {
    const res = await putWithAuth<ReviewDto>(`/reviews/${id}`, token, payload as unknown as Record<string, unknown>);
    if (!res.data) throw new Error("Không cập nhật được đánh giá");
    return res.data;
}

export async function deleteReview(token: string | null, id: string): Promise<void> {
    await deleteWithAuth(`/reviews/${id}`, token);
}