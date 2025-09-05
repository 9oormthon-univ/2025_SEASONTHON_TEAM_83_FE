import React, { createContext, useCallback, useContext, useReducer } from 'react';
import PointService from '../services/pointService';

// 포인트 액션 타입
export const PointAction = {
  SET_LOADING: 'SET_LOADING',
  SET_BALANCE: 'SET_BALANCE',
  SET_HISTORY: 'SET_HISTORY',
  UPDATE_POINTS: 'UPDATE_POINTS',
  SET_ERROR: 'SET_ERROR',
};

// 초기 상태
const initialState = {
  loading: false,
  balance: {
    currentPoints: 0,
    totalEarnedPoints: 0,
    currentLevel: '새싹 전',
    nextLevel: '새싹',
    progressToNextLevel: 0,
  },
  history: [],
  error: null,
};

// 리듀서
const pointReducer = (state, action) => {
  switch (action.type) {
    case PointAction.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null,
      };
    
    case PointAction.SET_BALANCE:
      return {
        ...state,
        balance: action.payload,
        loading: false,
        error: null,
      };
    
    case PointAction.SET_HISTORY:
      return {
        ...state,
        history: action.payload,
        loading: false,
        error: null,
      };
    
    case PointAction.UPDATE_POINTS:
      return {
        ...state,
        balance: {
          ...state.balance,
          currentPoints: state.balance.currentPoints + action.payload,
          totalEarnedPoints: state.balance.totalEarnedPoints + action.payload,
        },
      };
    
    case PointAction.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    
    default:
      return state;
  }
};

// Context 생성
const PointContext = createContext();

// Provider 컴포넌트
export const PointProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pointReducer, initialState);

  // 포인트 잔액 조회
  const fetchBalance = useCallback(async () => {
    try {
      dispatch({ type: PointAction.SET_LOADING, payload: true });
      const response = await PointService.getBalance();
      
      if (response.success) {
        dispatch({ type: PointAction.SET_BALANCE, payload: response.data });
      } else {
        dispatch({ type: PointAction.SET_ERROR, payload: response.error });
      }
    } catch (error) {
      dispatch({ type: PointAction.SET_ERROR, payload: error.message });
    }
  }, []);

  // 포인트 히스토리 조회
  const fetchHistory = useCallback(async () => {
    try {
      dispatch({ type: PointAction.SET_LOADING, payload: true });
      const response = await PointService.getHistory();
      
      if (response.success) {
        dispatch({ type: PointAction.SET_HISTORY, payload: response.data });
      } else {
        dispatch({ type: PointAction.SET_ERROR, payload: response.error });
      }
    } catch (error) {
      dispatch({ type: PointAction.SET_ERROR, payload: error.message });
    }
  }, []);

  // 포인트 업데이트 (로컬 상태 업데이트)
  const updatePoints = (points) => {
    dispatch({ type: PointAction.UPDATE_POINTS, payload: points });
  };

  // 포인트 데이터 새로고침
  const refreshPoints = useCallback(async () => {
    await Promise.all([fetchBalance(), fetchHistory()]);
  }, [fetchBalance, fetchHistory]);

  // 에러 클리어
  const clearError = () => {
    dispatch({ type: PointAction.SET_ERROR, payload: null });
  };

  const value = {
    ...state,
    fetchBalance,
    fetchHistory,
    updatePoints,
    refreshPoints,
    clearError,
  };

  return (
    <PointContext.Provider value={value}>
      {children}
    </PointContext.Provider>
  );
};

// Hook
export const usePoint = () => {
  const context = useContext(PointContext);
  if (!context) {
    throw new Error('usePoint must be used within a PointProvider');
  }
  return context;
};

export default PointContext;
