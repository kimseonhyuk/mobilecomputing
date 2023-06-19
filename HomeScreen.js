import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

const medicines = [
  { name: 'Medicine 1', time: '8:00 AM' },
  { name: 'Medicine 2', time: '12:00 PM' },
  { name: 'Medicine 3', time: '6:00 PM' },
];

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', marginTop: 16 }}>
        Medicine List
      </Text>
      <FlatList
        data={medicines}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <ListItem title={item.name} subtitle={item.time} bottomDivider />
        )}
      />
    </View>
  );
}
