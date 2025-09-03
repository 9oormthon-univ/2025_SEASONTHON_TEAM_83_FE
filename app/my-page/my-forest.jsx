// app/mypage.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBar from "../../components/CustomTabBar";

// ✅ 이미지 매핑 테이블
const BADGE_IMAGES = {
  tree: require("../../assets/images/tree_badge.png"),
  // earth: require("../assets/images/earth_badge.png"),
};

const STORAGE_KEY = "badge_board_v1";
const TABBAR_H = 72;
const GRID_GAP = 12;
const GRID_PAD_H = 16;
const TARGET_SIZE = 96;
const MODAL_IMG_SIZE = 140;

const QUOTES = [
  "“하나의 나무, 하나의 변화.\n당신이 시작했습니다.”",
  "“당신의 실천이 지구에 초록 숨결을 더합니다.”",
  "“함께 심은 나무, 함께 키워가는 지구.”",
];

export default function MyPage() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // 🔸 아이보리 패널 높이(탭바 + 여유)
  const IVORY_PANEL_H = TABBAR_H + insets.bottom + 120;

  const [badges, setBadges] = useState([
    { id: "tree-1", title: "나무 뱃지", date: "2025.09.02", imageKey: "tree" },
  ]);
  const [selected, setSelected] = useState(null);
  const [quote, setQuote] = useState(QUOTES[0]);

  // 랜덤 문구 갱신
  useFocusEffect(
    useCallback(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }, [])
  );

  // 저장된 배지 불러오기
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        const arr = JSON.parse(saved);
        if (!Array.isArray(arr)) return;
        const normalized = arr.map((b, i) => ({
          id: b.id ?? `badge-${i}`,         // ← 버그 픽스: 템플릿 리터럴
          title: b.title ?? "뱃지",
          date: b.date ?? "",
          imageKey: b.imageKey ?? "tree",
        }));
        setBadges(normalized);
      } catch (e) {
        console.log("Badge load error:", e);
      }
    })();
  }, []);

  // 그리드 열/아이템 크기
  const columns = Math.max(
    2,
    Math.floor((width - GRID_PAD_H * 2 + GRID_GAP) / (TARGET_SIZE + GRID_GAP))
  );
  const itemSize = Math.floor(
    (width - GRID_PAD_H * 2 - GRID_GAP * (columns - 1)) / columns
  );

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => setSelected(item)}
      style={({ pressed }) => [
        styles.badgeBox,
        { width: itemSize, height: itemSize, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <Image
        source={BADGE_IMAGES[item.imageKey] ?? BADGE_IMAGES.tree}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
        {...(Platform.OS === "web"
          ? { draggable: false, onContextMenu: (e) => e.preventDefault() }
          : {})}
      />
    </Pressable>
  );

  return (
    <View style={styles.root}>
      {/* 배경: 위쪽은 forest, 아래는 아이보리로 살짝 가리기 */}
      <Image
        source={require("../../assets/images/forest.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="stretch"
        pointerEvents="none"
      />

      {/* 아이보리 패널(아래쪽을 덮어 스샷처럼 보이게) */}
      <View style={[styles.ivoryPanel, { height: IVORY_PANEL_H }]} />

      {/* 내용은 안전영역 안쪽(top만) */}
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        {/* 뱃지 그리드 */}
        <FlatList
          data={badges}
          keyExtractor={(it) => it.id}
          numColumns={columns}
          contentContainerStyle={{
            paddingHorizontal: GRID_PAD_H,
            paddingTop: 12,
            // 패널 높이만큼 여유 → 리스트가 패널/탭바와 겹치지 않음
            paddingBottom: IVORY_PANEL_H,
          }}
          columnWrapperStyle={{ justifyContent: "flex-start", gap: GRID_GAP }}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />

        {/* 랜덤 문구: 탭바 바로 위, 카드 느낌 제거 */}
        <View
          pointerEvents="none"
          style={[
            styles.footerFloat,
            {
              bottom: TABBAR_H + insets.bottom + 8, // 탭바와 거의 붙어서 한 덩어리처럼
              left: 16,
              right: 16,
            },
          ]}
        >
          <Text style={styles.quote}>{quote}</Text>
        </View>

        {/* 탭바(내부에서 bottom inset 처리) - 마이페이지 활성화 */}
        <CustomTabBar tabBarHeight={TABBAR_H} active="mypage" />
      </SafeAreaView>

      {/* 배지 상세 모달 */}
      <Modal
        visible={!!selected}
        transparent
        animationType="fade"
        onRequestClose={() => setSelected(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setSelected(null)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            {selected && (
              <>
                <Image
                  source={BADGE_IMAGES[selected.imageKey] ?? BADGE_IMAGES.tree}
                  style={{ width: MODAL_IMG_SIZE, height: MODAL_IMG_SIZE, marginBottom: 10 }}
                  resizeMode="contain"
                />
                {!!selected.date && (
                  <Text style={styles.modalSub}>
                    {selected.date} 에 얻은 {selected.title}입니다.
                  </Text>
                )}
                <Pressable style={styles.modalCloseBtn} onPress={() => setSelected(null)}>
                  <Text style={styles.modalCloseText}>닫기</Text>
                </Pressable>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // 배경 기본색 = 아이보리(홈과 통일하려면 여기서 변경)
  root: { flex: 1, backgroundColor: "#FFF9E8" },

  // 아래를 덮는 아이보리 패널 (스크린샷 느낌)
  ivoryPanel: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F9F8E1',
  },

  badgeBox: {
    marginBottom: GRID_GAP,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  footerFloat: {
    position: "absolute",
    zIndex: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent", // 카드 느낌 제거
    paddingHorizontal: 0,
    paddingVertical: 0,
    ...Platform.select({
      ios: { shadowOpacity: 0 },
      android: { elevation: 0 },
      web: {},
    }),
  },
  quote: {
    color: "#224C3F",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.12)", // 살짝 띄워 보이게
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
      web: { boxShadow: "0 12px 24px rgba(0,0,0,0.18)" },
    }),
  },
  modalSub: {
    fontSize: 13,
    color: "#4B5A55",
    marginBottom: 12,
    textAlign: "center",
  },
  modalCloseBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#0F6D52",
  },
  modalCloseText: { color: "#fff", fontSize: 13, fontWeight: "700" },
});
