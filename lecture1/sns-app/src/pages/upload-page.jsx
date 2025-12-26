import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TagIcon from '@mui/icons-material/Tag';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useAuth } from '../hooks/use-auth';
import { supabase } from '../utils/supabase';

// 샘플 갤러리 이미지
const sampleGalleryImages = Array.from({ length: 16 }, (_, i) => ({
  id: `img${i + 1}`,
  url: `https://picsum.photos/seed/gallery${i + 1}/300`,
}));

/**
 * UploadPage 컴포넌트
 *
 * 게시물 업로드 페이지
 * - 사진 선택 단계
 * - 게시물 작성 단계
 */
function UploadPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (image) => {
    const isSelected = selectedImages.find((img) => img.id === image.id);

    if (isSelected) {
      setSelectedImages(selectedImages.filter((img) => img.id !== image.id));
    } else if (selectedImages.length < 9) {
      setSelectedImages([...selectedImages, image]);
    }
  };

  const getImageOrder = (imageId) => {
    const index = selectedImages.findIndex((img) => img.id === imageId);
    return index >= 0 ? index + 1 : null;
  };

  const handleNext = () => {
    if (selectedImages.length > 0) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate(-1);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/');
      return;
    }

    try {
      setUploading(true);

      // 1. 게시물 생성
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          caption: caption,
          location: location,
        }])
        .select()
        .single();

      if (postError) throw postError;

      // 2. 이미지 추가
      if (selectedImages.length > 0) {
        const images = selectedImages.map((img, index) => ({
          post_id: post.id,
          image_url: img.url,
          order_index: index,
        }));

        const { error: imagesError } = await supabase
          .from('post_images')
          .insert(images);

        if (imagesError) throw imagesError;
      }

      // 3. 해시태그 처리
      if (hashtags.trim()) {
        const tagNames = hashtags
          .split(/[#\s]+/)
          .filter(tag => tag.trim().length > 0);

        for (const tagName of tagNames) {
          // 해시태그 찾기 또는 생성
          let { data: tag } = await supabase
            .from('hashtags')
            .select('id')
            .eq('name', tagName)
            .single();

          if (!tag) {
            const { data: newTag } = await supabase
              .from('hashtags')
              .insert([{ name: tagName }])
              .select()
              .single();
            tag = newTag;
          }

          if (tag) {
            // 게시물-해시태그 연결
            await supabase.from('post_hashtags').insert([{
              post_id: post.id,
              hashtag_id: tag.id,
            }]);
          }
        }
      }

      alert('게시물이 업로드되었습니다!');
      navigate('/home');
    } catch (err) {
      console.error('업로드 오류:', err);
      alert('업로드 중 오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={handleBack} disabled={uploading}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" sx={{ ml: 1 }}>
            {step === 1 ? '새 게시물' : '게시물 작성'}
          </Typography>
        </Box>
        {step === 1 ? (
          <Button
            onClick={handleNext}
            disabled={selectedImages.length === 0}
            sx={{ fontWeight: 600 }}
          >
            다음
          </Button>
        ) : (
          <Button
            onClick={handleUpload}
            disabled={uploading}
            sx={{ fontWeight: 600 }}
          >
            {uploading ? <CircularProgress size={20} /> : '공유'}
          </Button>
        )}
      </Box>

      {step === 1 ? (
        /* 사진 선택 단계 */
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 선택된 사진 미리보기 */}
          <Box
            sx={{
              width: '100%',
              paddingTop: '100%',
              position: 'relative',
              backgroundColor: 'background.paper',
            }}
          >
            {selectedImages.length > 0 ? (
              <Box
                component="img"
                src={selectedImages[0].url}
                alt="선택된 이미지"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography>사진을 선택하세요</Typography>
              </Box>
            )}
          </Box>

          {/* 선택 정보 */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {selectedImages.length}/9 선택됨
            </Typography>
          </Box>

          {/* 갤러리 그리드 */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <Grid container spacing={0.5}>
              {sampleGalleryImages.map((image) => {
                const order = getImageOrder(image.id);
                const isSelected = order !== null;

                return (
                  <Grid key={image.id} size={{ xs: 3 }}>
                    <Box
                      onClick={() => handleImageSelect(image)}
                      sx={{
                        position: 'relative',
                        paddingTop: '100%',
                        cursor: 'pointer',
                      }}
                    >
                      <Box
                        component="img"
                        src={image.url}
                        alt="갤러리 이미지"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          opacity: isSelected ? 0.7 : 1,
                        }}
                      />
                      {isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 4,
                            right: 4,
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {order}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      ) : (
        /* 게시물 작성 단계 */
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {/* 이미지 미리보기 */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              p: 2,
              overflow: 'auto',
            }}
          >
            {selectedImages.map((image) => (
              <Box
                key={image.id}
                component="img"
                src={image.url}
                alt="선택된 이미지"
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  borderRadius: 1,
                  flexShrink: 0,
                }}
              />
            ))}
          </Box>

          {/* 글 작성 */}
          <Box sx={{ px: 2, pb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="문구 입력... (500자 이내)"
              value={caption}
              onChange={(e) => setCaption(e.target.value.slice(0, 500))}
              disabled={uploading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'transparent',
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', textAlign: 'right', mt: 0.5 }}
            >
              {caption.length}/500
            </Typography>
          </Box>

          {/* 위치 추가 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <LocationOnOutlinedIcon sx={{ color: 'text.secondary' }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="위치 추가"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={uploading}
              InputProps={{ disableUnderline: true }}
            />
          </Box>

          {/* 해시태그 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <TagIcon sx={{ color: 'text.secondary' }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="해시태그 입력 (예: #여행 #맛집)"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              disabled={uploading}
              InputProps={{ disableUnderline: true }}
            />
          </Box>

          {/* 사람 태그 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              px: 2,
              py: 1.5,
              borderTop: '1px solid',
              borderBottom: '1px solid',
              borderColor: 'divider',
              cursor: 'pointer',
              opacity: uploading ? 0.5 : 1,
            }}
          >
            <PersonOutlineIcon sx={{ color: 'text.secondary' }} />
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              사람 태그하기
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default UploadPage;
