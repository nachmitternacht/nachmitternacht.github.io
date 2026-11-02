// Project data shared by the start page (gallery + index) and project.html.
//   photos: real images (the first one is the preview in the gallery); empty fields are simply left out
//   ratios: width / height of each photo, so the page can reserve the space before the image has loaded
//   evening: (optional) an evening version of each photo; the project page shows a small moon / sun to switch between them
//   shape:  format of the preview frame ("" = 4:3, "tall" = 4:5, "wide" = 16:9)
// Projects without photos (none at the moment) would be shown as placeholders and then need:
//   colors: [sky, haze, ground] for the placeholder gradients
//   images: formats of the further placeholder images on the project page
window.PROJECTS = [
  {
    slug: "longhouse", title: "Longhouse", category: "Personal work", year: 2026,
    location: "", services: ["Concept & floor plan", "Interior views"],
    text: "A home for a couple, closely tied to the nature around it. The project was followed from the first sketch through the floor plan to the final images — shaped by natural materials, warm wood and soft daylight.",
    shape: "tall", photos: ["images/longhouse/scene-01.jpg"], ratios: [0.7778]
  },
  {
    slug: "cafe", title: "Café", category: "Personal work", year: 2026,
    location: "", services: ["Concept & floor plan", "Interior views"],
    text: "A bright café with blue as its counterpoint: pale wood, white walls and a deep blue counter that curves through the room. Followed from the first sketch through the floor plan to the final images.",
    shape: "", photos: ["images/cafe/scene-01.jpg", "images/cafe/scene-02.jpg", "images/cafe/floor-plan.jpg"], ratios: [1.0, 1.0, 1.4935]
  },
  {
    slug: "bathing-house", title: "Bathing House", category: "Personal work", year: 2026,
    location: "", services: ["Concept", "Exterior & interior views"],
    text: "A bathing house set into nature, built from a single monolithic material. Warm springs, a sauna and a steam bath — rooms for slowing down, lit only through narrow openings to the landscape.",
    shape: "", photos: ["images/bathing-house/scene-01.jpg", "images/bathing-house/scene-02.jpg", "images/bathing-house/scene-03.jpg"], ratios: [1.0, 1.0, 1.0]
  },
  {
    slug: "office", title: "Office", category: "Personal work", year: 2025,
    location: "", services: ["Interior view"],
    text: "A warm office for a single person, shaped by stacks of books, warm materials and the afternoon light falling across the desk.",
    shape: "", photos: ["images/office/scene-01.jpg"], ratios: [0.8289]
  },
  {
    slug: "sailing-house", title: "Sailing House", category: "Personal work", year: 2026,
    location: "", services: ["Exterior view"],
    text: "A long, dark timber house on the edge of a quiet lake, where the boats are kept and set out from. Mist, wind-swept grass and a low sky let the building almost dissolve into the landscape.",
    shape: "", photos: ["images/sailing-house/scene-01.jpg"], ratios: [0.7072]
  },
  {
    slug: "corner-cafe", title: "Corner Café", category: "Personal work", year: 2026,
    location: "", services: ["Exterior view, day & evening"],
    text: "A small café on a street corner in the city centre, seen twice: in the bustle of an autumn afternoon, and again in the evening, once the street has gone quiet.",
    shape: "", photos: ["images/corner-cafe/scene-01.jpg"], ratios: [1.7778],
    evening: ["images/corner-cafe/scene-01-evening.jpg"]
  },
  {
    slug: "kitchen", title: "Kitchen", category: "Personal work", year: 2025,
    location: "", services: ["Interior view"],
    text: "A kitchen of dark wood and veined stone, opening onto a mountain landscape. Warm light falls through the large window and softens the heavy materials.",
    shape: "", photos: ["images/kitchen/scene-01.jpg"], ratios: [1.0]
  }
];

// Placeholder "image": a dusk/night gradient; `variant` shifts the glow so images of one project differ
window.paintPlaceholder = ([sky, haze, ground], variant) =>
  `radial-gradient(60% 40% at ${30 + (variant * 17) % 50}% 62%, ${haze}cc, transparent 70%),
   linear-gradient(to bottom, transparent ${60 + (variant * 7) % 12}%, ${ground} ${60 + (variant * 7) % 12}%),
   linear-gradient(to bottom, ${sky}, ${haze})`;

// Lighter copy of the first photo for the gallery and index (same name + "-preview", max. 1200 px)
window.previewSrc = project => project.photos[0].replace(/\.jpg$/, "-preview.jpg");

// Background for small previews (index hover, "next project"): the first photo, or the placeholder gradient
window.previewBackground = (project, variant) => project.photos
  ? `center / cover no-repeat url("${previewSrc(project)}")`
  : paintPlaceholder(project.colors, variant);

// "Category, Year" without gaps when one of them is still empty
window.projectMeta = project => [project.category, project.year].filter(Boolean).join(", ");

// <img> markup for a photo (kept in one place so the format can be changed later)
window.picture = (src, attrs) => `<img src="${src}" ${attrs}>`;

// Images with class "fade" fade in once loaded (ones already in the browser's cache simply appear)
window.fadeIn = root => root.querySelectorAll("img.fade").forEach(img => {
  const done = () => img.classList.add("loaded");
  if (img.complete && img.naturalWidth) done();
  else { img.addEventListener("load", done, { once: true }); img.addEventListener("error", done, { once: true }); }
});
