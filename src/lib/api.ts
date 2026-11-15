const BACKEND_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
)
  .trim()
  .replace(/\/$/, "");

// In-browser diagnostic warning if production HTTPS environment is missing NEXT_PUBLIC_API_URL
if (typeof window !== "undefined") {
  if (window.location.protocol === "https:" && BACKEND_URL.startsWith("http://localhost")) {
    console.warn(
      "[BookNook] Warning: NEXT_PUBLIC_API_URL is defaulting to http://localhost:8000 on an HTTPS production deployment. Browsers block requests to localhost from HTTPS. Please set NEXT_PUBLIC_API_URL in your Vercel project settings to your backend URL and Redeploy."
    );
  }
}

let cachedToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  cachedToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("booknook_token", token);
    } else {
      localStorage.removeItem("booknook_token");
    }
  }
};

export const getAuthToken = (): string | null => {
  if (cachedToken) return cachedToken;
  if (typeof window !== "undefined") {
    cachedToken = localStorage.getItem("booknook_token");
  }
  return cachedToken;
};

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<{ success: boolean; data?: T; count?: number; message?: string; error?: string }> {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${BACKEND_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  } else if (options.requiresAuth) {
    throw new Error("Authentication required for this request.");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const json = await response.json().catch(() => ({
    success: false,
    message: "Network error or invalid server response.",
  }));

  if (!response.ok) {
    const errorMsg = json.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    (err as any).status = response.status;
    (err as any).data = json;
    throw err;
  }

  return json;
}
