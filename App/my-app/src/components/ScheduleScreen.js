import * as React from 'react';
import  {View,StyleSheet,Image,Text,TouchableOpacity,TextInput,FlatList} from 'react-native';
import { useNavigation , useRoute} from '@react-navigation/native';
import {PRIMARYCOLOR,PRIMARYBORDERADIUS} from '../../Constants.js';
import { Ionicons } from '@expo/vector-icons';
import {CustomCard} from './CustomCard';
import { FontAwesome } from 'react-native-vector-icons';
import bus from '../../assets/images/bus.png';
import mrt from '../../assets/images/mrt.jpg';
import {FromTo} from './FromTo';
import axios from 'axios';
export const ScheduleScreen = () => {
  const nav = useNavigation();
  const route = useRoute();
  const params = route.params;

  const [selectedFrom, setSelectedFrom] = React.useState('');
  const [selectedTo, setSelectedTo] = React.useState('');
  const [showSchedule, setShowSchedule] = React.useState(false);
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [scheduleData,setScheduleData]=React.useState([])
  const [loading,setLoading]=React.useState(false)
  const handleBackToHome = () => {
    nav.navigate('home');
  };

  // Nhận giá trị từ FromTo
  const handleSelectionChange = (from, to) => {
    setSelectedFrom(from);
    setSelectedTo(to);
  };

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
  const scheduleItem = ({item}) => {
    return (<View style={{marginBottom:10,borderBottomWidth:2,marginHorizontal:5,borderBottomStartRadius:30,borderBottomEndRadius:10,borderBottomColor:"#EBE7E6"}}>
      <View style={{flexDirection:"row",marginHorizontal:26,marginBottom:10,justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                  <Ionicons name="location-outline" size={15} color="#000"  />
                  <Text style={{fontSize:15,fontWeight:"bold",marginHorizontal:10}}>{selectedFrom}</Text>
                  <Ionicons name="swap-horizontal-outline" size={15} color="#000"  />
                  <Text style={{fontSize:15,fontWeight:"bold",marginHorizontal:10}}>{selectedTo}</Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginHorizontal:26,marginBottom:10,justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                  <Ionicons name="timer-outline" size={15} color="#000"  />
                  <Text style={{fontSize:15,fontWeight:"bold",marginHorizontal:10}}>{item.departuretime}</Text>
                  <Ionicons name="swap-horizontal-outline" size={15} color="#000"  />
                  <Text style={{fontSize:15,fontWeight:"bold",marginHorizontal:10}}>{item.arrivaltime}</Text>
                </View>
                <View>
                  <Text style={{fontWeight:"bold",marginRight:16}}> {item.price}</Text>
                </View>
              </View>
              <View style={{flexDirection:"row",marginHorizontal:26,marginBottom:15,justifyContent:"space-between"}}>
                <View style={{flexDirection:"row"}}>
                  <Ionicons name="location-outline" size={15} color="#000"  />
                  <Text style={{fontSize:15,fontWeight:"bold",marginHorizontal:10}}>{item.name}</Text>
                </View>
                <View>
                <TouchableOpacity
        style={{ backgroundColor: params.backgroundColor, paddingHorizontal: 8, borderRadius: 5 }}
        onPress={() => {
          // Khi ấn nút "Select", điều hướng đến màn hình Payment
          nav.navigate('payment', { name:item.name,
            price:item.price,
            departuretime:item.departuretime,
            arrivaltime:item.arrivaltime,
            selectedFrom:selectedFrom,
            selectedTo:selectedTo
           }); 
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>Select</Text>
      </TouchableOpacity>
                </View>
              </View> 
           </View>
           );
  };
  return (
    <View style={[styles.container, { backgroundColor: params.backgroundColor }]}>
      <View style={[styles.topview, { backgroundColor: params.backgroundColor, marginBottom: 20 }]}>
        <Text style={{ position: 'absolute', top: 5, textAlign: 'center', fontSize: 30, color: '#fff', fontWeight: 'bold' }}>
          {params.title}
        </Text>
        <Image source={params.imagesrc} />
      </View>

      <View style={styles.bottomview}>
        <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <CustomCard elevated={true} style={{ backgroundColor: '#fff', marginHorizontal: 24, marginTop: 30, padding: 10, borderRadius: 10 }}>
        <FromTo
  backgroundColor={params.backgroundColor} 
  onSelectionChange={handleSelectionChange} 
  isConfirmed={isConfirmed}
/>

        </CustomCard>

        {/* Nút Confirm */}
        {selectedFrom && selectedTo && !showSchedule && (
         <TouchableOpacity
         onPress={() => {
           setShowSchedule(true);
           setIsConfirmed(true); // Vô hiệu hóa FromTo
         }}
         disabled={isConfirmed} // Tránh nhấn nhiều lần
         style={{
           backgroundColor: params.backgroundColor,
           padding: 10,
           marginHorizontal: 24,
           marginTop: 20,
           borderRadius: 10,
           alignItems: 'center',
           opacity: isConfirmed ? 0.6 : 1, // Làm mờ khi disable
         }}>
         <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirm</Text>
       </TouchableOpacity>
       
        )}


        {/* Chỉ hiển thị danh sách khi đã Confirm */}
        {showSchedule && (
          <>
            <Text style={{ marginHorizontal: 26, marginVertical: 20, fontWeight: 'bold', fontSize: 20 }}>Choose Schedule</Text>
            <FlatList
              data={scheduleData}
              renderItem={scheduleItem}
              keyExtractor={(item) => item.id}
            />
          </>
        )}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  topview:{
    marginTop:60,
    marginHorizontal:24,
    backgroundColor:PRIMARYCOLOR,
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  bottomview:{
    flex:2,
    backgroundColor:"#fff",
    borderTopLeftRadius:50,
    marginTop:20,
    borderTopRightRadius:50,
  },
  backButton:{
    marginLeft:20,
    marginTop:10
  },
  container: {
    flex:1,
    backgroundColor:PRIMARYCOLOR,
  },
});