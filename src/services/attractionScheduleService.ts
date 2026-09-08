import { AttractionSchedule } from "../types/attractionSchedule";
import { getWithAuth } from "./api";

export async function getSchedulesByAttraction(token: string | null, attractionId: string): Promise<AttractionSchedule[]> {
  const res = await getWithAuth<AttractionSchedule[]>(`/attractions/${attractionId}/schedules`, token);
  return res.data ?? [];
}

