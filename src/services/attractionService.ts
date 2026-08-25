import { AttractionSimple } from "../types/attraction";
import { getWithAuth } from "./api";

export async function getAttractionsByDestination(
    token: string | null,
    destinationId: string
):Promise<AttractionSimple[]>{
    const res = await getWithAuth<AttractionSimple[]>(`/attractions/destinations/${destinationId}`, token);
    console.log(`check res attractions`, res);
    return res.data ?? [];
}