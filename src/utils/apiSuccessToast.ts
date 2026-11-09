type SuccessToastListener = (message: string) => void;

const listeners = new Set<SuccessToastListener>();

export function subscribeToSuccessToasts(listener: SuccessToastListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function showSuccessToast(message: string): void {
  const text = typeof message === "string" ? message.trim() || "Thao tác thành công" : "Thao tác thành công";
  listeners.forEach((listener) => listener(text));
}
