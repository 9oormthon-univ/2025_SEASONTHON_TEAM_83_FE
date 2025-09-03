// contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { TokenManager } from '../services/api';
import AuthService from '../services/authService';
import KakaoService from '../services/kakaoService';

// 인증 상태 타입
const AuthState = {
  LOADING: 'LOADING',
  AUTHENTICATED: 'AUTHENTICATED',
  UNAUTHENTICATED: 'UNAUTHENTICATED',
};

// 액션 타입
const AuthAction = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
};

// 초기 상태
const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
};

// 리듀서
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthAction.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case AuthAction.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
      };
    
    case AuthAction.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
      };
    
    case AuthAction.SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    
    default:
      return state;
  }
};

// Context 생성
const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 로그인 상태 확인
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AuthAction.SET_LOADING, payload: true });
      
      const token = await TokenManager.getToken();
      
      if (token) {
        // 토큰이 있으면 사용자 정보 조회
        const profileResponse = await AuthService.getProfile();
        
        if (profileResponse.success) {
          dispatch({
            type: AuthAction.LOGIN_SUCCESS,
            payload: {
              user: profileResponse.data,
              token: token,
            },
          });
        } else {
          // 토큰이 유효하지 않으면 로그아웃
          await TokenManager.removeToken();
          dispatch({ type: AuthAction.LOGOUT });
        }
      } else {
        dispatch({ type: AuthAction.LOGOUT });
      }
    } catch (error) {
      console.error('인증 상태 확인 실패:', error);
      dispatch({ type: AuthAction.LOGOUT });
    }
  };

  // 로그인
  const login = async (credentials) => {
    try {
      dispatch({ type: AuthAction.SET_LOADING, payload: true });
      
      const response = await AuthService.login(credentials);
      
      if (response.success) {
        dispatch({
          type: AuthAction.LOGIN_SUCCESS,
          payload: {
            user: response.data,
            token: response.data.accessToken,
          },
        });
        return { success: true, data: response.data };
      } else {
        dispatch({ type: AuthAction.LOGOUT });
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: AuthAction.LOGOUT });
      return { success: false, error: error.message };
    }
  };

  // 회원가입
  const signup = async (userData) => {
    try {
      const response = await AuthService.signup(userData);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await AuthService.logout();
      dispatch({ type: AuthAction.LOGOUT });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 이메일 중복 체크
  const checkEmailDuplicate = async (email) => {
    try {
      const response = await AuthService.checkEmailDuplicate(email);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 카카오 로그인
  const loginWithKakao = async () => {
    try {
      dispatch({ type: AuthAction.SET_LOADING, payload: true });
      
      const result = await KakaoService.loginWithKakao();
      
      if (result.success) {
        // 토큰 저장
        await TokenManager.setToken(result.data.accessToken);
        
        // 로그인 상태 업데이트
        dispatch({
          type: AuthAction.LOGIN_SUCCESS,
          payload: {
            user: result.data,
            token: result.data.accessToken,
          },
        });
        
        return {
          success: true,
          data: result.data,
          needsAdditionalInfo: result.needsAdditionalInfo
        };
      } else {
        dispatch({ type: AuthAction.SET_LOADING, payload: false });
        return {
          success: false,
          error: result.error
        };
      }
    } catch (error) {
      dispatch({ type: AuthAction.SET_LOADING, payload: false });
      return {
        success: false,
        error: error.message
      };
    }
  };

  // 카카오 추가 정보 업데이트
  const updateKakaoAdditionalInfo = async (additionalInfo) => {
    try {
      const response = await KakaoService.updateAdditionalInfo(
        state.token,
        additionalInfo
      );
      
      if (response.success) {
        // 사용자 정보 업데이트
        dispatch({
          type: AuthAction.UPDATE_USER,
          payload: response.data,
        });
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 관심활동 설정
  const setInterests = async (interests) => {
    try {
      const response = await AuthService.setInterests(interests);
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // 카카오 로그인
  const kakaoLogin = async (code) => {
    try {
      dispatch({ type: AuthAction.SET_LOADING, payload: true });
      
      const response = await AuthService.kakaoLogin(code);
      
      if (response.success) {
        dispatch({
          type: AuthAction.LOGIN_SUCCESS,
          payload: {
            user: response.data,
            token: response.data.accessToken,
          },
        });
        return { success: true, data: response.data };
      } else {
        dispatch({ type: AuthAction.LOGOUT });
        return { success: false, error: response.error };
      }
    } catch (error) {
      dispatch({ type: AuthAction.LOGOUT });
      return { success: false, error: error.message };
    }
  };

  // 프로필 업데이트
  const updateProfile = async (profileData) => {
    try {
      const response = await AuthService.updateProfile(profileData);
      
      if (response.success) {
        dispatch({
          type: AuthAction.SET_USER,
          payload: response.data,
        });
      }
      
      return response;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    ...state,
    login,
    signup,
    logout,
    checkEmailDuplicate,
    kakaoLogin,
    loginWithKakao,
    updateKakaoAdditionalInfo,
    updateProfile,
    setInterests,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
