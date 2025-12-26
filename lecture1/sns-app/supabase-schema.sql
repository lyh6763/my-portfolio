-- SNS App 데이터베이스 스키마
-- Supabase Dashboard → SQL Editor에서 실행하세요

-- 1. users 테이블 (사용자)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  profile_image TEXT DEFAULT 'https://picsum.photos/seed/default/200',
  bio VARCHAR(300) DEFAULT '',
  link TEXT DEFAULT '',
  is_private BOOLEAN DEFAULT FALSE,
  is_online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. posts 테이블 (게시물)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  caption VARCHAR(500) DEFAULT '',
  location VARCHAR(100) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. post_images 테이블 (게시물 이미지)
CREATE TABLE IF NOT EXISTS post_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  order_index INTEGER DEFAULT 0
);

-- 4. hashtags 테이블 (해시태그)
CREATE TABLE IF NOT EXISTS hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  posts_count INTEGER DEFAULT 0
);

-- 5. post_hashtags 테이블 (게시물-해시태그 연결)
CREATE TABLE IF NOT EXISTS post_hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  hashtag_id UUID REFERENCES hashtags(id) ON DELETE CASCADE,
  UNIQUE(post_id, hashtag_id)
);

-- 6. comments 테이블 (댓글)
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  content VARCHAR(500) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. likes 테이블 (좋아요)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- 8. follows 테이블 (팔로우)
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- 9. saved_posts 테이블 (저장된 게시물)
CREATE TABLE IF NOT EXISTS saved_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- 10. blocks 테이블 (차단)
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(blocker_id, blocked_id)
);

-- 11. conversations 테이블 (대화방)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. conversation_participants 테이블 (대화 참여자)
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  is_muted BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  UNIQUE(conversation_id, user_id)
);

-- 13. messages 테이블 (메시지)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT,
  image_url TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. notifications 테이블 (알림)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'reply', 'message')),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. notification_settings 테이블 (알림 설정)
CREATE TABLE IF NOT EXISTS notification_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  push_enabled BOOLEAN DEFAULT TRUE,
  like_enabled BOOLEAN DEFAULT TRUE,
  comment_enabled BOOLEAN DEFAULT TRUE,
  follow_enabled BOOLEAN DEFAULT TRUE,
  message_enabled BOOLEAN DEFAULT TRUE
);

-- 16. health_check 테이블 (Netlify 스케줄 함수용)
CREATE TABLE IF NOT EXISTS health_check (
  id SERIAL PRIMARY KEY,
  last_ping TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO health_check (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS (Row Level Security) 활성화
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_check ENABLE ROW LEVEL SECURITY;

-- 기본 RLS 정책 (모든 사용자 읽기 허용 - 프로토타입용)
CREATE POLICY "Allow public read" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);

CREATE POLICY "Allow public read" ON posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON posts FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON post_images FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON post_images FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON comments FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON likes FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON likes FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON follows FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON follows FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON follows FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON saved_posts FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON saved_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON saved_posts FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read" ON notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON notifications FOR UPDATE USING (true);

CREATE POLICY "Allow anonymous read" ON health_check FOR SELECT USING (true);

-- 샘플 데이터 삽입
INSERT INTO users (id, username, password, display_name, profile_image, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'demo', '1234', '데모 사용자', 'https://picsum.photos/seed/demo/200', '안녕하세요! 데모 계정입니다.'),
  ('22222222-2222-2222-2222-222222222222', 'chulsoo', '1234', '김철수', 'https://picsum.photos/seed/user1/200', '여행을 좋아하는 철수입니다.'),
  ('33333333-3333-3333-3333-333333333333', 'younghee', '1234', '이영희', 'https://picsum.photos/seed/user2/200', '맛집 탐방중!');

-- 샘플 게시물
INSERT INTO posts (id, user_id, caption, location) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', '오늘 날씨가 정말 좋네요! 산책하기 딱 좋은 날씨입니다.', '서울 강남구'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', '맛있는 점심 먹었어요!', '서울 홍대');

-- 샘플 게시물 이미지
INSERT INTO post_images (post_id, image_url, order_index) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://picsum.photos/seed/post1/600', 0),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://picsum.photos/seed/post2/600', 0);

-- 샘플 팔로우 관계
INSERT INTO follows (follower_id, following_id) VALUES
  ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'),
  ('11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333');
