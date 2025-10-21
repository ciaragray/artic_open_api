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
  gallery.innerHTML = "";

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
    const url = `${API}?fields=${LIST_FIELDS}&page=1&limit=12&sort=-score`;
    const res = await fetch(url);
    const json = await res.json();
    renderArtworks(json.data);
  } catch (err) {
    console.error(err);
    gallery.innerHTML = "<p>Could not load artworks right now.</p>";
  }
}
async function loadDetails(id) {
  detailsBox.classList.remove("hidden");
  detailsBox.innerHTML = "<p>Loading details…</p>";
  try {
    const url = `${API}/${id}?fields=${DETAILS_FIELDS}`;
    const res = await fetch(url);
    const json = await res.json();
    const a = json.data;

    detailsBox.innerHTML = `
      <h2>${a.title || "Untitled"}</h2>
      <p><strong>Artist:</strong> ${a.artist_title || "Unknown"}</p>
      <p><strong>Date:</strong> ${a.date_display || "—"}</p>
      <p><strong>Medium:</strong> ${a.medium_display || "—"}</p>
      <p><strong>Dimensions:</strong> ${a.dimensions || "—"}</p>
      <p><strong>Origin:</strong> ${a.place_of_origin || "—"}</p>
      <p class="small"><em>${a.credit_line || ""}</em></p>
    `;
  } catch (err) {
    console.error(err);
    detailsBox.innerHTML = "<p>Could not load details.</p>";
  }
}
function renderArtworks(items) {
  gallery.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) {
    gallery.innerHTML = "<p>No artworks found.</p>";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "card";
    card.tabIndex = 0; // keyboard focus
    card.addEventListener("click", () => loadDetails(item.id));
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter") loadDetails(item.id);
    });

    if (item.image_id) {
      const img = document.createElement("img");
      img.src = `https://www.artic.edu/iiif/2/${item.image_id}/full/600,/0/default.jpg`;
      img.alt = item.title || "Artwork";
      card.appendChild(img);
    }

    const h3 = document.createElement("h3");
    h3.textContent = item.title || "Untitled";
    card.appendChild(h3);

    const p = document.createElement("p");
    p.textContent = `${item.artist_title || "Unknown artist"}${
      item.date_display ? " — " + item.date_display : ""
    }`;
    card.appendChild(p);

    const small = document.createElement("div");
    small.className = "small";
    small.innerHTML = `View on AIC: <a target="_blank" rel="noopener" href="https://www.artic.edu/artworks/${item.id}">artic.edu/artworks/${item.id}</a>`;
    card.appendChild(small);

    gallery.appendChild(card);
  });
}

loadBtn.addEventListener("click", loadArt);
document.addEventListener("DOMContentLoaded", loadArt);

const LIST_FIELDS = "id,title,image_id,artist_title,date_display";
const DETAILS_FIELDS =
  "id,title,artist_title,date_display,medium_display,dimensions,place_of_origin,credit_line";
const detailsBox = document.getElementById("details");
