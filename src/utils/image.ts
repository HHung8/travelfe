// const API_BASE = (process.env.EXPO_PUBLIC_API_URL ??  "http://10.28.176.97:5167").replace(/\/$/, "");
const API_BASE = (process.env.EXPO_PUBLIC_API_URL ?? "http://10.28.176.149:5167").replace(/\/$/, "");
export const resolveImageUrl = (url?:string | null) => {
    if(!url) return null;
    if (/^(https?:|file:|data:)/.test(url)) return url;
    return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};


