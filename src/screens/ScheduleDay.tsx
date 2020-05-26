import _ from 'lodash';
import React, {useContext} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {ScrollView, RectButton} from 'react-native-gesture-handler';

import LinkButton from '../components/LinkButton';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {RegularText, SemiBoldText, BoldText} from '../components/StyledText';
import DataContext from '../context/DataContext';
import {Schedule, ScheduleDay as ScheduleDayType} from '../typings/data';
import {ScheduleDayProps} from '../typings/navigation';
import {SectionHeaderProps} from '../typings/utils';
import {convertUtcDateToEventTimezoneHour} from '../utils';

type ScheduleRowProps = {
  item: Schedule;
};

function ScheduleRow(props: ScheduleRowProps) {
  const {item} = props;

  const content = (
    <View style={[styles.row, item.talk && styles.rowStatic]}>
      <BoldText fontSize="sm">
        {/* <SaveIconWhenSaved talk={item} />  TODO (Handle save talk )*/}
        {item.title}
      </BoldText>

      {item.speakers
        ? item.speakers.map((speaker, index) => (
            <SemiBoldText key={index} fontSize="sm">
              {speaker?.name ? speaker.name : ''}
            </SemiBoldText>
          ))
        : null}
      <RegularText>{item.room}</RegularText>
    </View>
  );

  return (
    <LinkButton to={'/details?scheduleId=' + item.id}>
      <RectButton
        activeOpacity={0.05}
        style={{flex: 1, backgroundColor: '#fff'}}>
        {content}
      </RectButton>
    </LinkButton>
  );
}

export default function ScheduleDay(props: ScheduleDayProps) {
  const {event} = useContext(DataContext);
  const schedule: ScheduleDayType | null | undefined = _.find(
    event?.groupedSchedule,
    (schedule) => {
      if (schedule?.title) {
        return schedule.title === props.route.params.day;
      }
      return false;
    }
  );
  let slotsByTime: _.Dictionary<Schedule[]> | null = null;
  if (schedule?.slots) {
    slotsByTime = _.groupBy(schedule.slots, (slot) =>
      slot?.startDate ? slot.startDate : ''
    ) as _.Dictionary<Schedule[]>;
  }
  const slotsData = _.map(slotsByTime, (data, time) => {
    return {data, title: convertUtcDateToEventTimezoneHour(time)};
  });

  const _renderSectionHeader = ({section}: SectionHeaderProps<Schedule>) => {
    return (
      <View style={styles.sectionHeader}>
        <RegularText fontSize="sm">{section.title}</RegularText>
      </View>
    );
  };

  const _renderItem = ({item}: {item: Schedule}) => {
    return <ScheduleRow item={item} />;
  };

  return (
    <LoadingPlaceholder>
      <SectionList
        renderScrollComponent={(props) => <ScrollView {...props} />}
        stickySectionHeadersEnabled
        renderItem={_renderItem}
        renderSectionHeader={_renderSectionHeader}
        sections={slotsData}
        keyExtractor={(item) => _.snakeCase(item?.title ? item.title : '')}
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
