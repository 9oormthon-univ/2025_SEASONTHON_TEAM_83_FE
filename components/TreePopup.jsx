import { LinearGradient } from 'expo-linear-gradient';
import * as React from "react";
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TreePopup = ({ visible, onClose, message, isFirstPopup = false }) => {
  	
  	return (
    		<Modal
      			visible={visible}
      			transparent={true}
      			animationType="fade"
      			onRequestClose={onClose}
    		>
      			<View style={styles.modalOverlay}>
        			<View style={styles.popupContainer}>
          				<LinearGradient
            				colors={['#a0f4eb', '#faf8d7', '#fffff6']}
            				locations={[0, 0.68, 1]}
            				useAngle={true}
            				angle={256.14}
            				style={styles.gradientBackground}
          				>
            				{/* 닫기 버튼 */}
            				<TouchableOpacity style={styles.closeButton} onPress={onClose}>
              					<Text style={styles.closeButtonText}>×</Text>
            				</TouchableOpacity>
            
            				{/* 첫 번째 팝업이 아닌 경우에만 나무 아이콘 표시 */}
            				{!isFirstPopup && (
              					<View style={styles.iconContainer}>
                					<Image 
                  						source={require('../assets/images/icon_tree.png')} 
                  						style={styles.treeIcon} 
                					/>
              					</View>
            				)}
            
            				{/* 메시지 */}
            				<Text style={isFirstPopup ? styles.firstMessageText : styles.messageText}>
              					{message}
            				</Text>
          				</LinearGradient>
        			</View>
      			</View>
    		</Modal>
  	);
};

const styles = StyleSheet.create({
  	modalOverlay: {
    		flex: 1,
    		backgroundColor: 'rgba(0, 0, 0, 0.5)',
    		justifyContent: 'center',
    		alignItems: 'center',
  	},
  	popupContainer: {
    		borderRadius: 4,
    		overflow: 'hidden',
    		width: 300,
    		height: 183,
    		borderWidth: 1,
    		borderColor: '#d6d6d6',
    		shadowColor: '#000',
    		shadowOffset: {
      			width: 0,
      			height: 4,
    		},
    		shadowOpacity: 0.25,
    		shadowRadius: 8,
    		elevation: 8,
  	},
  	gradientBackground: {
    		flex: 1,
    		justifyContent: 'center',
    		alignItems: 'center',
    		padding: 20,
    		position: 'relative',
  	},
  	closeButton: {
    		position: 'absolute',
    		top: 15,
    		right: 15,
    		width: 30,
    		height: 30,
    		justifyContent: 'center',
    		alignItems: 'center',
    		backgroundColor: 'rgba(255, 255, 255, 0.8)',
    		borderRadius: 15,
    		zIndex: 1,
  	},
  	closeButtonText: {
    		fontSize: 20,
    		color: '#666',
    		fontWeight: 'bold',
  	},
  	iconContainer: {
    		position: 'absolute',
    		top: '30%', // 상단에서 30% 위치에 배치
    		left: '50%',
    		transform: [{ translateX: -10 }], // 아이콘 너비의 절반만큼 왼쪽으로 이동
    		alignItems: 'center',
    		justifyContent: 'center',
  	},
  	treeIcon: {
    		width: 70,
    		height: 70,
    		resizeMode: 'contain',
  	},
  	firstMessageText: {
    		width: 162,
    		fontSize: 24,
    		letterSpacing: -0.3,
    		lineHeight: 28,
    		fontWeight: '700',
    		fontFamily: 'Pretendard Variable',
    		color: '#0061e9',
    		textAlign: 'center',
    		position: 'absolute',
    		top: '50%',
    		left: '50%',
    		transform: [{ translateX: -60 }, { translateY: 10 }], // 중앙 정렬을 위한 변환
  	},
  	messageText: {
    		width: 160,
    		fontSize: 15,
    		letterSpacing: 0.3,
    		lineHeight: 20,
    		fontFamily: 'Pretendard Variable',
    		color: '#000',
    		textAlign: 'center',
    		position: 'absolute',
    		top: '70%', // 나무 아이콘 아래에 위치하도록 조정
    		left: '50%',
    		transform: [{ translateX: -60 }, { translateY: 35 }], // 중앙 정렬을 위한 변환
  	}
});

export default TreePopup;
