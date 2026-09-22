import "server-only";
import Image from "next/image";
import Link from "next/link";
import { LockProjectButton } from "../[slug]/projectGate";
import styles from "./formCaseStudy.module.css";

const site = "https://www.formcharleston.com";
const cdn = "https://cdn.prod.website-files.com/698db571bc9c2bc4453ce5ce/";
const images = {
  movement: `${cdn}698db571bc9c2bc4453ce732_5Q9A0230.jpg.webp`,
  downtown: `${cdn}698db571bc9c2bc4453ce72b_n3MoO6UQ.webp`,
  mountPleasant: `${cdn}698db571bc9c2bc4453ce72c_IMG_9024%20(1).webp`,
  community: `${cdn}698db571bc9c2bc4453ce721_906498335ebc38c170826939e9b26366308658ee.webp`,
};

const experiencePages = [
  {
    number: "01",
    title: "Home",
    path: "",
    description: "Introduce the studio, the Lagree method, both locations, and a direct route to booking.",
  },
  {
    number: "02",
    title: "About",
    path: "/about-us",
    description: "Build confidence through the teaching philosophy, studio story, FAQs, and community proof.",
  },
  {
    number: "03",
    title: "First timers",
    path: "/first-timers",
    description: "Prepare new visitors with arrival, equipment, parking, age, and class guidance.",
  },
  {
    number: "04",
    title: "Private events",
    path: "/private-classes-events",
    description: "Frame group classes as a tailored experience for celebrations, trips, and teams.",
  },
  {
    number: "05",
    title: "Solo sessions",
    path: "/solo-sessions",
    description: "Explain one-to-one coaching for beginners, focused goals, form, and recovery needs.",
  },
  {
    number: "06",
    title: "Lymphatic drainage",
    path: "/brazilian-lymphatic-drainage",
    description: "Connect recovery services at Mount Pleasant with the wider FORM wellness experience.",
  },
  {
    number: "07",
    title: "Booking & pricing",
    path: "/book-your-classes",
    description: "Organize offers, memberships, packages, and the handoff into Mariana Tek.",
  },
  {
    number: "08",
    title: "The FORMula",
    path: "/the-formula",
    description: "Turn FORM's training philosophy into a memorable, repeatable weekly practice.",
  },
] as const;

function LiveLink({ path = "", children }: { path?: string; children: React.ReactNode }) {
  return <a href={`${site}${path}`} target="_blank" rel="noopener noreferrer" className={styles.liveLink}>{children}<span aria-hidden="true">↗</span><span className={styles.srOnly}> (opens in a new tab)</span></a>;
}

