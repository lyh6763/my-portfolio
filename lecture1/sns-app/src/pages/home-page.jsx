import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import TopBar from '../components/common/top-bar';
import BottomNav from '../components/common/bottom-nav';
import FeedCard from '../components/feed/feed-card';
import { supabase } from '../utils/supabase';

/**
 * HomePage 컴포넌트
 *
 * 메인 피드/타임라인 페이지
 * - 상단바 (로고, 알림, 메시지)
 * - 피드 목록 (Supabase에서 실시간 조회)
 * - 하단 네비게이션
 */
function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // 게시물 조회 (이미지, 작성자 정보 포함)
      const { data, error: fetchError } = await supabase
        .from('posts')
        .select(`
          *,
          user:users!posts_user_id_fkey (
            id, username, display_name, profile_image
          ),
          images:post_images (
            id, image_url, order_index
          )
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      // 각 게시물에 대해 좋아요 수와 댓글 수 조회
      const postsWithCounts = await Promise.all(
        (data || []).map(async (post) => {
          const [likesResult, commentsResult] = await Promise.all([
            supabase
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id),
            supabase
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id)
          ]);

          // 이미지 배열 정렬 및 URL 추출
          const sortedImages = (post.images || [])
            .sort((a, b) => a.order_index - b.order_index)
            .map(img => img.image_url);

          return {
            id: post.id,
            user: {
              id: post.user?.id || post.user_id,
              displayName: post.user?.display_name || post.user?.username || '사용자',
              profileImage: post.user?.profile_image || 'https://picsum.photos/seed/default/200',
            },
            images: sortedImages.length > 0 ? sortedImages : ['https://picsum.photos/seed/default-post/600'],
            caption: post.caption || post.content || '',
            likesCount: likesResult.count || 0,
            commentsCount: commentsResult.count || 0,
            location: post.location || '',
            createdAt: post.created_at,
          };
        })
      );

      setPosts(postsWithCounts);
    } catch (err) {
      console.error('게시물 조회 오류:', err);
      setError('게시물을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        pb: '60px',
      }}
    >
      <TopBar hasNotification={true} />

      {/* 피드 목록 */}
      <Box sx={{ pt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : posts.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              아직 게시물이 없습니다.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              첫 번째 게시물을 업로드해보세요!
            </Typography>
          </Box>
        ) : (
          posts.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))
        )}
      </Box>

      <BottomNav />
    </Box>
  );
}

export default HomePage;
