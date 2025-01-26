import * as React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PRIMARYCOLOR } from '../../Constants.js';
import { Ionicons } from '@expo/vector-icons';
import { CustomCard } from './CustomCard';
import { useRoute } from '@react-navigation/native';
import { getTransport } from '../services/api.js';

import bus from '../../assets/images/bus.png'
import mrt from '../../assets/images/mrt.jpg'
export const HomeScreen = () => {
  const nav = useNavigation();
  const route = useRoute();
  const username = route.params?.username
  console.log(username)
  const [transportData, setTransportData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fetch transport data from server
    const fetchTransportData = async () => {
      try {
        const data = await getTransport();
        setTransportData(data);
      } catch (error) {
        console.error('Failed to fetch transport data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransportData();
  }, []);

  const transportItem = ({ item }) => {
    // Conditional rendering logic for bus image
    const renderImage = () => {
      if (item.name === "Bus") {
        return <Image style={{ position: "absolute", right: -15, bottom: 2 }} source={bus} />;
      }
      if (item.name === "Mrt") {
        return <Image style={{ position: "absolute", right: -15, bottom: 2 }} source={mrt} />;
      }
      return null; // Return null if no condition matches
    };

    return (
      <CustomCard>
        <View style={styles.card}>
          <View style={{ justifyContent: 'space-between' }}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() =>
                nav.navigate('schedule', {
                  title: item.name,
                  imagesrc: item.imageSrc, // Ensure the server provides image URLs or paths
                  backgroundColor: '#6BC5E8', // Customize per transport item
                })
              }
            >
              <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Select</Text>
            </TouchableOpacity>
          </View>
          <View>
          {renderImage()}
          </View>
        </View>
      </CustomCard>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topview}>
        <View style={styles.welcomecontainer}>
          <Text style={styles.welcomemessage}>Hello, {username}</Text>
          <View style={styles.circle}></View>
        </View>
        <Text style={{ color: '#fff' }}> Where will you go</Text>
        <View style={styles.searchbar}>
          <Ionicons name="search-outline" size={25} color="#BEBEBE" style={{ width: 40, transform: [{ rotateY: '180deg' }] }} />
          <TextInput placeholder="Search" style={styles.searchInput}></TextInput>
        </View>
      </View>
      <View style={styles.bottomview}>
        <CustomCard elevated={true} style={styles.balanceCard}>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.cardInfoTitle}>Balance</Text>
            <Text style={styles.cardInfoValue}>$ 18</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.cardInfoTitle}>Rewards</Text>
            <Text style={styles.cardInfoValue}>$ 10.25</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.cardInfoTitle}>Total Trips</Text>
            <Text style={styles.cardInfoValue}>189</Text>
          </View>
        </CustomCard>
        <Text style={styles.transportHeader}>Choose your Transport</Text>
        {loading ? (
          <ActivityIndicator size="large" color={PRIMARYCOLOR} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={transportData}
            renderItem={transportItem}
            keyExtractor={(item) => item._id} // Use unique ID from server
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PRIMARYCOLOR },
  topview: { marginTop: 60, marginHorizontal: 24, backgroundColor: PRIMARYCOLOR, flex: 1, justifyContent: 'space-between' },
  welcomemessage: { color: '#fff', fontSize: 35, fontWeight: 'bold' },
  searchbar: { flexDirection: 'row', backgroundColor: '#fff', alignItems: 'center', width: '100%', height: 40, borderRadius: 10, marginBottom: 65 },
  searchInput: { color: '#BEBEBE', marginLeft: 15, opacity: 0.5, fontSize: 20 },
  circle: { borderRadius: 25, height: 50, width: 50, backgroundColor: '#fff' },
  welcomecontainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bottomview: { flex: 2, backgroundColor: '#fff', borderTopLeftRadius: 50, borderTopRightRadius: 50 },
  balanceCard: { backgroundColor: '#fff', marginHorizontal: 24, marginTop: -40, padding: 30, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between' },
  cardInfoTitle: { fontWeight: 'bold', marginBottom: 10 },
  cardInfoValue: { fontWeight: 'bold', fontSize: 18 },
  transportHeader: { marginHorizontal: 26, marginVertical: 20, fontWeight: 'bold', fontSize: 20 },
  card: { flexDirection: 'row', overflow: 'hidden', justifyContent: 'space-between', padding: 15, backgroundColor: '#6BC5E8', marginHorizontal: 26, marginBottom: 10, borderRadius: 10 },
  cardTitle: { color: '#fff', fontWeight: 'bold', fontSize: 20 },
  selectButton: { backgroundColor: '#fff', width: 70, padding: 5, borderRadius: 6, marginTop: 50 },
  image: { position: 'absolute', right: -15, bottom: 2, width: 50, height: 50 },
});
