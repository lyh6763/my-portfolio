# SNS 앱 데이터베이스 설계

> **기술 스택**: Supabase (PostgreSQL)
> **프로젝트 유형**: 프로토타입 (인증/보안 기능 미사용)

---

## 테이블 구조

### 1. users (사용자)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 사용자 고유 ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 아이디 (로그인용) |
| password | VARCHAR(255) | NOT NULL | 비밀번호 |
| display_name | VARCHAR(100) | NOT NULL | 표시 이름 |
| profile_image | TEXT | NULL | 프로필 이미지 URL |
| bio | VARCHAR(300) | NULL | 자기소개 |
| link | TEXT | NULL | 프로필 링크 |
| is_private | BOOLEAN | DEFAULT false | 비공개 계정 여부 |
| is_active | BOOLEAN | DEFAULT true | 활동 상태 표시 |
| show_read_status | BOOLEAN | DEFAULT true | 읽음 표시 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 가입일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

---

### 2. posts (게시물)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 게시물 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 작성자 ID |
| caption | VARCHAR(500) | NULL | 게시물 내용 |
| location | VARCHAR(100) | NULL | 위치/장소 |
| created_at | TIMESTAMP | DEFAULT NOW() | 작성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

---

### 3. post_images (게시물 이미지)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 이미지 고유 ID |
| post_id | UUID | FK → posts.id, NOT NULL | 게시물 ID |
| image_url | TEXT | NOT NULL | 이미지 URL |
| order_index | INTEGER | NOT NULL | 이미지 순서 (0부터 시작) |
| created_at | TIMESTAMP | DEFAULT NOW() | 등록일 |

---

### 4. hashtags (해시태그)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 해시태그 고유 ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | 해시태그 이름 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

---

### 5. post_hashtags (게시물-해시태그 연결)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| post_id | UUID | FK → posts.id, NOT NULL | 게시물 ID |
| hashtag_id | UUID | FK → hashtags.id, NOT NULL | 해시태그 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 등록일 |

> UNIQUE(post_id, hashtag_id)

---

### 6. comments (댓글)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 댓글 고유 ID |
| post_id | UUID | FK → posts.id, NOT NULL | 게시물 ID |
| user_id | UUID | FK → users.id, NOT NULL | 작성자 ID |
| parent_id | UUID | FK → comments.id, NULL | 부모 댓글 ID (답글인 경우) |
| content | VARCHAR(500) | NOT NULL | 댓글 내용 |
| created_at | TIMESTAMP | DEFAULT NOW() | 작성일 |

---

### 7. likes (좋아요)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| post_id | UUID | FK → posts.id, NULL | 게시물 ID |
| comment_id | UUID | FK → comments.id, NULL | 댓글 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 등록일 |

> CHECK(post_id IS NOT NULL OR comment_id IS NOT NULL)
> UNIQUE(user_id, post_id) / UNIQUE(user_id, comment_id)

---

### 8. follows (팔로우)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| follower_id | UUID | FK → users.id, NOT NULL | 팔로우 하는 사용자 |
| following_id | UUID | FK → users.id, NOT NULL | 팔로우 받는 사용자 |
| created_at | TIMESTAMP | DEFAULT NOW() | 팔로우 일시 |

> UNIQUE(follower_id, following_id)
> CHECK(follower_id != following_id)

---

### 9. saved_posts (저장된 게시물)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 사용자 ID |
| post_id | UUID | FK → posts.id, NOT NULL | 게시물 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 저장일 |

> UNIQUE(user_id, post_id)

---

### 10. blocks (차단)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| blocker_id | UUID | FK → users.id, NOT NULL | 차단한 사용자 |
| blocked_id | UUID | FK → users.id, NOT NULL | 차단된 사용자 |
| created_at | TIMESTAMP | DEFAULT NOW() | 차단일 |

> UNIQUE(blocker_id, blocked_id)

---

### 11. conversations (대화방)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 대화방 고유 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 최근 메시지 시간 |

---

### 12. conversation_participants (대화 참여자)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| conversation_id | UUID | FK → conversations.id, NOT NULL | 대화방 ID |
| user_id | UUID | FK → users.id, NOT NULL | 참여자 ID |
| is_pinned | BOOLEAN | DEFAULT false | 고정 여부 |
| is_muted | BOOLEAN | DEFAULT false | 뮤트 여부 |
| last_read_at | TIMESTAMP | NULL | 마지막 읽은 시간 |
| created_at | TIMESTAMP | DEFAULT NOW() | 참여일 |

