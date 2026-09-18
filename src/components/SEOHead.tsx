import { useEffect } from "react";
import businessSchema from "@/data/business-schema.json";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  schemaMarkup?: object;
}

const SEOHead = ({ title, description, canonicalPath, schemaMarkup }: SEOHeadProps) => {
  useEffect(() => {
    // Set document title
    document.title = title;
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "index, follow");

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", description);
    }

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute("content", description);

    // Update canonical and social URL together on every client-side navigation.
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        document.head.appendChild(canonical);
      }
      canonical.setAttribute("href", `https://usealt.com${canonicalPath}`);
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement("meta");
        ogUrl.setAttribute("property", "og:url");
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute("content", `https://usealt.com${canonicalPath}`);
    }

    document.getElementById("business-schema")?.remove();
    document.getElementById("page-schema")?.remove();
    if (canonicalPath === "/") {
      const script = document.createElement("script");
      script.id = "business-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(businessSchema);
      document.head.appendChild(script);
    }
    if (schemaMarkup) {
      const existingPageSchema = document.getElementById("page-schema");
      if (existingPageSchema) existingPageSchema.remove();

      const script = document.createElement("script");
      script.id = "page-schema";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(schemaMarkup);
      document.head.appendChild(script);

      return () => {
        const el = document.getElementById("page-schema");
        if (el) el.remove();
      };
    }
  }, [title, description, canonicalPath, schemaMarkup]);

  return null;
};

export default SEOHead;
