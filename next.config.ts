import type { NextConfig } from "next";

/**
 * GitHub Pages project sites live at /<repo>/, not the domain root.
 * In GitHub Actions we derive basePath from GITHUB_REPOSITORY.
 * Locally (and for user/org *.github.io repos) basePath stays empty.
 */
function resolveBasePath(): string {
  if (process.env.BASE_PATH) {
    const value = process.env.BASE_PATH.trim();
    if (!value || value === "/") {
      return "";
    }
    return value.startsWith("/") ? value.replace(/\/$/, "") : `/${value.replace(/\/$/, "")}`;
  }

  if (process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_REPOSITORY) {
    const repo = process.env.GITHUB_REPOSITORY.split("/")[1] ?? "";
    if (!repo || repo.endsWith(".github.io")) {
      return "";
    }
    return `/${repo}`;
  }

  return "";
}

const basePath = resolveBasePath();

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
