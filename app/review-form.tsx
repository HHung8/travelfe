import { useAuth } from "@/src/context/AuthContext";
import { ReviewTargetType } from "@/src/types/review";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

export default function ReviewFormScreen() {
    const router = useRouter();
    const {accessToken} = useAuth();
    const {targetType, targetId, targetTitle} = useLocalSearchParams<{
        targetType: ReviewTargetType; targetId: string, targetTitle:string;
    }>();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    
}