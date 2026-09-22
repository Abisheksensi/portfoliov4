import "server-only";

export type WorkProject = {
  readonly slug: string;
  readonly name: string;
  readonly number: string;
  readonly discipline: string;
  readonly year: string;
  readonly title: string;
  readonly description: string;
  readonly strengths: readonly string[];
  readonly challenge: string;
  readonly direction: string;
  readonly responsibilities: readonly string[];
  readonly approach: ReadonlyArray<{
    readonly title: string;
    readonly description: string;
  }>;
  readonly principles: readonly string[];
  readonly accent: string;
  readonly imagePosition: string;
};

export const workProjects: readonly WorkProject[] = [
  {
    slug: "form-charleston",
    name: "Form Charleston",
    number: "01",
    discipline: "Fitness & wellness website",
    year: "Selected work",
    title: "From discovering the studio to booking a first class.",
    description:
      "A website for FORM Charleston, connecting Lagree studio discovery, first-visit guidance, and booking across two locations.",
    strengths: ["Fitness & wellness", "Website creation", "Booking journey"],
    challenge:
      "New studio visitors need to understand the workout, choose a location, prepare for their first visit, and find a route to booking.",
    direction:
      "The published website connects studio identity with practical guidance and a Mariana Tek booking integration.",
    responsibilities: [
      "Website creation for FORM Charleston",
    ],
    approach: [
      {
        title: "Discover the studio",
        description:
          "Introduce FORM through its public studio story, photography, and explanation of Lagree.",
      },
      {
        title: "Prepare for the first visit",
        description:
          "Connect location information with arrival guidance, parking, and first-class expectations.",
      },
      {
        title: "Continue to booking",
        description:
          "Present pricing alongside the third-party Mariana Tek booking integration.",
      },
    ],
    principles: ["Introduce the experience", "Answer first-visit questions", "Make the next step visible"],
    accent: "#f8703e",
    imagePosition: "66% 70%",
  },
  {
    slug: "blueshield",
    name: "Blueshield",
    number: "02",
    discipline: "Healthcare experience",
    year: "Selected work",
    title: "Simplifying complex healthcare choices into a clearer digital journey.",
    description:
      "A selected healthcare experience focused on making dense information easier to understand, navigate, and act on with confidence.",
    strengths: ["Journey mapping", "Accessibility", "Interaction design"],
    challenge:
      "Complex terminology, multiple pathways, and fragmented decision points can make an already important healthcare task feel difficult to complete.",
    direction:
      "The design direction brings related decisions together, clarifies what happens next, and keeps essential guidance visible at the moment it is needed.",
    responsibilities: [
      "Journey and task-flow definition",
      "Information architecture",
      "Responsive interaction design",
      "Accessibility consideration",
    ],
    approach: [
      {
        title: "Understand the decision",
        description:
          "Separate the questions people arrive with from the operational complexity behind the service.",
      },
      {
        title: "Reveal progressively",
        description:
          "Sequence information so each screen answers the current question without overwhelming the next decision.",
      },
      {
        title: "Test the handoffs",
        description:
          "Review the transitions between steps and systems to protect continuity across the complete journey.",
      },
    ],
    principles: ["Explain the next step", "Design for reassurance", "Keep pathways consistent"],
    accent: "#507ca8",
    imagePosition: "34% 58%",
  },
  {
    slug: "cryptolabs-otc",
    name: "Cryptolabs OTC",
    number: "03",
    discipline: "Product strategy & UX",
    year: "Selected work",
    title: "Building clarity and trust into high-stakes OTC workflows.",
    description:
      "A product experience shaped around clear decisions, dependable interaction patterns, and a more confident path through complex transactions.",
    strengths: ["Product strategy", "UX design", "Prototyping"],
    challenge:
      "High-value workflows combine operational complexity with a strong need for confidence. Ambiguous status, terminology, or next steps can quickly undermine trust.",
    direction:
      "The experience is framed around explicit system status, traceable decisions, and a focused path that makes complex actions feel deliberate and controlled.",
    responsibilities: [
      "Product and workflow framing",
      "Task-flow simplification",
      "Interactive prototyping",
      "Design-to-engineering communication",
    ],
    approach: [
      {
        title: "Expose the system state",
        description:
          "Make progress, requirements, and dependencies visible so people understand exactly where a transaction stands.",
      },
      {
        title: "Reduce ambiguity",
        description:
          "Use consistent language and deliberate confirmation patterns for consequential actions and decisions.",
      },
      {
        title: "Prototype the edge cases",
        description:
          "Explore exceptions and recovery paths early so the core workflow remains dependable outside the happy path.",
      },
    ],
    principles: ["Status must be explicit", "Trust is interactional", "Recovery is part of the flow"],
    accent: "#8b6bb4",
    imagePosition: "76% 44%",
  },
  {
    slug: "activate-camera",
    name: "Activate Camera",
    number: "04",
    discipline: "Interaction design",
    year: "Selected work",
    title: "Making camera-led interactions feel simple, guided, and human.",
    description:
      "An interaction concept focused on reducing uncertainty and guiding people naturally from activation through successful completion.",
    strengths: ["Interaction design", "Usability", "Motion"],
    challenge:
      "Camera-led tasks introduce permission, positioning, timing, and feedback challenges. Without clear guidance, people can be unsure whether the system is ready or what to do next.",
    direction:
      "The concept uses timely instructions, visible feedback, and restrained motion to guide the user without competing with the task happening in front of the camera.",
    responsibilities: [
      "Interaction concept development",
      "State and feedback design",
      "Motion direction",
      "Prototype evaluation",
    ],
    approach: [
      {
        title: "Set expectations",
        description:
          "Explain permissions and preparation before activation so the camera never feels sudden or unexplained.",
      },
      {
        title: "Guide in the moment",
        description:
          "Use concise prompts and immediate visual feedback to support positioning and successful completion.",
      },
      {
        title: "Confirm with restraint",
        description:
          "Apply motion as functional feedback, giving each state change a clear purpose and a calm sense of progress.",
      },
    ],
    principles: ["Permission before activation", "Feedback without distraction", "Motion should explain"],
    accent: "#9a8158",
    imagePosition: "50% 80%",
  },
] as const;

export function getWorkProject(slug: string) {
  return workProjects.find((project) => project.slug === slug);
}
