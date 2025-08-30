import * as React from "react";
import { StyleSheet, Text } from "react-native";

const CategoryTitle = () => {
  	
  	return (
    		<Text style={styles.text}>관심 카테고리 설정</Text>);
};

const styles = StyleSheet.create({
  	text: {
    		width: 160,
    		fontSize: 20,
    		letterSpacing: -0.2,
    		lineHeight: 28,
    		fontWeight: "700",
    		fontFamily: "Pretendard Variable",
    		color: "#2d2d2d",
    		textAlign: "left"
  	}
});

export default CategoryTitle;
