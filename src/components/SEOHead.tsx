import { useEffect } from "react";

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

    // Update canonical
    if (canonicalPath) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", `https://usealt.com${canonicalPath}`);
      }
    }

    // Add page-specific schema markup
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
