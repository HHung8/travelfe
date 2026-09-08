import { RoomImage } from "../types/roomImage";
import { getWithAuth } from "./api";

export async function getRoomImages(token: string | null, roomId: string): Promise<RoomImage[]> {
    const res = await getWithAuth<RoomImage[]>(`/rooms/${roomId}/images`, token);
    const images = res.data ?? [];
    return images.sort((a, b) => a.displayOrder - b.displayOrder);
}