/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {MachineItem} from './models';
import {
  createTable,
  getDbConnection,
  getMachineItems,
  saveMachineItems,
} from './db-service.ts';
import {MachineItemComponent} from './components/machineItem.tsx';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [machineItems, setMachineItems] = useState<MachineItem[]>([]);
  const [newMachineType, setNewMachineType] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const loadDataCallback = useCallback(async () => {
    try {
      const initMachineItems: MachineItem[] = [
        {
          id: 0,
          machine_type: 'Vertical Mills',
          model: 'VF-1',
          feature: 'speed mill',
          price: 15486,
        },
        {
          id: 1,
          machine_type: 'Vertical Mills',
          model: 'VF-2',
          feature: 'speed mill',
          price: 18946,
        },
      ];
      const db = await getDbConnection();
      await createTable(db);
      const storedMachineItems = await getMachineItems(db);
      if (storedMachineItems.length) {
        console.info('SET machine items');
        setMachineItems(storedMachineItems);
      } else {
        console.info('Save machine items');
        initMachineItems.forEach(item =>
          console.info(
            `item is: ${item.id}, ${item.machine_type},${item.model},${item.feature},${item.price}`,
          ),
        );
        await saveMachineItems(db, initMachineItems);
        setMachineItems(initMachineItems);
      }
    } catch (error) {
      console.log(`Error while load data callback: ${error}`);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  const addMachineItem = async () => {
    if (!newMachineType.trim()) {
      return;
    }
    if (!newModel.trim()) {
      return;
    }
    if (!newPrice.trim()) {
      return;
    }
    try {
      const newMachineItems = [
        ...machineItems,
        {
          id: machineItems.length
            ? machineItems.reduce((acc, cur) => {
                if (cur.id > acc.id) {
                  return cur;
                }
                return acc;
              }).id + 1
            : 0,
          machine_type: newMachineType,
          model: newModel,
          feature: newFeature,
          price: parseFloat(newPrice),
        },
      ];
      setMachineItems(newMachineItems);
      const db = await getDbConnection();
      await saveMachineItems(db, machineItems);
      // clean up fields
      setNewMachineType('');
      setNewModel('');
      setNewFeature('');
      setNewPrice('');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentInsetAdjustmentBehavior={'automatic'}>
        <View style={styles.appTitleView}>
          <Text style={styles.appTitleText}>CNC machine list</Text>
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={newMachineType}
            onChangeText={text => setNewMachineType(text)}
          />
          <TextInput
            style={styles.textInput}
            value={newModel}
            onChangeText={text => setNewModel(text)}
          />
          <TextInput
            style={styles.textInput}
            value={newFeature}
            onChangeText={text => setNewFeature(text)}
          />
          <TextInput
            style={styles.textInput}
            value={newPrice}
            onChangeText={text => setNewPrice(text)}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title={'Додати до списку'}
            onPress={addMachineItem}
            color={'#d0b783'}
            accessibilityLabel={'Add machine item'}
          />
        </View>
        <View>
          {machineItems.map(item => (
            <MachineItemComponent
              id={item.id}
              machine_type={item.machine_type}
              model={item.model}
              feature={item.feature}
              price={item.price}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appTitleView: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  appTitleText: {
    fontSize: 24,
    fontWeight: '800',
  },
  textInputContainer: {
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 5,
    height: 38,
    margin: 10,
    fontSize: 16,
    fontWeight: '400',
    backgroundColor: '#bcd2d0',
  },
});

export default App;