> UNIQUE(conversation_id, user_id)

---

### 13. messages (메시지)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 메시지 고유 ID |
| conversation_id | UUID | FK → conversations.id, NOT NULL | 대화방 ID |
| sender_id | UUID | FK → users.id, NOT NULL | 발신자 ID |
| content | TEXT | NULL | 메시지 내용 |
| image_url | TEXT | NULL | 이미지 URL |
| created_at | TIMESTAMP | DEFAULT NOW() | 전송 시간 |

---

### 14. notifications (알림)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 알림 고유 ID |
| user_id | UUID | FK → users.id, NOT NULL | 알림 받는 사용자 |
| actor_id | UUID | FK → users.id, NOT NULL | 알림 발생시킨 사용자 |
| type | VARCHAR(20) | NOT NULL | 알림 타입 |
| post_id | UUID | FK → posts.id, NULL | 관련 게시물 |
| comment_id | UUID | FK → comments.id, NULL | 관련 댓글 |
| is_read | BOOLEAN | DEFAULT false | 읽음 여부 |
| created_at | TIMESTAMP | DEFAULT NOW() | 알림 시간 |

> type: 'like', 'comment', 'follow', 'reply'

---

### 15. notification_settings (알림 설정)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | UUID | PK, DEFAULT uuid_generate_v4() | 고유 ID |
| user_id | UUID | FK → users.id, UNIQUE, NOT NULL | 사용자 ID |
| push_enabled | BOOLEAN | DEFAULT true | 푸시 알림 |
| like_enabled | BOOLEAN | DEFAULT true | 좋아요 알림 |
| comment_enabled | BOOLEAN | DEFAULT true | 댓글 알림 |
| follow_enabled | BOOLEAN | DEFAULT true | 팔로우 알림 |
| message_enabled | BOOLEAN | DEFAULT true | 메시지 알림 |

---

## ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   users                                      │
│  (id, username, password, display_name, profile_image, bio, ...)            │
└─────────────────────────────────────────────────────────────────────────────┘
       │              │              │              │              │
       │1:N           │1:N           │1:N           │1:N           │1:N
       ▼              ▼              ▼              ▼              ▼
   ┌───────┐    ┌──────────┐   ┌─────────┐   ┌──────────┐   ┌───────────┐
   │ posts │    │ comments │   │ follows │   │  blocks  │   │ messages  │
   └───────┘    └──────────┘   └─────────┘   └──────────┘   └───────────┘
       │              │                                            │
       │1:N           │1:N                                         │N:1
       ▼              ▼                                            ▼
┌─────────────┐  ┌─────────┐                              ┌───────────────┐
│ post_images │  │  likes  │                              │ conversations │
└─────────────┘  └─────────┘                              └───────────────┘
       │                                                          │
       │                                                          │1:N
       ▼                                                          ▼
┌───────────────┐                                    ┌─────────────────────────┐
│ post_hashtags │ ◄──── N:1 ────► hashtags           │ conversation_participants│
└───────────────┘                                    └─────────────────────────┘
```

---

## 테이블 관계 요약

| 관계 | 설명 |
|------|------|
| users ↔ posts | 1:N (한 유저가 여러 게시물 작성) |
| posts ↔ post_images | 1:N (한 게시물에 최대 9개 이미지) |
| posts ↔ comments | 1:N (한 게시물에 여러 댓글) |
| comments ↔ comments | 1:N (댓글-답글 관계, parent_id) |
| users ↔ follows | N:M (팔로우 관계) |
| users ↔ blocks | N:M (차단 관계) |
| users ↔ likes | 1:N (유저가 여러 좋아요) |
| posts/comments ↔ likes | 1:N (게시물/댓글에 여러 좋아요) |
| users ↔ saved_posts | N:M (저장한 게시물) |
| posts ↔ hashtags | N:M (post_hashtags 중간 테이블) |
| users ↔ conversations | N:M (conversation_participants) |
| conversations ↔ messages | 1:N (대화방의 메시지들) |
| users ↔ notifications | 1:N (유저의 알림들) |

---

## 인덱스 권장사항

```sql
-- 자주 조회되는 컬럼에 인덱스 생성
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_hashtags_name ON hashtags(name);
```

---

## 총 테이블 수: 15개

1. users
2. posts
3. post_images
4. hashtags
5. post_hashtags
6. comments
7. likes
8. follows
9. saved_posts
10. blocks
11. conversations
12. conversation_participants
13. messages
14. notifications
15. notification_settings
