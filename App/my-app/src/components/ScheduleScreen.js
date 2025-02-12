import * as React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from 'react-native-vector-icons';
import { CustomCard } from './CustomCard';
import { FromTo } from './FromTo';
import axios from 'axios';

export const ScheduleScreen = () => {
  const nav = useNavigation();
  const route = useRoute();
  const params = route.params;

  const [selectedFrom, setSelectedFrom] = React.useState('');
  const [selectedTo, setSelectedTo] = React.useState('');
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [scheduleData, setScheduleData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const handleBackToHome = () => {
    nav.navigate('home');
  };

  // Nhận giá trị từ FromTo
  const handleSelectionChange = (from, to) => {
    setSelectedFrom(from);
    setSelectedTo(to);
  };

  // Fetch lịch trình từ API khi người dùng đã chọn điểm đến
  React.useEffect(() => {
    if (!selectedTo) return; // Không gọi API nếu chưa chọn điểm đến

    const fetchScheduleData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:1010/api/schedule/${selectedTo}`);
        setScheduleData(response.data); // Đảm bảo lấy đúng dữ liệu
      } catch (error) {
        console.error('Failed to fetch schedule data:', error);
        setScheduleData([]); // Đặt danh sách trống nếu gặp lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleData();
  }, [selectedTo]);

  // Hiển thị từng lịch trình
  const scheduleItem = ({ item }) => (
    <View style={styles.scheduleItem}>
      <View style={styles.scheduleRow}>
      <View style={styles.scheduleTime}>
          <Ionicons name="timer-outline" size={15} color="#000" />
          <Text style={styles.scheduleText}>{selectedFrom}</Text>
          <Ionicons name="swap-horizontal-outline" size={15} color="#000" />
          <Text style={styles.scheduleText}>{selectedTo}</Text>
        </View>
        <View style={styles.scheduleTime}>
          <Ionicons name="timer-outline" size={15} color="#000" />
          <Text style={styles.scheduleText}>{item.departuretime}</Text>
          <Ionicons name="swap-horizontal-outline" size={15} color="#000" />
          <Text style={styles.scheduleText}>{item.arrivaltime}</Text>
        </View>
        <Text style={styles.priceText}>$ {item.price}</Text>
      </View>

      <View style={styles.scheduleRow}>
        <View style={styles.scheduleTime}>
          <Ionicons name="location-outline" size={15} color="#000" />
          <Text style={styles.scheduleText}>{item.name}</Text>
        </View>
        <TouchableOpacity style={[styles.selectButton, { backgroundColor: params.backgroundColor }]}>
          <Text style={styles.selectText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: params.backgroundColor }]}>
      <View style={[styles.topview, { backgroundColor: params.backgroundColor }]}>
        <Text style={styles.title}>{params.title}</Text>
        <Image source={params.imagesrc} />
      </View>

      <View style={styles.bottomview}>
        <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <CustomCard elevated={true} style={styles.card}>
          <FromTo backgroundColor={params.backgroundColor} onSelectionChange={handleSelectionChange} isConfirmed={isConfirmed} />
        </CustomCard>

        {selectedFrom && selectedTo && !showSchedule && (
          <TouchableOpacity
            onPress={() => {
              setShowSchedule(true);
              setIsConfirmed(true);
            }}
            style={[styles.confirmButton, { backgroundColor: params.backgroundColor }]}>
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        )}

        {showSchedule && (
          <>
            <Text style={styles.chooseScheduleText}>Choose Schedule</Text>
            {loading ? (
              <ActivityIndicator size="large" color={params.backgroundColor} />
            ) : scheduleData.length > 0 ? (
              <FlatList data={scheduleData} renderItem={scheduleItem} keyExtractor={(item) => item.id} />
            ) : (
              <Text style={styles.noScheduleText}>No schedule available</Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topview: { marginTop: 60, marginHorizontal: 24, flex: 1, justifyContent: "center", alignItems: "center" },
  title: { position: 'absolute', top: 5, textAlign: 'center', fontSize: 30, color: '#fff', fontWeight: 'bold' },
  bottomview: { flex: 2, backgroundColor: "#fff", borderTopLeftRadius: 50, marginTop: 20, borderTopRightRadius: 50 },
  backButton: { marginLeft: 20, marginTop: 10 },
  card: { backgroundColor: '#fff', marginHorizontal: 24, marginTop: 30, padding: 10, borderRadius: 10 },
  confirmButton: { padding: 10, marginHorizontal: 24, marginTop: 20, borderRadius: 10, alignItems: 'center' },
  confirmText: { color: '#fff', fontWeight: 'bold' },
  chooseScheduleText: { marginHorizontal: 26, marginVertical: 20, fontWeight: 'bold', fontSize: 20 },
  noScheduleText: { textAlign: 'center', fontSize: 16, color: 'gray', marginVertical: 10 },
  scheduleItem: { marginBottom: 10, borderBottomWidth: 2, marginHorizontal: 5, borderBottomColor: "#EBE7E6", paddingBottom: 10 },
  scheduleRow: { flexDirection: "row", marginHorizontal: 26, marginBottom: 10, justifyContent: "space-between" },
  scheduleTime: { flexDirection: "row" },
  scheduleText: { fontSize: 15, fontWeight: "bold", marginHorizontal: 10 },
  priceText: { fontWeight: "bold", marginRight: 16 },
  selectButton: { paddingHorizontal: 8, borderRadius: 5 },
  selectText: { color: "#fff", fontWeight: "bold" },
});
