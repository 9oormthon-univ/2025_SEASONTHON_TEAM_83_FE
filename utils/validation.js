// utils/validation.js

// 이메일 형식 검증
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 비밀번호 강도 검증
export const validatePassword = (password) => {
  const minLength = 8;
  const maxLength = 20;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (password.length < minLength) {
    return { valid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }

  if (password.length > maxLength) {
    return { valid: false, message: '비밀번호는 최대 20자까지 가능합니다.' };
  }

  if (!hasLetter || !hasNumber) {
    return { valid: false, message: '비밀번호는 영문과 숫자를 포함해야 합니다.' };
  }

  return { valid: true, message: '유효한 비밀번호입니다.' };
};

// 비밀번호 강도 측정
export const getPasswordStrength = (password) => {
  let score = 0;
  
  // 길이 체크
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // 문자 종류 체크
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  if (score <= 2) return { strength: 'Weak', color: '#ff4444' };
  if (score <= 4) return { strength: 'Medium', color: '#ffaa00' };
  return { strength: 'Strong', color: '#00aa44' };
};

// 닉네임 검증
export const validateNickname = (nickname) => {
  const minLength = 2;
  const maxLength = 12;
  const koreanRegex = /^[가-힣a-zA-Z0-9]+$/;

  if (nickname.length < minLength) {
    return { valid: false, message: '닉네임은 최소 2자 이상이어야 합니다.' };
  }

  if (nickname.length > maxLength) {
    return { valid: false, message: '닉네임은 최대 12자까지 가능합니다.' };
  }

  if (!koreanRegex.test(nickname)) {
    return { valid: false, message: '닉네임은 한글, 영문, 숫자만 사용 가능합니다.' };
  }

  return { valid: true, message: '유효한 닉네임입니다.' };
};

// 생년월일 검증
export const validateBirthday = (birthday) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(birthday)) {
    return { valid: false, message: '올바른 날짜 형식이 아닙니다. (YYYY-MM-DD)' };
  }

  const date = new Date(birthday);
  const now = new Date();
  const age = now.getFullYear() - date.getFullYear();

  if (age < 0 || age > 120) {
    return { valid: false, message: '올바른 생년월일을 입력해주세요.' };
  }

  return { valid: true, message: '유효한 생년월일입니다.' };
};

// 비밀번호 재입력 확인
export const validatePasswordConfirm = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return { valid: false, message: '비밀번호가 일치하지 않습니다.' };
  }

  return { valid: true, message: '비밀번호가 일치합니다.' };
};

// 전체 폼 검증
export const validateSignupForm = (formData) => {
  const errors = {};

  // 이메일 검증
  if (!validateEmail(formData.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }

  // 비밀번호 검증
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) {
    errors.password = passwordValidation.message;
  }

  // 비밀번호 확인 검증
  const confirmValidation = validatePasswordConfirm(formData.password, formData.confirmPassword);
  if (!confirmValidation.valid) {
    errors.confirmPassword = confirmValidation.message;
  }

  // 닉네임 검증
  const nicknameValidation = validateNickname(formData.nickname);
  if (!nicknameValidation.valid) {
    errors.nickname = nicknameValidation.message;
  }

  // 생년월일 검증
  const birthdayValidation = validateBirthday(formData.birthday);
  if (!birthdayValidation.valid) {
    errors.birthday = birthdayValidation.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 로그인 폼 검증
export const validateLoginForm = (formData) => {
  const errors = {};

  // 이메일 검증
  if (!validateEmail(formData.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.';
  }

  // 비밀번호 검증
  if (!formData.password || formData.password.length < 8) {
    errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
