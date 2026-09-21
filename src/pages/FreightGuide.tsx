import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";

const guides = {
  "/texas-flatbed-freight": {
    title: "Texas Flatbed Freight Broker | American Lady Transport",
    description: "Flatbed and open-deck freight brokerage from Willis, TX. Plan construction-material and machinery shipments with equipment, loading and quote requirements.",
    heading: "Texas Flatbed Freight Brokerage",
    intro: "American Lady Transport is a freight brokerage based in Willis, Texas. We arrange flatbed and open-deck transportation for construction materials, machinery, HVAC duct, sand blasters and industrial freight. Start with your load details so the equipment and quote reflect the shipment you actually need to move.",
    sections: [
      { title: "Start with the freight, not just a trailer name", paragraphs: [
        "Tell us the commodity, piece count, total weight and the length, width and height of each piece, including packaging. Photos can help explain the shape of a machine or an unusual load, but they do not replace measured dimensions.",
        "Flatbeds, step decks, double drops and removable-gooseneck trailers serve different loading and clearance needs. The equipment choice depends on your actual freight, how it can be loaded, and the pickup and delivery sites. Tell us if the equipment rolls, whether a crane or forklift is available, and whether anything extends beyond its transport footprint.",
      ] },
      { title: "Texas origins with nationwide reach", paragraphs: [
        "Our Willis base serves shippers in the Conroe and greater Houston area, with freight brokerage coverage across the lower 48 states and Canada. Send the full origin and destination for a lane-specific quote; a city name alone cannot establish availability, transit time or price.",
        "For a Houston-to-Dallas request, for example, include both facility ZIP codes, the ready date and delivery deadline. That is an example of how to describe a lane, not a published schedule or a claim that equipment is waiting on that route.",
      ] },
      { title: "Loading, protection and jobsite requirements", paragraphs: [
        "Identify tarping or weather-protection needs, loading appointments, jobsite check-in rules and any limited-access roads before booking. State who provides loading and unloading equipment and whether the receiving crew will be available when the truck arrives.",
        "For potentially oversize or overweight freight, provide exact dimensions and weight for review. Do not assume a standard trailer quote includes permits, escorts or a specific route. Those requirements and charges need to be confirmed for the individual move.",
      ] },
      { title: "What to confirm before dispatch", paragraphs: [
        "American Lady connects shippers with vetted carriers rather than promising that every shipment uses a company-owned truck. Ask your freight contact to confirm the assigned carrier, equipment, shipment-specific insurance requirements, pickup plan and update process before loading.",
        "Keep the commodity description, loading instructions and delivery contacts consistent across the quote, shipping documents and dispatch instructions. If any detail changes, let us know before the truck arrives so the plan can be reviewed.",
      ] },
      { title: "How a useful flatbed quote is built", paragraphs: [
        "A quote needs more than mileage. Freight dimensions, equipment, dates, carrier availability, protection requirements and site conditions all affect the arrangement. Ask what is included and how waiting time, changed appointments or other additional services would be handled.",
        "We do not publish a one-size-fits-all per-mile promise on this page. Send the shipment information below for a quote that can be checked against your actual requirements.",
      ] },
    ],
  },
  "/freight-quote-checklist": {
    title: "Freight Quote Checklist for Shippers | American Lady Transport",
    description: "Prepare a complete freight quote request: pickup and delivery, dimensions, weight, equipment, timing, loading access and shipment requirements.",
    heading: "What to Include in a Freight Quote Request",
    intro: "A complete request helps a broker evaluate equipment and pricing without repeatedly coming back for missing information. Use this checklist for flatbed, full truckload, partial or LTL freight, then send the details through American Lady Transport’s quote page.",
    sections: [
      { title: "Pickup and delivery details", paragraphs: [
        "Provide each city, state or province and postal code, plus the facility type: warehouse, construction site, business or another location. Include available pickup and receiving windows and tell us whether appointments are required.",
        "Distinguish a preferred delivery date from a firm appointment or project deadline. Include site-contact information in the actual quote request, not in a public review or social post.",
      ] },
      { title: "Commodity, count, dimensions and weight", paragraphs: [
        "Describe what is being shipped in plain language. Include the number of pallets, bundles, crates or machines; measured dimensions for each piece; and the total shipment weight. Specify the units so inches are not mistaken for feet or pounds for kilograms.",
        "For LTL requests, provide the freight class or NMFC information if known and identify stackability. If you do not know a classification, say so rather than guessing. Explain whether the freight is packaged, loose, unusually shaped or subject to special handling.",
      ] },
      { title: "Equipment and loading access", paragraphs: [
        "State the equipment you believe you need, or ask for help selecting it. Tell us whether loading requires a dock, forklift, crane, ramps or another arrangement, and whether the same equipment is available at delivery.",
        "Mention tarping, weather protection, restricted access, liftgate needs, oversized dimensions or any other condition that changes how the freight can move. These are quote inputs, not a guarantee that every requested option is available.",
      ] },
      { title: "Compare quotes on the same scope", paragraphs: [
        "Compare the same commodity, equipment, route, dates and loading conditions. Ask whether the price includes fuel and the services you requested, what assumptions it uses, and how extra waiting time or a changed load would be priced.",
        "Confirm the quote’s validity and whether capacity has actually been booked. An estimate, an accepted quote and a dispatched truck are different stages; ask your contact which stage applies.",
      ] },
      { title: "A sample request you can adapt", paragraphs: [
        "Example only, not an actual customer shipment: “Pickup: Houston, TX [ZIP]. Delivery: Dallas, TX [ZIP]. Freight: [commodity], [piece count], [dimensions of each piece], [total weight]. Loading: [forklift/crane/dock]. Ready: [date and hours]. Delivery: [deadline/appointment]. Protection and special requirements: [details].”",
        "The quote form opens your email app with your information filled in. Review the message and send it from that app. If no email app is configured, email info@usealt.com or call (817) 249-2990; completing the fields alone does not send a request.",
      ] },
    ],
  },
};

