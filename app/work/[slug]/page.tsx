import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import portrait from "../../../src/assets/image/image.png";
import { getWorkProject, workProjects } from "../../../src/data/workProjects";
import styles from "./workProject.module.css";
import { hasProjectAccess } from "../../../src/lib/projectAccess";
import ProjectGate, { LockProjectButton } from "./projectGate";

type WorkProjectPageProps = {
  readonly params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return workProjects.filter(({ slug }) => slug !== "form-charleston").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "form-charleston") {
    return {
      title: "Form Charleston — Private case study | Abishek Jayathilaka",
      description: "Request access to the Form Charleston case study.",
      robots: { index: false, follow: false, noarchive: true },
      openGraph: { title: "Form Charleston — Private case study", description: "Password-protected selected work.", images: [] },
      twitter: { card: "summary", title: "Form Charleston — Private case study", description: "Password-protected selected work.", images: [] },
    };
  }
  const project = getWorkProject(slug);

  if (!project) return {};

  return {
    title: `${project.name} — Selected work | Abishek Jayathilaka`,
    description: project.description,
    openGraph: {
      title: `${project.name} — Selected work`,
      description: project.description,
      images: [],
    },
    twitter: {
      card: "summary",
      title: `${project.name} — Selected work`,
      description: project.description,
      images: [],
    },
  };
}

export default async function WorkProjectPage({ params }: WorkProjectPageProps) {
  const { slug } = await params;
  if (slug === "form-charleston" && !await hasProjectAccess()) return <ProjectGate />;
  const project = getWorkProject(slug);

  if (!project) notFound();

  const projectIndex = workProjects.findIndex((item) => item.slug === project.slug);
  const nextProject = workProjects[(projectIndex + 1) % workProjects.length];

  return (
    <main
      className={styles.page}
      style={{ "--project-accent": project.accent } as React.CSSProperties}
    >
      <article className={styles.surface}>
        <header className={styles.hero}>
          <div className={styles.heroTopline}>
            <Link href="/#about" className={styles.backLink}>
              <span aria-hidden="true">←</span> Selected work
            </Link>
            <span>{project.number} / {String(workProjects.length).padStart(2, "0")}</span>
            {slug === "form-charleston" ? <LockProjectButton /> : null}
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span aria-hidden="true" />
                {project.name}
              </p>
              <h1>{project.title}</h1>
              <p className={styles.lead}>{project.description}</p>
            </div>

            <dl className={styles.projectMeta}>
              <div><dt>Discipline</dt><dd>{project.discipline}</dd></div>
              <div><dt>Focus</dt><dd>{project.strengths.join(" · ")}</dd></div>
              <div><dt>Context</dt><dd>{project.year}</dd></div>
            </dl>
          </div>
        </header>

        <figure className={styles.projectVisual}>
          <Image
            src={portrait}
            unoptimized
            alt={`Monochrome visual representing ${project.name}`}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 94vw"
            className={styles.projectImage}
            style={{ objectPosition: project.imagePosition }}
          />
          <div className={styles.visualWash} aria-hidden="true" />
          <figcaption>
            <span>{project.number}</span>
            <span>{project.name}</span>
          </figcaption>
        </figure>

        <section className={styles.overview} aria-labelledby="overview-title">
          <div className={styles.sectionLabel}>Overview</div>
          <div className={styles.overviewCopy}>
            <p className={styles.kicker}>The challenge</p>
            <h2 id="overview-title">Make the complex feel considered.</h2>
            <p>{project.challenge}</p>
            <p>{project.direction}</p>
          </div>
          <div className={styles.responsibilities}>
            <p className={styles.kicker}>Selected contribution</p>
            <ul>
              {project.responsibilities.map((responsibility) => (
                <li key={responsibility}>{responsibility}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.approach} aria-labelledby="approach-title">
          <div className={styles.approachHeading}>
            <p className={styles.kicker}>Design approach</p>
            <h2 id="approach-title">A clear path from ambiguity to action.</h2>
          </div>
          <ol className={styles.approachGrid}>
            {project.approach.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.principles} aria-labelledby="principles-title">
          <div>
            <p className={styles.kicker}>Experience principles</p>
            <h2 id="principles-title">What guided the work.</h2>
          </div>
          <ul>
            {project.principles.map((principle, index) => (
              <li key={principle}><span>0{index + 1}</span>{principle}</li>
            ))}
          </ul>
        </section>

        <aside className={styles.ndaNote}>
          <p className={styles.kicker}>A note on confidentiality</p>
          <p>
            Some project details and client materials are protected by NDA. This
            page focuses on the design thinking, responsibilities, and principles
            that can be shared responsibly without exposing confidential work.
          </p>
        </aside>

        <footer className={styles.nextProject}>
          <span>Next project · {nextProject.number}</span>
          <Link href={`/work/${nextProject.slug}`}>
            {nextProject.name}<span aria-hidden="true">↗</span>
          </Link>
        </footer>
      </article>
    </main>
  );
}
