import * as React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const PopUpAlerts = ({ visible, onClose }) => {
  	
  	return (
    		<Modal
      			visible={visible}
      			transparent={true}
      			animationType="fade"
      			onRequestClose={onClose}
    		>
      			<View style={styles.modalOverlay}>
        			<View style={styles.popupContainer}>
          				{/* 닫기 버튼 */}
          				<TouchableOpacity style={styles.closeButton} onPress={onClose}>
            				<Text style={styles.closeButtonText}>×</Text>
          				</TouchableOpacity>
          
          				{/* 포인트 표시 */}
          				<Text style={styles.pointText}>+3p</Text>
          
          				{/* 출석 완료 메시지 */}
          				<Text style={styles.messageText}>출석되었습니다</Text>
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
    		backgroundColor: '#FFFFFF',
    		borderRadius: 12,
    		padding: 30,
    		alignItems: 'center',
    		justifyContent: 'center',
    		width: 280,
    		height: 200,
    		shadowColor: '#000',
    		shadowOffset: {
      			width: 0,
      			height: 4,
    		},
    		shadowOpacity: 0.25,
    		shadowRadius: 8,
    		elevation: 8,
  	},
  	closeButton: {
    		position: 'absolute',
    		top: 15,
    		right: 15,
    		width: 30,
    		height: 30,
    		justifyContent: 'center',
    		alignItems: 'center',
  	},
  	closeButtonText: {
    		fontSize: 24,
    		color: '#666',
    		fontWeight: 'bold',
  	},
  	pointText: {
    		fontSize: 32,
    		fontWeight: 'bold',
    		color: '#0061E9',
    		marginBottom: 10,
    		fontFamily: 'Pretendard Variable',
  	},
  	messageText: {
    		fontSize: 18,
    		color: '#2D2D2D',
    		fontFamily: 'Pretendard Variable',
    		textAlign: 'center',
  	}
});

export default PopUpAlerts;
