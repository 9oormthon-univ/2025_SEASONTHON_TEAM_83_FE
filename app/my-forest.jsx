// app/my-forest.jsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Dimensions, FlatList, Image, PanResponder,
    Platform,
    Pressable,
    StyleSheet, Text, TouchableOpacity, View
} from "react-native";
import CustomTabBar from "../components/CustomTabBar";
import HeaderBar from "../components/HeaderBar";

// ===== 설정 =====
const STORAGE_KEY = "badge_board_v1";
const { width: SCREEN_W } = Dimensions.get("window");

export default function MyForest() {
  const router = useRouter();

  // 페이지 상태
  const [mode, setMode] = useState("free");        // "free" | "list"
  const [editable, setEditable] = useState(true);  // 드래그 가능 여부
  const [boardSize, setBoardSize] = useState({ w: SCREEN_W, h: SCREEN_W * 1.2 });
  const [badges, setBadges] = useState([
    {
      id: "tree-1",
      title: "나무 뱃지",
      date: "2025.09.02",
      uri: require("../assets/images/tree_badge.png"),
      x: 40, y: 120, scale: 1,
    },
  ]);
  const [tooltip, setTooltip] = useState(null); // {id, x, y, title, date}

  // 저장 불러오기
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setBadges(parsed);
        }
      } catch {}
    })();
     
  }, []);

  // 변경 시 저장
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(badges)).catch(()=>{});
  }, [badges]);

  const onBoardLayout = e => {
    const { width, height } = e.nativeEvent.layout;
    setBoardSize({ w: width, h: height });
  };

  const updateBadge = (id, patch) => {
    setBadges(prev => prev.map(b => (b.id === id ? { ...b, ...patch } : b)));
  };

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // ====== Sticker(개별 배지) ======
  const Sticker = ({ b }) => {
    const posRef = useRef({ x: b.x ?? 0, y: b.y ?? 0 });
    useEffect(() => {
      posRef.current = { x: b.x ?? 0, y: b.y ?? 0 };
    }, [b.x, b.y]);

    const finishDrag = (_, g) => {
      if (!editable) return;
      const nx = clamp(posRef.current.x + g.dx, -20, boardSize.w - 80);
      const ny = clamp(posRef.current.y + g.dy, -20, boardSize.h - 80);
      posRef.current = { x: nx, y: ny };
      updateBadge(b.id, { x: nx, y: ny });
    };

    const pan = useMemo(
      () =>
        PanResponder.create({
          onStartShouldSetPanResponder: () => editable,
          onMoveShouldSetPanResponder: () => editable,
          onStartShouldSetPanResponderCapture: () => true,
          onMoveShouldSetPanResponderCapture: () => true,
          onPanResponderTerminationRequest: () => false,
          onShouldBlockNativeResponder: () => true,

          onPanResponderGrant: () => setTooltip(null),
          onPanResponderMove: (_, g) => {
            if (!editable) return;
            updateBadge(b.id, {
              x: posRef.current.x + g.dx,
              y: posRef.current.y + g.dy,
            });
          },
          onPanResponderRelease: finishDrag,
          onPanResponderTerminate: finishDrag, // 웹에서 끊겨도 놓기 처리
        }),
      [editable, boardSize.w, boardSize.h]
    );

    return (
      <View
        {...pan.panHandlers}
        // transform 대신 절대 좌표 → 히트박스와 시각 위치 일치
        style={[
          styles.sticker,
          { left: b.x ?? 0, top: b.y ?? 0 }
        ]}
      >
        <Pressable
          onPress={() =>
            setTooltip({
              id: b.id,
              x: b.x ?? 0,
              y: b.y ?? 0,
              title: b.title,
              date: b.date,
            })
          }
          onLongPress={() => setEditable((v) => !v)}
          delayLongPress={250}
        >
          {/* 웹에서 이미지 고스트 드래그 방지 */}
          <Image
            source={b.uri}
            style={styles.stickerImg}
            resizeMode="contain"
            // @ts-ignore
            draggable={false}
            // @ts-ignore
            onContextMenu={(e) => e.preventDefault()}
          />
        </Pressable>
      </View>
    );
  };

  const renderListItem = ({ item }) => (
    <View style={styles.listItem}>
      <Image source={item.uri} style={styles.listIcon} />
      <View style={{ flex: 1 }}>
        <Text style={styles.listTitle}>{item.title}</Text>
        {!!item.date && <Text style={styles.listDate}>{item.date}</Text>}
      </View>
      <TouchableOpacity style={styles.toBoardBtn} onPress={() => setMode("free")}>
        <Text style={styles.toBoardBtnText}>보드에서 보기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.root}>
      {/* 상단 바 (프로젝트에 이미 있는 컴포넌트) */}
      <HeaderBar title="My Page" />

      {/* 본문 */}
      {mode === "free" ? (
        <View style={styles.board} onLayout={onBoardLayout}>
          {/* 배경 */}
          <Image
            source={require("../assets/images/forest.png")}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          {/* 배지 스티커 */}
          {badges.map(b => <Sticker key={b.id} b={b} />)}

          {/* 툴팁 */}
          {tooltip && (
            <View
              style={[
                styles.tooltip,
                {
                  left: clamp(tooltip.x + 16, 8, boardSize.w - 8 - 260),
                  top: clamp(tooltip.y + 16, 8, boardSize.h - 8 - 96),
                },
              ]}
            >
              <Text style={styles.tooltipTitle}>{tooltip.title}</Text>
              {!!tooltip.date && <Text style={styles.tooltipBody}>{tooltip.date} 에 얻은 뱃지입니다.</Text>}
              <Pressable onPress={() => setTooltip(null)} style={styles.tooltipClose}>
                <Text style={styles.tooltipCloseText}>닫기</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <FlatList
          data={badges}
          keyExtractor={(it) => it.id}
          renderItem={renderListItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        />
      )}

      {/* 하단 멘트 + 탭바 */}
      <View style={styles.footer}>
        <Text style={styles.ment1}>“하나의 나무, 하나의 변화.”</Text>
        <Text style={styles.ment2}>당신이 시작했습니다.</Text>
      </View>
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFF9E8" },

  // 상단바는 HeaderBar가 처리 (여기선 생략)

  board: {
    flex: 1,
    overflow: "hidden",
    ...Platform.select({
      web: {
        touchAction: "none",   // 브라우저 제스처 차단
        userSelect: "none",    // 텍스트 선택 방지
      },
    }),
  },

  sticker: {
    position: "absolute",
    ...Platform.select({
      web: {
        touchAction: "none",
        userSelect: "none",
        cursor: "grab",
      },
    }),
  },

  stickerImg: { width: 120, height: 120 },

  tooltip: {
    position: "absolute",
    width: 260,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 2,
    ...Platform.select({
      web: { userSelect: "none" },
    }),
  },
  tooltipTitle: { fontWeight: "700", fontSize: 15, marginBottom: 6, color: "#152A22" },
  tooltipBody: { color: "#4B5A55", marginBottom: 8 },
  tooltipClose: { alignSelf: "flex-end", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, backgroundColor: "#EEF6F0" },
  tooltipCloseText: { color: "#134A3B", fontWeight: "600" },

  listItem: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "white", borderRadius: 14, padding: 12, marginBottom: 12,
    shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  listIcon: { width: 56, height: 56, marginRight: 12, borderRadius: 10 },
  listTitle: { fontSize: 16, fontWeight: "700", color: "#153026" },
  listDate: { fontSize: 12, color: "#6A7A74", marginTop: 2 },
  toBoardBtn: { paddingVertical: 6, paddingHorizontal: 10, backgroundColor: "#0F6D52", borderRadius: 8 },
  toBoardBtnText: { color: "white", fontSize: 12, fontWeight: "600" },

  footer: { paddingVertical: 16, alignItems: "center", backgroundColor: "#FFF3D6" },
  ment1: { color: "#224C3F", fontSize: 14, marginBottom: 4 },
  ment2: { color: "#224C3F", fontSize: 13 },
});
