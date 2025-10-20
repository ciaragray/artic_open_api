// --- 1) Simple helpers --- //
const API = "https://api.artic.edu/api/v1/artworks";
const FIELDS = "id,title,image_id,artist_title,date_display";
const gallery = document.getElementById("gallery");
const loadBtn = document.getElementById("loadBtn");

// Build an image URL from ARTIC's IIIF service
function iiif(image_id, width = 600) {
  return `https://www.artic.edu/iiif/2/${image_id}/full/${width},/0/default.jpg`;
}

// Render a list of artworks as cards
function renderArtworks(items) {
  gallery.innerHTML = ""; // clear previous

  if (!Array.isArray(items) || items.length === 0) {
    gallery.innerHTML = "<p>No artworks found.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";

    if (item.image_id) {
      const img = document.createElement("img");
      img.src = iiif(item.image_id, 600);
      img.alt = item.title || "Artwork";
      card.appendChild(img);
    }

    // Data point #1: title
    const h3 = document.createElement("h3");
    h3.textContent = item.title || "Untitled";
    card.appendChild(h3);

    // Data point #2: artist (plus date for flavor)
    const p = document.createElement("p");
    const artist = item.artist_title || "Unknown artist";
    const date = item.date_display || "";
    p.textContent = date ? `${artist} — ${date}` : artist;
    card.appendChild(p);

    // Link to the museum page
    const small = document.createElement("div");
    small.className = "small";
    small.innerHTML = `View on AIC: <a target="_blank" rel="noopener" href="https://www.artic.edu/artworks/${item.id}">artic.edu/artworks/${item.id}</a>`;
    card.appendChild(small);

    gallery.appendChild(card);
  });
}

// --- 2) Fetch function --- //
async function loadArt() {
  gallery.innerHTML = "<p>Loading…</p>";
  try {
    // grab 12 interesting items
    const url = `${API}?fields=${FIELDS}&page=1&limit=12&sort=-score`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    renderArtworks(json.data);
  } catch (err) {
    console.error(err);
    gallery.innerHTML = "<p>Could not load artworks right now.</p>";
  }
}

// --- 3) Hook up events --- //
loadBtn.addEventListener("click", loadArt);
document.addEventListener("DOMContentLoaded", loadArt); // auto-load on page open
