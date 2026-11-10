import { getApiOrigin } from "./apiUrl";

const API_BASE = getApiOrigin();
export const resolveImageUrl = (url?:string | null) => {
    if(!url) return null;
    if (/^(https?:|file:|data:)/.test(url)) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

