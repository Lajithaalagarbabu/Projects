import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import TeamManagement from './pages/TeamManagement';
import PhotoManagement from './pages/PhotoManagement';
import GalleryManagement from './pages/GalleryManagement';
import TeamDashboard from './pages/TeamDashboard';
import UploadPhotos from './pages/UploadPhotos';
import MyPhotos from './pages/MyPhotos';
import PublicGallery from './pages/PublicGallery';
import NotFound from './pages/NotFound';

import './styles/global.css';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Public Customer Gallery Route (No Login Required) */}
          <Route path="/gallery/:galleryCode" element={<PublicGallery />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/new"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <CreateEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/:eventId"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/:eventId/photos"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <PhotoManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/:eventId/team"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <TeamManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/events/:eventId/gallery"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <GalleryManagement />
              </ProtectedRoute>
            }
          />

          {/* Protected Team Member Routes */}
          <Route
            path="/team/dashboard"
            element={
              <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'ADMIN']}>
                <TeamDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/events/:eventId"
            element={
              <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'ADMIN']}>
                <MyPhotos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/events/:eventId/upload"
            element={
              <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'ADMIN']}>
                <UploadPhotos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team/photos"
            element={
              <ProtectedRoute allowedRoles={['TEAM_MEMBER', 'ADMIN']}>
                <MyPhotos />
              </ProtectedRoute>
            }
          />

          {/* Default redirect to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
