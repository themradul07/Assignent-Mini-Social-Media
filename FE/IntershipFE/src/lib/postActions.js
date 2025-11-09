import { uploadToServer } from "./uploadImage";

export default async function savePost({content, imageFile}) {
     if (!content && !imageFile) {
      alert("Please add text or an image!");
      return;
    }

    setLoading(true);
    let imageUrl = "";

    try {
      if (imageFile) {
        const res = await uploadToServer(imageFile);
        if (res.url) imageUrl = res.url;
        else throw new Error(res.msg || "Image upload failed");
      }

      // Call parent handler
      await onPost({ content, image: imageUrl });

      // Reset form
      setContent("");
      setPreview(null);
      setImageFile(null);
    } catch (err) {
      alert(err.message || "Error creating post");
    } finally {
      setLoading(false);
    }
    
}