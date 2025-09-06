import * as React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

const StartButton = () => {
  	
  	return (
    		<Pressable style={styles.buttons} onPress={()=>{}}>
      			<Text style={styles.secondary}>함께 출발하기</Text>
    		</Pressable>);
};

const styles = StyleSheet.create({
  	buttons: {
    		width: "100%",
    		boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    		shadowColor: "rgba(0, 0, 0, 0.25)",
    		shadowOffset: {
      			width: 0,
      			height: 4
    		},
    		shadowRadius: 4,
    		elevation: 4,
    		shadowOpacity: 1,
    		backgroundColor: "#006256",
    		flex: 1,
    		flexDirection: "row",
    		alignItems: "center",
    		justifyContent: "center",
    		paddingHorizontal: 24,
    		paddingVertical: 8
  	},
  	secondary: {
    		fontSize: 16,
    		letterSpacing: 0.3,
    		lineHeight: 24,
    		fontWeight: "700",
    		fontFamily: "Inter-Bold",
    		color: "#fff",
    		textAlign: "left"
  	}
});

export default StartButton;
