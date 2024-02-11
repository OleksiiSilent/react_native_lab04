import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';
import {MachineItem} from './models';

const tableName = 'cncMachineData2';
enablePromise(true);

export const getDbConnection = async () => {
  return openDatabase({name: 'machine', location: 'default'});
};

export const createTable = async (db: SQLiteDatabase) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(machine_type TEXT, model TEXT, feature TEXT, price REAL);`;

  await db.executeSql(query);
};

export const getMachineItems = async (
  db: SQLiteDatabase,
): Promise<MachineItem[]> => {
  console.info('Getting machines from db...');
  try {
    const machineItems: MachineItem[] = [];
    const results = await db.executeSql(
      `SELECT rowid as id, machine_type, model, feature,  price FROM ${tableName}`,
    );
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        console.log(result.rows.item(index));
        machineItems.push(result.rows.item(index));
      }
    });
    return machineItems;
  } catch (error) {
    console.error(`Error while getting Machine Item: ${error}`);
    throw new Error(`Error while getting Machine Item: ${error}`);
  }
};

export const saveMachineItems = async (
  db: SQLiteDatabase,
  machineItems: MachineItem[],
) => {
  console.info('Saving machines into db...');
  machineItems.forEach(item =>
    console.info(
      `item is: ${item.id}, ${item.machine_type}, ${item.model}, ${item.feature}, ${item.price}`,
    ),
  );

  const machineItemsString = machineItems
    .map(
      i =>
        `(${i.id}, '${i.machine_type}',  '${i.model}', '${i.feature}', ${i.price})`,
    )
    .join(',');
  const insertQuery = `INSERT OR REPLACE INTO ${tableName}(rowid, machine_type, model, feature,  price) VALUES ${machineItemsString}`;

  console.info(`Query is: ${insertQuery}`);
  const result = await db.executeSql(insertQuery);
  console.log(`Some result of: ${result.toString()}`);
  return result;
};

export const deleteMachineItem = async (db: SQLiteDatabase, itemId: number) => {
  const deleteQuery = `DELETE FROM ${tableName} WHERE rowid = ${itemId}'`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async (db: SQLiteDatabase) => {
  const query = `DROP table ${tableName}`;
  await db.executeSql(query);
};
