import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {ScrollView, RectButton} from 'react-native-gesture-handler';
import _ from 'lodash';

import {RegularText, SemiBoldText, BoldText} from '../components/StyledText';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import SaveIconWhenSaved from '../components/SaveIconWhenSaved';
import {convertUtcDateToEventTimezoneHour} from '../utils';
import {withData} from '../context/DataContext';

function ScheduleRow(props) {
  const {item} = props;

  const _handlePress = () => {
    props.onPress && props.onPress(props.item);
  };

  const content = (
    <View style={[styles.row, item.talk && styles.rowStatic]}>
      <BoldText>
        <SaveIconWhenSaved talk={item} />
        {item.title}
      </BoldText>

      {item.speakers
        ? item.speakers.map(speaker => (
            <SemiBoldText key={speaker.id + item.title}>
              {speaker.name}
            </SemiBoldText>
          ))
        : null}
      <RegularText>{item.room}</RegularText>
    </View>
  );

  return (
    <RectButton
      activeOpacity={0.05}
      onPress={_handlePress}
      style={{flex: 1, backgroundColor: '#fff'}}>
      {content}
    </RectButton>
  );
}

function ScheduleDay(props) {
  const schedule = _.find(
    props.event.groupedSchedule,
    schedule => schedule.title === props.route.params.day
  );
  const slotsByTime = _.groupBy(schedule.slots, slot => slot.startDate);
  const slotsData = _.map(slotsByTime, (data, time) => {
    return {data, title: convertUtcDateToEventTimezoneHour(time)};
  });

  const _renderSectionHeader = ({section}) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText>{section.title}</RegularText>
      </View>
    );
  };

  const _renderItem = ({item}) => {
    return <ScheduleRow item={item} onPress={_handlePressRow} />;
  };

  const _handlePressRow = item => {
    props.navigation.navigate('Details', {
      scheduleSlot: item,
    });
  };

  return (
    <LoadingPlaceholder>
      <SectionList
        renderScrollComponent={props => <ScrollView {...props} />}
        stickySectionHeadersEnabled={true}
        renderItem={_renderItem}
        renderSectionHeader={_renderSectionHeader}
        sections={slotsData}
        keyExtractor={item => _.snakeCase(item.title)}
        initialNumToRender={10}
      />
    </LoadingPlaceholder>
  );
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
  },
  rowStatic: {
    backgroundColor: '#f5f5f5',
    opacity: 0.5,
  },
  sectionHeader: {
    paddingHorizontal: 10,
    paddingTop: 7,
    paddingBottom: 5,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default withData(ScheduleDay);
