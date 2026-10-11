import { useEffect, useState } from "react";

export type Route = "/" | "/login" | "/signup" | "/dashboard" | "/skillbot" | "/scraper" | "/quiz" | "/interview" | "/portfolio";

const parse = (): Route => {
  const h = window.location.hash.replace(/^#/, "") || "/";
  if (h.startsWith("/login")) return "/login";
  if (h.startsWith("/signup")) return "/signup";
  if (h.startsWith("/dashboard")) return "/dashboard";
  if (h.startsWith("/skillbot")) return "/skillbot";
  if (h.startsWith("/scraper")) return "/scraper";
  if (h.startsWith("/quiz")) return "/quiz";
  if (h.startsWith("/interview")) return "/interview";
  if (h.startsWith("/portfolio")) return "/portfolio";
  return "/";
};

export function navigate(to: Route) {
  if (window.location.hash.replace(/^#/, "") === to) {
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = to;
  }
  window.scrollTo({ top: 0 });
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parse());
  const [, setTick] = useState(0);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
      setTick((t) => t + 1);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
