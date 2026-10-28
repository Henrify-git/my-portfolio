/* ==================================================================
   YOUR CONTENT: this is the ONLY file you edit to change text/links.
   SAFE-EDIT RULES
   1. Only change what is between the "quote marks".
   2. Keep every comma , and bracket [ ] { } exactly where it is.
   3. Need a quote inside text? Use a ' (apostrophe) or write \"  .
   4. Save, refresh the browser. If the page goes blank, undo your last change.
   Images: put files in public/images/ and write their path here.
   If a file is missing, a colored placeholder is shown instead.
   ================================================================== */
window.PORTFOLIO = {

  /* ---------- Identity ---------- */
  name: "Your Name",
  logo: "YourName",                              // text in the top navigation
  badgeRole: "Your Title<br>+ Your Specialty",   // under your name on the ID badge (<br> = new line)
  signature: "hi, I'm You",                      // handwriting beside intro photo
  email: "you@example.com",
  whatsapp: "https://wa.me/",                    // floating chat button
  social: "#",                                   // e.g. "https://www.linkedin.com/in/yourname"
  resume: "public/resume.pdf",                   // put your PDF at public/resume.pdf

  /* ---------- Images (see README table) ---------- */
  profilePhoto: "public/images/profile.jpg",           // ID badge photo (portrait, ~800x900)
  introPhoto:   "public/images/intro-portrait.jpg",    // big photo beside intro text
  introShot:    "public/images/intro-screenshot.jpg",  // small tablet screenshot over it
  aboutPhoto:   "public/images/about.jpg",             // About section photo (landscape)

  /* ---------- ID badge extras ---------- */
  badgeMini: "Short<br>tagline<br>here",   // tiny text top-left of badge photo
  badgeAvail: "Available worldwide",
  badgeId: "ID 0001",
  handle: "@yourhandle",                   // back of badge
  badgeTag: "Your tagline goes here",      // handwritten line on back of badge

  /* ---------- Hero ---------- */
  corners: ["Designer", "Developer", "Creator", "Idealist"],   // 4 floating words
  typedHero: ["Designing apps people love", "Building websites that work"],

  /* ---------- Intro ---------- */
  introHeading: "I design things people actually use.",
  introText: "Short introduction about you, your background and the kind of work you do, written in two or three lines.",

  /* ---------- Roles (also shown on the badge back: first 3) ---------- */
  // c = icon color, i = icon symbol
  roles: [
    { t: "Designer",  d: "Short line about this role", c: "#5aa2ff", i: "✎"  },
    { t: "Developer", d: "Short line about this role", c: "#7c8cff", i: "</>" },
    { t: "Creator",   d: "Short line about this role", c: "#3fd0c9", i: "▣"  },
    { t: "Idealist",  d: "Short line about this role", c: "#ffd166", i: "✦"  }
  ],

  /* ---------- Statistics: [big number, label] ---------- */
  stats: [["00+", "Label one"], ["00+", "Label two"], ["00k+", "Label three"], ["0+", "Label four"]],

  /* ---------- Scrolling tools strip ---------- */
  tools: ["Tool one", "Tool two", "Tool three", "Tool four", "Tool five", "Tool six"],

  /* ---------- Selected work (sliding cards; click opens url) ---------- */
  workSub: "One-line summary of the kind of work shown below.",
  // tall: 1 = phone-shaped card. img = screenshot in public/images/projects/
  projects: [
    { n: "Project one",   k: "Category", img: "public/images/projects/project-1.jpg", url: "#" },
    { n: "Project two",   k: "Category", img: "public/images/projects/project-2.jpg", url: "#" },
    { n: "Project three", k: "Category", img: "public/images/projects/project-3.jpg", url: "#", tall: 1 },
    { n: "Project four",  k: "Category", img: "public/images/projects/project-4.jpg", url: "#", tall: 1 },
    { n: "Project five",  k: "Category", img: "public/images/projects/project-5.jpg", url: "#" },
    { n: "Project six",   k: "Category", img: "public/images/projects/project-6.jpg", url: "#", tall: 1 }
  ],

  /* ---------- DESIGNS (list on home page + one story page each) ----------
     To ADD a design: copy a whole { ... }, block, paste it after the last one,
     then change slug, name, summary, image, links and story.
     slug  = short web name: lowercase letters, numbers and dashes only, unique.
     story = the chapters shown on the design's own page, top to bottom.
             text can be one "sentence" or several: ["para one", "para two"].
             image is optional per chapter (delete the image line to hide it). */
  designsSub: "A short line about the designs listed below.",
  designs: [
    {
      slug: "design-one",
      name: "Design name one",
      kind: "Website",                         // shown in the list + page ("Website", "Mobile app")
      summary: "One or two sentences that sell this design.",
      image: "public/images/designs/design-one-cover.jpg",   // cover (16:9)
      role: "Your role", year: "2026", tools: "Figma, Framer",
      liveUrl: "https://example.com",          // the "View live" button
      liveLabel: "View live website",          // use "View live app" for apps
      story: [
        { title: "The problem", text: "What was broken or missing, and for whom?", image: "public/images/designs/design-one-1.jpg" },
        { title: "The approach", text: ["How you thought about it.", "What you tried and what you chose."], image: "public/images/designs/design-one-2.jpg" },
        { title: "The result", text: "What changed once it shipped." }
      ]
    },
    {
      slug: "design-two", name: "Design name two", kind: "Mobile app",
      summary: "One or two sentences that sell this design.",
      image: "public/images/designs/design-two-cover.jpg",
      role: "Your role", year: "2026", tools: "Figma",
      liveUrl: "https://example.com", liveLabel: "View live app",
      story: [
        { title: "The problem", text: "What was broken or missing, and for whom?", image: "public/images/designs/design-two-1.jpg" },
        { title: "The result", text: "What changed once it shipped." }
      ]
    },
    {
      slug: "design-three", name: "Design name three", kind: "Website",
      summary: "One or two sentences that sell this design.",
      image: "public/images/designs/design-three-cover.jpg",
      role: "Your role", year: "2025", tools: "Framer",
      liveUrl: "https://example.com", liveLabel: "View live website",
      story: [{ title: "The problem", text: "What was broken or missing, and for whom?" }, { title: "The result", text: "What changed once it shipped." }]
    }
  ],

  /* ---------- About ---------- */
  aboutTag: "Featured / short badge text",
  aboutText: "Write two lines about who you are, where you are based and what you enjoy building.",
  aboutList: ["First thing you do", "Second thing you do", "Third thing you do"],

  /* ---------- Contact ---------- */
  cta: "Got an idea?<br>Let's build it."
};
