import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPlace } from '../services/api';
import { Picker } from '@react-native-picker/picker';

export const FromTo = (props) => {
  const [placeData, setPlaceData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedFrom, setSelectedFrom] = React.useState('');
  const [selectedTo, setSelectedTo] = React.useState('');

  React.useEffect(() => {
    const fetchPlaceData = async () => {
      try {
        const data = await getPlace();
        console.log(data);
        setPlaceData(data);
      } catch (error) {
        console.error('Failed to fetch place data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaceData();
  }, []);

  // Lọc danh sách 'From' để chỉ chứa "Hà Nội"
  const fromList = placeData.filter((place) => place.name.toLowerCase() === 'hanoi');

  // Lọc danh sách 'To' để chỉ chứa "Hưng Yên" và "Vĩnh Yên"
  const toList = placeData.filter((place) => ['hungyen', 'vinhyen'].includes(place.name.toLowerCase()));

  return (
    <View style={{ width: '100%' }}>
      {loading ? (
        <ActivityIndicator size="large" color={props.backgroundColor} />
      ) : (
        <>
          {/* From Selection */}
          <View style={{ flexDirection: 'row', marginBottom: 15, alignItems: 'center' }}>
            <Ionicons name="location-sharp" size={26} color={props.backgroundColor} />
            <View style={{ marginLeft: 20, flex: 1 }}>
              <Text style={{ opacity: 0.6, fontSize: 15 }}>From</Text>
              <Picker
                selectedValue={selectedFrom}
                onValueChange={(itemValue) => setSelectedFrom(itemValue)}
                style={{ fontWeight: 'bold', fontSize: 15 }}>
                <Picker.Item label="Select a place" value="" />
                {fromList.map((place, index) => (
                  <Picker.Item key={`${place.id}-${index}`} label={place.name} value={place.name} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Line Divider */}
          <View style={{ position: 'absolute', left: 12, height: 28, borderWidth: 1, top: 42, width: 0, borderColor: '#EBE7E6' }} />

          {/* To Selection */}
          <View style={{ flexDirection: 'row', alignItems: 'center', borderTopStartRadius: 60, borderTopEndRadius: 20, borderColor: '#EBE7E6', borderTopWidth: 2 }}>
            <Ionicons name="location-sharp" size={26} color="#5C7A82" />
            <View style={{ marginLeft: 20, flex: 1 }}>
              <Text style={{ opacity: 0.6, fontSize: 15, marginTop: 10 }}>To</Text>
              <Picker
                selectedValue={selectedTo}
                onValueChange={(itemValue) => setSelectedTo(itemValue)}
                style={{ fontWeight: 'bold', fontSize: 15 }}>
                <Picker.Item label="Select a place" value="" />
                {toList.map((place, index) => (
                  <Picker.Item key={`${place.id}-${index}`} label={place.name} value={place.name} />
                ))}
              </Picker>
            </View>
          </View>
        </>
      )}
    </View>
  );
};
