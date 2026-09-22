import { generateMetadata as projectMetadata } from "../[slug]/page";
import { hasProjectAccess } from "../../../src/lib/projectAccess";
import ProjectGate from "../[slug]/projectGate";
import FormCaseStudy from "./formCaseStudy";

// A dedicated dynamic route keeps request-time authentication separate from
// the three public, statically generated project pages.
export const dynamic = "force-dynamic";

export function generateMetadata() {
  return projectMetadata({ params: Promise.resolve({ slug: "form-charleston" }) });
}

export default async function FormCharlestonPage() {
  if (!await hasProjectAccess()) return <ProjectGate />;
  return <FormCaseStudy />;
}
