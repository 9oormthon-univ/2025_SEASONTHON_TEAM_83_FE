import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const SearchBar = () => {
  	
  	return (
    		<View style={styles.searchBar}>
      			<View style={styles.view}>
        				<View style={styles.labels}>
          					<Image 
                source={require('../assets/images/icon_search.png')} 
                style={styles.searchIcon} 
              />
          					<Text style={styles.search}>Search</Text>
        				</View>
      			</View>
    		</View>);
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "#fffff6",
    marginHorizontal: 2,
    marginBottom: 20,
    marginTop: -20, // 위쪽으로 이동
  },
  view: {
    width: "100%",
    borderStyle: "solid",
    borderColor: "#d1d1d6",
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8, // 위아래 패딩 줄임 (12 → 8)
    paddingHorizontal: 16, // 좌우 패딩 늘림 (12 → 16)
    backgroundColor: "#ffffff",
    height: 40, // 고정 높이로 얇게
  },
  	labels: {
    		flexDirection: "row",
    		alignItems: "center",
    		flex: 1,
  	},
  	searchIcon: {
    		width: 20,
    		height: 20,
    		marginRight: 8,
  	},
  	search: {
    		fontSize: 16,
    		letterSpacing: 0.3,
    		lineHeight: 24,
    		fontFamily: "Pretendard Variable",
    		color: "#525252",
  	},
});

export default SearchBar;
