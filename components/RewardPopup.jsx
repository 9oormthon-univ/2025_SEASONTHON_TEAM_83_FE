import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

const messages = [
  "당신의 한 잔이 지구의 미소를 지켰습니다.",
  "일회용 대신 텀블러,\n작은 선택이 큰 변화를 만듭니다.",
  "당신의 음료, 지구와 함께 나누는\n따뜻한 약속."
];

const RewardPopup = ({ onClose }) => {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = () => {
    onClose(); // 기존 모달 닫기
    // challenge-tumbler로 이동
    router.push('/challenge-tumbler');
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Image 
            style={styles.logo} 
            source={require("../assets/images/icon_pleanet_logo.png")} 
            resizeMode="contain" 
          />
          <Text style={styles.point}>+50p</Text>
          <Text style={styles.message}>{messages[messageIndex]}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(45, 45, 45, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    alignItems: "center",
    padding: 20,
    position: "relative",
  },

  logo: {
    width: 180,
    height: 180,
    zIndex: 2,
    marginBottom: 20,
  },
  point: {
    fontSize: 50,
    fontWeight: "700",
    fontFamily: "Pretendard Variable",
    color: "#a2fff5",
    textAlign: "center",
    textShadowColor: "#fff",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Pretendard Variable",
    width: 280
  },
});

export default RewardPopup;
