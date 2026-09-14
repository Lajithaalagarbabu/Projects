# 📸 Full-Stack Photo Sharing Platform (LuminaShare)

A complete, production-ready full-stack photo-sharing application built for event and photography teams. It allows lead admins to create events, assign photographers, review and select high-res photos, set PIN protection, and generate shareable client galleries for customers.

---

## 🏗️ Architecture Overview

```text
                    ┌───────────────┐
                    │    React UI   │
                    └───────┬───────┘
                            │
                         REST API (JWT)
                            │
                    ┌───────▼───────┐
                    │ Spring Boot   │
                    │   Backend     │
                    └───────┬───────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
       ┌──────▼──────┐             ┌──────▼──────┐
       │ PostgreSQL  │             │  Cloudinary │
       │  Metadata   │             │    Photos   │
       └─────────────┘             └─────────────┘
```

---

## ✨ Features

- **Multi-Role Authentication**: JWT-based authentication for Admins and Team Members.
- **Event Lifecycle Management**: Create events, manage dates, and assign event photographers.
- **Multi-Image Upload**: Photographers can upload multiple high-resolution photos directly to Cloudinary.
- **Photo Curation & Selection**: Admins review team uploads and toggle selection for client publishing.
- **PIN-Protected Customer Galleries**: Secure galleries with BCrypt-hashed PINs and unique gallery URLs.
- **No-Account Customer Experience**: Customers view published galleries using link + PIN without registering.
- **Responsive Aesthetics**: Modern dark glassmorphism design optimized for desktop, tablet, and mobile.

---

## 👥 User Roles & Permissions

| Feature / Action | Admin | Team Member | Customer |
| :--- | :---: | :---: | :---: |
| Register & Login | ✅ | ✅ | ❌ |
| Create & Delete Events | ✅ | ❌ | ❌ |
| Assign Photographers | ✅ | ❌ | ❌ |
| Upload Event Photos | ✅ | ✅ (Assigned only) | ❌ |
| Review & Select Photos | ✅ | ❌ | ❌ |
| Create Gallery & Set PIN | ✅ | ❌ | ❌ |
| Publish Client Gallery | ✅ | ❌ | ❌ |
| View Published Photos | ✅ | ✅ | ✅ (With PIN) |

---

## 🛠️ Technology Stack

### Backend
- **Framework**: Java 17, Spring Boot 3.2.3, Spring Web
- **Data & Security**: Spring Data JPA, Spring Security, JWT (JJWT 0.11.5), Bean Validation
- **Database**: PostgreSQL (with embedded H2 test fallback)
- **Object Storage**: Cloudinary Java SDK (`com.cloudinary:cloudinary-http44`)
- **Testing**: JUnit 5, Mockito, Spring Boot Test, MockMvc

### Frontend
- **Framework**: React 18, Vite 5, JavaScript (ES6+)
- **Routing & HTTP**: React Router DOM v6, Axios
- **Styling & UI**: Custom Responsive CSS Design System with Glassmorphism, Lucide Icons

---

## 🗄️ Database Schema

```text
User (id, name, email, password, role, createdAt)
Event (id, name, description, eventDate, createdBy, createdAt)
EventMember (id, eventId, userId)
Photo (id, eventId, uploadedBy, filename, storageUrl, storagePublicId, fileSize, selected, createdAt)
Gallery (id, eventId, galleryCode, pinHash, published, publishedAt, createdAt)
GalleryPhoto (id, galleryId, photoId)
```

---

## 🔑 Demo Credentials

> [!IMPORTANT]
> The platform automatically seeds demo accounts upon initialization:

- **Admin Account**:
  - **Email**: `admin@demo.com`
  - **Password**: `Admin@123`

- **Team Member Account**:
  - **Email**: `member@demo.com`
  - **Password**: `Member@123`

- **Sample Event**: `Arjun & Priya Wedding`

---

## 🚀 Local Setup & Running

### Prerequisites
- JDK 17+
- Node.js 18+ & npm
- PostgreSQL database (or automatic H2 fallback mode)

### 1. Backend Setup

```bash
cd backend
mvn clean spring-boot:run
```
The backend server runs on `http://localhost:8080`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The frontend dev server runs on `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in root or configure system variables:

```env
DATABASE_URL=jdbc:postgresql://localhost:5432/photoshare_db
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## 🧪 Testing

Execute backend test suite:

```bash
cd backend
mvn test
```

All authentication, role authorization, photo selection, and PIN verification unit/integration tests will execute against in-memory H2 database.
