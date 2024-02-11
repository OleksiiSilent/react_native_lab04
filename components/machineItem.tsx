import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MachineItem} from '../models';

export const MachineItemComponent: React.FC<MachineItem> = ({
  machine_type,
  model,
  feature,
  price,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.sectionTitle}>Тип: {machine_type}</Text>
        <Text style={styles.sectionTitle}>Модель: {model}</Text>
        <Text style={styles.sectionTitle}>Особливості: {feature}</Text>
        <Text style={styles.sectionTitle}>Ціна $: {price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginTop: 10,
    paddingHorizontal: 24,
    backgroundColor: '#bcd2d0',
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  itemTextContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
  },
});
