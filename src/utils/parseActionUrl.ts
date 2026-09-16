export function parseActionUrl(url: string): { pathname: string; params: Record<string, string> } {
  const [pathname, queryString] = url.split("?");
  const params: Record<string, string> = {};

  if (queryString) {
    queryString.split("&").forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value ?? "");
    });
  }

  return { pathname: `/${pathname}`, params };
}

