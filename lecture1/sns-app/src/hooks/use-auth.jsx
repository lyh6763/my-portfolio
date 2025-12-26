import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

/**
 * AuthProvider 컴포넌트
 *
 * 인증 상태를 관리하는 컨텍스트 프로바이더
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 복원
    const storedUser = localStorage.getItem('sns_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
      }

      setUser(data);
      localStorage.setItem('sns_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  const signup = async (userData) => {
    try {
      // 중복 아이디 확인
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('username', userData.username)
        .single();

      if (existing) {
        return { success: false, error: '이미 존재하는 아이디입니다.' };
      }

      const { data, error } = await supabase
        .from('users')
        .insert([{
          username: userData.username,
          password: userData.password,
          display_name: userData.displayName,
        }])
        .select()
        .single();

      if (error) {
        return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
      }

      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: '회원가입 중 오류가 발생했습니다.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sns_user');
  };

  const updateProfile = async (updates) => {
    if (!user) return { success: false, error: '로그인이 필요합니다.' };

    try {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: '프로필 업데이트 중 오류가 발생했습니다.' };
      }

      setUser(data);
      localStorage.setItem('sns_user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (err) {
      return { success: false, error: '프로필 업데이트 중 오류가 발생했습니다.' };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
