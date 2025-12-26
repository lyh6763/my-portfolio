import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import ForgotPasswordPage from './pages/forgot-password-page';
import HomePage from './pages/home-page';
import NotificationsPage from './pages/notifications-page';
import MessagesPage from './pages/messages-page';
import ChatPage from './pages/chat-page';
import SearchPage from './pages/search-page';
import UploadPage from './pages/upload-page';
import PostDetailPage from './pages/post-detail-page';
import ProfilePage from './pages/profile-page';
import ProfileEditPage from './pages/profile-edit-page';
import FollowersPage from './pages/followers-page';
import SettingsPage from './pages/settings-page';

/**
 * App 컴포넌트
 *
 * 앱의 메인 라우팅 설정
 */
function App() {
  return (
    <Routes>
      {/* 인증 관련 페이지 */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* 메인 페이지 */}
      <Route path="/home" element={<HomePage />} />

      {/* 알림 */}
      <Route path="/notifications" element={<NotificationsPage />} />

      {/* 메시지 */}
      <Route path="/messages" element={<MessagesPage />} />
      <Route path="/messages/:id" element={<ChatPage />} />

      {/* 검색 */}
      <Route path="/search" element={<SearchPage />} />

      {/* 게시물 */}
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/post/:id" element={<PostDetailPage />} />

      {/* 프로필 */}
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/profile/:id" element={<ProfilePage />} />
      <Route path="/profile/edit" element={<ProfileEditPage />} />

      {/* 팔로워/팔로잉 */}
      <Route path="/followers" element={<FollowersPage />} />
      <Route path="/following" element={<FollowersPage />} />

      {/* 설정 */}
      <Route path="/settings" element={<SettingsPage />} />

      {/* 404 - 기본 리다이렉트 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
