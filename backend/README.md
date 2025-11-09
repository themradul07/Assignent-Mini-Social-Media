Backend for 3W Mini Social
==========================
- Node.js + Express + MongoDB
- Cloudinary image upload via /api/upload/image (multipart/form-data, field name: image)

Environment variables: copy .env.example -> .env and fill:
- MONGO_URI
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET

Run:
npm install
npm run dev
