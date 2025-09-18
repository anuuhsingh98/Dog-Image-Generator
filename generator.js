const API_KEY = "H3Un3yVgLNY737wpt4o6VA==KA9PyzMc61xnMCIk";
const API_URL = "https://api-ninjas.com/profile";

const btn = document.getElementById("btn");
const imageContainer = document.getElementById("Image");
const imgPlaceholder = document.getElementById("img");

function showMessage(text) {
  imageContainer.innerHTML = `<p id="img" style="text-align:center;padding-top:130px;">${text}</p>`;
}

function showLoading() {
  imageContainer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100%;width:100%;">
      <div style="text-align:center;">
        <div class="spinner" style="margin-bottom:10px;">⏳</div>
        <div>Loading...</div>
      </div>
    </div>
  `;
}

function renderImage(src, alt = "Dog image") {
  const img = document.createElement("img");
  img.src = src;
  img.alt = alt;
  img.style.maxWidth = "300px";
  img.style.maxHeight = "300px";
  img.style.borderRadius = "8px";
  img.onload = () => {
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);
  };
  img.onerror = () => {
    showMessage("Failed to load image. Try again.");
  };
}

async function generateDogImage() {
  showLoading();

  try {
    const resp = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (resp.ok) {
      const data = await resp.json();
      const url =
        data.image_url ||
        data.url ||
        (data.data && data.data.image) ||
        data.src;
      if (url && typeof url === "string") {
        renderImage(url);
        return;
      } else {
        if (data.image_base64) {
          renderImage(`data:image/png;base64,${data.image_base64}`);
          return;
        }
        console.warn("Unrecognized response format from API:", data);
      }
    } else {
      console.warn("Key-protected API returned status:", resp.status);
    }
  } catch (err) {
    console.warn("Error calling key-protected API:", err);
  }
  try {
    const fallback = await fetch("https://dog.ceo/api/breeds/image/random");
    if (fallback.ok) {
      const fdata = await fallback.json();
      if (fdata && fdata.message) {
        renderImage(fdata.message, "Random dog (fallback)");
        return;
      }
    }
  } catch (err) {
    console.warn("Fallback API failed:", err);
  }

  showMessage("Could not generate image.Try again later.");
}

btn.addEventListener("click", () => {
  generateDogImage();
});