export default function FreightGuide() {
  const { pathname } = useLocation();
  const guide = guides[pathname as keyof typeof guides];
  return <div className="min-h-screen">
    <SEOHead title={guide.title} description={guide.description} canonicalPath={pathname}
      schemaMarkup={{ "@context": "https://schema.org", "@type": "WebPage", name: guide.heading, url: `https://usealt.com${pathname}`, description: guide.description }} />
    <Header />
    <main id="main-content" tabIndex={-1} className="pt-44 pb-20">
      <article className="container mx-auto max-w-4xl px-5">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground"><Link to="/">Home</Link> / <Link to="/services">Freight services</Link> / Guide</nav>
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">{guide.heading}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-10">{guide.intro}</p>
        {guide.sections.map(section => <section key={section.title} className="mb-10">
          <h2 className="font-serif text-2xl font-bold mb-4">{section.title}</h2>
          {section.paragraphs.map(text => <p key={text} className="text-muted-foreground leading-relaxed mb-4">{text}</p>)}
        </section>)}
        <aside className="rounded-xl border border-border bg-secondary p-6">
          <h2 className="font-serif text-2xl font-bold mb-4">Plan your shipment</h2>
          <ul className="space-y-3 text-primary underline dark:text-foreground">
            <li><Link to="/shippers">Request a freight quote</Link></li>
            <li><Link to={pathname === "/texas-flatbed-freight" ? "/freight-quote-checklist" : "/texas-flatbed-freight"}>{pathname === "/texas-flatbed-freight" ? "Freight quote checklist" : "Texas flatbed and open-deck freight"}</Link></li>
            <li><Link to="/us-canada-cross-border-freight">U.S. and Canada cross-border freight</Link></li>
            <li><Link to="/about">About American Lady Transport</Link></li>
          </ul>
          <p className="mt-5">Questions? <a className="underline" href="tel:+18172492990">(817) 249-2990</a> or <a className="underline" href="mailto:info@usealt.com">info@usealt.com</a>.</p>
        </aside>
      </article>
    </main>
    <Footer />
  </div>;
}
