  export async function uploadToServer(file) {
    const form = new FormData();
    form.append("image", file);

    const res = await fetch(
      (import.meta.env.VITE_API_BASE || "http://localhost:5000/api") +
        "/upload/image",
      {
        method: "POST",
        body: form,
      }
    );

    return res.json();
  }