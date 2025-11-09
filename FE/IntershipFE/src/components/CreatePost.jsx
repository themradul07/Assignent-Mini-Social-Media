import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  CardMedia,
  Stack,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import "./styles/CreatePost.css";
import { uploadToServer } from "../lib/uploadImage";
import { postJSON } from "../api";

export default function CreatePost({ token , onPost }) {
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);



  async function handleSubmit(e) {
    e.preventDefault();
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
      console.log(content, imageUrl);
      const res = await postJSON('/posts/', { text: content , imageUrl }, token);
      console.log(" this is the res" , res);
      if(res) onPost(res);
      else throw new Error(res.msg || "Post creation failed");

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="create-post-card" elevation={3}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create a Post
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="What's on your mind?"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="input-field"
          />

          <Stack direction="row" spacing={2} alignItems="center" mb={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<PhotoCameraIcon />}
              className="upload-btn"
            >
              Upload Image
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>

            {preview && (
              <Button color="error" onClick={() => { setPreview(null); setImageFile(null); }}>
                Remove
              </Button>
            )}
          </Stack>

          {preview && (
            <CardMedia
              component="img"
              image={preview}
              alt="Preview"
              className="image-preview"
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? "Posting..." : "Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
