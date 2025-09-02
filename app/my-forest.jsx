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
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ✅ 이미지 매핑 테이블
const BADGE_IMAGES = {
  tree: require("../assets/images/tree_badge.png"),
  // 다른 뱃지도 추가 가능: earth: require("../assets/images/earth_badge.png"),
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

  const [badges, setBadges] = useState([
    {
      id: "tree-1",
      title: "나무 뱃지",
      date: "2025.09.02",
      imageKey: "tree",
    },
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
          id: b.id ?? `badge-${i}`,
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

  // 그리드 열 수 계산
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
        {
          width: itemSize,
          height: itemSize,
          opacity: pressed ? 0.85 : 1,
        },
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
      {/* 배경 */}
      <Image
        source={require("../assets/images/forest.png")}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* 뱃지 그리드 */}
      <FlatList
        data={badges}
        keyExtractor={(it) => it.id}
        numColumns={columns}
        contentContainerStyle={{
          paddingHorizontal: GRID_PAD_H,
          paddingTop: 12,
          paddingBottom: TABBAR_H + insets.bottom + 120,
        }}
        columnWrapperStyle={{ justifyContent: "flex-start", gap: GRID_GAP }}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />

      {/* 랜덤 문구 */}
      <View
        pointerEvents="none"
        style={[
          styles.footerFloat,
          { bottom: TABBAR_H + insets.bottom + 8, left: 16, right: 16 },
        ]}
      >
        <Text style={styles.quote}>{quote}</Text>
      </View>

      {/* 모달 */}
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
                  style={{
                    width: MODAL_IMG_SIZE,
                    height: MODAL_IMG_SIZE,
                    marginBottom: 10,
                  }}
                  resizeMode="contain"
                />
                {!!selected.date && (
                  <Text style={styles.modalSub}>
                    {selected.date} 에 얻은 {selected.title} 뱃지입니다.
                  </Text>
                )}
                <Pressable
                  style={styles.modalCloseBtn}
                  onPress={() => setSelected(null)}
                >
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
  root: { flex: 1, backgroundColor: "#FFF9E8" },

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
    backgroundColor: "#FFF3D6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: { elevation: 3 },
      web: { boxShadow: "0 4px 10px rgba(0,0,0,0.08)" },
    }),
  },
  quote: {
    color: "#224C3F",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
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
