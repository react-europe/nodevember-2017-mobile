import {AntDesign} from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import React, {useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';

type DateTimePickerProps = {
  date: Date;
  setDate: (date: Date) => void;
};

export default function DateTimePicker(props: DateTimePickerProps) {
  const {date, setDate} = props;
  const [mode, setMode] = useState<'date' | 'time'>('date');
  const [show, setShow] = useState(false);

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate || date;
    console.log('New date: ', currentDate);
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = (currentMode: 'date' | 'time') => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  return (
    <View>
      <View style={{flexDirection: 'row'}}>
        <AntDesign
          name="calendar"
          size={24}
          color="black"
          onPress={showDatepicker}
          style={styles.icon}
        />
        <AntDesign
          name="clockcircleo"
          size={24}
          color="black"
          onPress={showTimepicker}
          style={styles.icon}
        />
      </View>
      {show && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 4,
  },
});
