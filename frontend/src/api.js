const API_URL = "http://localhost:3000/api/stories"; // backend URL

export async function generateStory(idea, settings) {
  const res = await fetch(`${API_URL}/generate-text`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idea, settings }),
  });
  if (!res.ok) {
    throw new Error(`Error: ${res.statusText}`);
  }
  return res.json();
}

export async function generateImage(imagePrompt, sceneId) {
  const res = await fetch(`${API_URL}/generate-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ imagePrompt, sceneId }),
  });
  if (!res.ok) {
    throw new Error(`Error: ${res.statusText}`);
  }
  return res.json();
}
