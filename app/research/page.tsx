import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import styles from "./research.module.css";

export const metadata: Metadata = {
  title: "Research | Abishek Jayathilaka",
  description: "PhysicsDiff-PCB: physics-guided generative AI for crosstalk-aware PCB layout generation. Explore the research, paper, and poster.",
};

const documents = "/research/physicsdiff-pcb";

export default function ResearchPage() {
  return (
    <main className={styles.page}>
      <div className={styles.surface}>
        <header className={styles.intro}>
          <p className={styles.eyebrow}><span /> Research & exploration</p>
          <h1>From questions<br />to possibilities.</h1>
          <p className={styles.lead}>Exploring the intersection of artificial intelligence, physics, and engineering through collaborative research.</p>
          <div className={styles.index}><span>Selected research</span><span>01 project / 2026</span></div>
        </header>

        <article aria-labelledby="project-title" className={styles.project}>
          <div className={styles.projectIntro}>
            <div>
              <p className={styles.eyebrow}>01 / Physics-aware generative AI</p>
              <h2 id="project-title">PhysicsDiff-PCB</h2>
              <p className={styles.subtitle}>Physics Guided Conditional Diffusion for Crosstalk Aware PCB Layout Generation</p>
            </div>
            <div className={styles.tags} aria-label="Research topics">
              <span>Inverse design</span><span>Diffusion models</span><span>Signal integrity</span>
            </div>
          </div>

          <div className={styles.feature}>
            <figure className={styles.poster}>
              <a href={`${documents}/poster.pdf`} target="_blank" rel="noopener noreferrer" aria-label="Open the PhysicsDiff-PCB poster PDF in a new tab">
                <Image unoptimized src={`${documents}/poster-preview.png`} alt="PhysicsDiff-PCB research poster showing the conditional diffusion architecture, generated PCB layouts, comparative results, and openEMS validation." width={1133} height={1600} />
              </a>
              <figcaption>Research poster · IEEE IRAI 2026 · Melbourne, Australia</figcaption>
            </figure>

            <div className={styles.summary}>
              <p className={styles.eyebrow}>The research question</p>
              <h3>Can we generate a PCB layout from its electrical requirements?</h3>
              <p>High-speed circuit design often involves repeated geometry changes and expensive electromagnetic simulations. This research explores the inverse problem: generating copper trace layouts directly from electrical and material specifications.</p>
              <p>PhysicsDiff-PCB combines conditional diffusion with a frozen physics surrogate. The surrogate supplies impedance and near-end crosstalk feedback during training, while mask and smoothness losses encourage coherent trace geometry.</p>
              <div className={styles.actions}>
                <a className={styles.primary} href={`${documents}/paper.pdf`} target="_blank" rel="noopener noreferrer">Read the paper <span aria-hidden="true">↗</span></a>
                <a className={styles.secondary} href={`${documents}/poster.pdf`} target="_blank" rel="noopener noreferrer">View poster <span aria-hidden="true">↗</span></a>
              </div>
              <p className={styles.documentNote}>PDF documents · Open in a new tab</p>
              <dl className={styles.credits}>
                <div><dt>Authors</dt><dd>Abishek Jayathilaka, Ushan Kamesh, Chanaka Madhuranga, Sulitha Nulaksha, and Ramishka Thennakoon</dd></div>
                <div><dt>Affiliation</dt><dd>Department of Electrical and Information Engineering, Faculty of Engineering, University of Ruhuna</dd></div>
              </dl>
            </div>
          </div>

          <section className={styles.results} aria-labelledby="results-title">
            <div className={styles.sectionHeading}><p className={styles.eyebrow}>Reported results</p><h3 id="results-title">Geometry guided by physics.</h3></div>
            <dl className={styles.metrics}>
              <div><dd>10,000</dd><dt>Synthetic layouts in the dataset</dt></div>
              <div><dd>50</dd><dt>DDIM sampling steps</dt></div>
              <div><dd>0.183 <small>V</small></dd><dt>Reported near-end crosstalk error</dt></div>
              <div><dd>0.312</dd><dt>Conditioning responsiveness</dt></div>
            </dl>
            <p className={styles.resultNote}>The paper reports the lowest crosstalk error and highest conditioning responsiveness among the five evaluated approaches. These comparison metrics use surrogate-based evaluation; they are distinct from full-wave simulation results. Dataset split: 80% training, 10% validation, 10% testing.</p>
          </section>

          <div className={styles.details}>
            <section aria-labelledby="method-title">
              <p className={styles.eyebrow}>Method</p><h3 id="method-title">From specification to copper mask.</h3>
              <ol className={styles.steps}>
                <li><strong>Condition the generator</strong><p>An eight-dimensional electromagnetic specification vector guides a conditional U-Net through cross-attention.</p></li>
                <li><strong>Guide learning with physics</strong><p>A frozen predictor provides impedance and crosstalk feedback alongside diffusion, mask-quality, and smoothness losses.</p></li>
                <li><strong>Generate and evaluate</strong><p>DDIM produces 128 × 128 copper masks. Representative layouts are independently evaluated with the openEMS full-wave FDTD solver.</p></li>
              </ol>
            </section>
            <section className={styles.validation} aria-labelledby="validation-title">
              <p className={styles.eyebrow}>Validation & next steps</p><h3 id="validation-title">Promising results.<br />Clear boundaries.</h3>
              <p>For the representative case reported in the paper, openEMS produced an impedance of 112.36 Ω against a target of 112.38 Ω. Crosstalk showed a larger difference: 0.2663 V in openEMS against a target of 0.1596 V.</p>
              <p>The training labels rely on analytical proxies, and independent FDTD validation is representative rather than large-scale. Broader solver-based benchmarking and experimental hardware measurements remain future work.</p>
              <a href={`${documents}/paper.pdf#page=5`} target="_blank" rel="noopener noreferrer">Explore the evaluation in the paper <span aria-hidden="true">↗</span></a>
            </section>
          </div>
        </article>
        <footer className={styles.footer}><span>Curiosity, tested through research.</span><Link href="/contact">Let’s talk research <span aria-hidden="true">↗</span></Link></footer>
      </div>
    </main>
  );
}
