export type ReviewTargetType = "tour" | "hotel";

export interface MyReviewItem {
  id: string;
  targetType: ReviewTargetType;
  targetId: string;
  targetTitle: string;
  thumbnailUrl: string | null;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
}

export interface CreateReviewRequest {
  targetType: ReviewTargetType;
  targetId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  comment?: string;
}

export interface ReviewDto {
  id: string;
  userId: string;
  userName: string;
  avatarUrl: string | null;
  targetType: ReviewTargetType;
  targetId: string;
  rating: number;
  comment: string | null;
  isVerified: boolean;
  createdAt: string;
}