export default function FormCaseStudy() {
  return (
    <main className={styles.page}>
      <article className={styles.surface}>
        <header className={styles.hero}>
          <div className={styles.topline}><Link href="/">← Portfolio</Link><span>Selected work / 01</span><LockProjectButton /></div>
          <p className={styles.eyebrow}><span />FORM Charleston · Fitness & wellness</p>
          <h1>From discovering the studio<br />to booking a first class.</h1>
          <div className={styles.introRow}>
            <p>A website I created for FORM Charleston, connecting the studio’s identity with the practical steps of becoming a first-time visitor.</p>
            <LiveLink>Visit live website</LiveLink>
          </div>
          <dl className={styles.facts}>
            <div><dt>Client</dt><dd>FORM Charleston</dd></div>
            <div><dt>Sector</dt><dd>Lagree fitness</dd></div>
            <div><dt>Contribution</dt><dd>Website creation</dd></div>
            <div><dt>Experience scope</dt><dd>8 core routes</dd></div>
          </dl>
        </header>

        <figure className={styles.cover}>
          <Image unoptimized src={images.movement} alt="A participant exercising on a Megaformer at FORM Charleston" fill priority sizes="100vw" />
          <div className={styles.coverShade} />
          <div className={styles.coverType} aria-hidden="true">FORM<span>Strength starts here.</span></div>
          <figcaption>Studio photography from the live FORM website</figcaption>
        </figure>

        <nav className={styles.sectionNav} aria-label="Case study sections">
          <a href="#form-context">Context</a><a href="#form-experience">Journey</a><a href="#form-architecture">Site map</a><a href="#form-locations">Locations</a><a href="#form-booking">Booking</a><a href="#form-delivery">Delivery</a>
        </nav>

        <section id="form-context" className={styles.editorial}>
          <p className={styles.label}>01 / The context</p>
          <div><h2>A studio experience begins before the first visit.</h2><p>FORM offers Lagree classes in Downtown Charleston and Mount Pleasant. Its website introduces the method, the studios, and the community while giving visitors a route into booking.</p><p>The central experience question: how can someone move from interest to knowing where to go, what to expect, and how to reserve a class?</p></div>
        </section>

        <section id="form-experience" className={styles.experience}>
          <div className={styles.sectionHeading}><p className={styles.label}>02 / The visitor journey</p><h2>Inspiration, followed by direction.</h2></div>
          <ol className={styles.steps}>
            <li><span>01</span><h3>Discover</h3><p>Meet the studio through movement photography, its story, and an introduction to Lagree.</p></li>
            <li><span>02</span><h3>Choose</h3><p>Explore the two locations and find the practical details for a visit.</p></li>
            <li><span>03</span><h3>Prepare</h3><p>Understand first-class expectations before arriving.</p></li>
            <li><span>04</span><h3>Book</h3><p>Continue to pricing and the integrated class-booking platform.</p></li>
          </ol>
          <div className={styles.brandRow}><div><p className={styles.label}>Brand experience</p><h3>Show the people.<br />Explain the experience.</h3><p>The public site brings studio photography, information about the method, and community stories into one place. These elements give a visitor both an impression of FORM and a reason to explore further.</p><LiveLink path="/about-us">Explore the studio story</LiveLink></div><figure className={styles.community}><Image unoptimized src={images.community} alt="FORM Charleston team pictured together" width={1200} height={800} sizes="(max-width: 800px) 100vw, 50vw" /><figcaption>Community imagery used on the live website.</figcaption></figure></div>
        </section>

        <section id="form-architecture" className={styles.siteMap}>
          <div className={styles.sectionHeading}>
            <p className={styles.label}>03 / The experience map</p>
            <h2>Eight routes.<br />One connected studio story.</h2>
            <p>Each route answers a different visitor question while keeping the same visual language, practical detail, and next-step momentum.</p>
          </div>
          <ol className={styles.routeGrid}>
            {experiencePages.map((page) => (
              <li key={page.number} className={styles.routeCard}>
                <span>{page.number}</span>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
                <LiveLink path={page.path}>View live page</LiveLink>
              </li>
            ))}
          </ol>
        </section>

        <section id="form-locations" className={styles.locations}>
          <div className={styles.sectionHeading}><p className={styles.label}>04 / Two locations</p><h2>One brand.<br />Two places to begin.</h2><p>Location information pairs each studio with its own address, directions, and parking guidance. A visitor can plan the journey as well as the workout.</p></div>
          <div className={styles.locationGrid}>
            <figure><div className={styles.locationImage}><Image unoptimized src={images.downtown} alt="The entrance to FORM Downtown Charleston" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><figcaption><span>Downtown Charleston</span><span>320 Broad Street</span></figcaption></figure>
            <figure><div className={styles.locationImage}><Image unoptimized src={images.mountPleasant} alt="The entrance to FORM Mount Pleasant" fill sizes="(max-width: 800px) 100vw, 50vw" /></div><figcaption><span>Mount Pleasant</span><span>725 Coleman Boulevard</span></figcaption></figure>
          </div>
        </section>

        <section className={styles.firstVisit}>
          <div><p className={styles.label}>05 / First-time visitors</p><h2>Answer the questions<br />before the first class.</h2><p>The dedicated first-timer page gathers preparation guidance in one place: arriving early, required sticky socks, parking, and the introductory class. It also explains limits for first-time bookings and links onward to classes.</p><LiveLink path="/first-timers">View the first-timer guide</LiveLink></div>
          <div className={styles.questionList}><p>What would a new visitor need to know?</p><ul><li>What should I expect?</li><li>When should I arrive?</li><li>What do I need to bring?</li><li>Where can I park?</li><li>How do I book my first class?</li></ul></div>
        </section>

        <section id="form-booking" className={styles.booking}>
          <p className={styles.label}>06 / Booking & pricing</p><h2>A clear handoff<br />from browsing to booking.</h2>
          <div className={styles.bookingColumns}><p>The booking page brings introductory offers, memberships, class packages, and private-session options alongside a Mariana Tek integration. The website provides context for choosing; the third-party platform powers reservations.</p><div><h3>Website and platform, with distinct roles.</h3><p>This case study covers the FORM website. Mariana Tek’s scheduling, account, and transaction functionality is credited to that platform, rather than presented as a custom booking product I built.</p><LiveLink path="/book-your-classes">Explore booking & pricing</LiveLink></div></div>
        </section>

        <section id="form-delivery" className={styles.editorial}>
          <p className={styles.label}>07 / The delivered website</p>
          <div><h2>A connected introduction to FORM.</h2><p>The delivered experience brings studio discovery, location information, first-visit preparation, and booking access together in a live website.</p><p>This presentation documents the published experience. Booking conversion, retention, and usability improvements are not claimed here without supporting measurement.</p><LiveLink>Explore the delivered website</LiveLink></div>
        </section>
        <aside className={styles.sourceNote}>Photography and examples reference the public FORM Charleston website. This private case study does not include client analytics or internal research materials.</aside>
        <footer className={styles.footer}><p className={styles.label}>Next project / 02</p><Link href="/work/blueshield">Blueshield<span aria-hidden="true">↗</span></Link></footer>
      </article>
    </main>
  );
}
