import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPlace } from '../services/api';
import { Picker } from '@react-native-picker/picker';

export const FromTo = ({ backgroundColor, onSelectionChange, isConfirmed }) => {
  const [placeData, setPlaceData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedFrom, setSelectedFrom] = React.useState('');
  const [selectedTo, setSelectedTo] = React.useState('');

  React.useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const data = await getPlace();
        setPlaceData(data);
      } catch (error) {
        console.error('Failed to fetch place data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaceData();
  }, []);

  // Lọc danh sách 'From' và 'To'
  const fromList = placeData.filter((place) => place.name.toLowerCase() === 'hanoi');
  const toList = placeData.filter((place) => ['hungyen', 'vinhyen'].includes(place.name.toLowerCase()));

  // Gửi dữ liệu khi From/To thay đổi
  React.useEffect(() => {
    if (onSelectionChange) {  // Check if onSelectionChange is defined
      onSelectionChange(selectedFrom, selectedTo);
    }
  }, [selectedFrom, selectedTo, onSelectionChange]);
  return (
    <View style={{ width: '100%' }}>
      {loading ? (
        <ActivityIndicator size="large" color={backgroundColor} />
      ) : (
        <>
          {/* From Selection */}
          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
            <Ionicons name="location-sharp" size={26} color={backgroundColor} />
            <View style={{ marginLeft: 20, flex: 1 }}>
              <Text style={{ opacity: 0.6, fontSize: 15 }}>From</Text>
              <Picker
                selectedValue={selectedFrom}
                onValueChange={(itemValue) => setSelectedFrom(itemValue)}
                style={{ fontWeight: 'bold', fontSize: 15 }}
                enabled={!isConfirmed}>
                <Picker.Item label="Select a place" value="" />
                {fromList.map((place) => (
                  <Picker.Item key={place.id} label={place.name} value={place.name} />
                ))}
              </Picker>
            </View>
          </View>

          {/* To Selection */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="location-sharp" size={26} color="#5C7A82" />
            <View style={{ marginLeft: 20, flex: 1 }}>
              <Text style={{ opacity: 0.6, fontSize: 15, marginTop: 10 }}>To</Text>
              <Picker
                selectedValue={selectedTo}
                onValueChange={(itemValue) => setSelectedTo(itemValue)}
                style={{ fontWeight: 'bold', fontSize: 15 }}
                enabled={!isConfirmed}>
                <Picker.Item label="Select a place" value="" />
                {toList.map((place) => (
                  <Picker.Item key={place.id} label={place.name} value={place.name} />
                ))}
              </Picker>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
