import React from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {ScrollView, RectButton} from 'react-native-gesture-handler';
import _ from 'lodash';

import {RegularText, SemiBoldText, BoldText} from '../components/StyledText';
import LoadingPlaceholder from '../components/LoadingPlaceholder';
import {Colors, Layout} from '../constants';
import MenuButton from '../components/MenuButton';
import SaveIconWhenSaved from '../components/SaveIconWhenSaved';
import {convertUtcDateToEventTimezoneHour} from '../utils';

class ScheduleRow extends React.Component {
  render() {
    const {item} = this.props;

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
        onPress={this._handlePress}
        style={{flex: 1, backgroundColor: '#fff'}}>
        {content}
      </RectButton>
    );
  }

  _handlePress = () => {
    this.props.onPress && this.props.onPress(this.props.item);
  };
}

export default function ScheduleDay(options) {
  // const schedule = FullSchedule[0]
  class ScheduleDayComponent extends React.Component {
    constructor(props) {
      super(props);

      const event = this.props.screenProps.event;
      const FullSchedule = event.groupedSchedule;
      const schedule = _.find(
        FullSchedule,
        schedule => schedule.title === options.day
      );

      const slotsByTime = _.groupBy(schedule.slots, slot => slot.startDate);
      this.slotsData = _.map(slotsByTime, (data, time) => {
        return {data, title: convertUtcDateToEventTimezoneHour(time)};
      });
    }
    render() {
      return (
        <LoadingPlaceholder>
          <SectionList
            renderScrollComponent={props => <ScrollView {...props} />}
            stickySectionHeadersEnabled={true}
            renderItem={this._renderItem}
            renderSectionHeader={this._renderSectionHeader}
            sections={this.slotsData}
            keyExtractor={item => _.snakeCase(item.title)}
            initialNumToRender={10}
          />
        </LoadingPlaceholder>
      );
    }

    _renderSectionHeader = ({section}) => {
      return (
        <View style={styles.sectionHeader}>
          <RegularText>{section.title}</RegularText>
        </View>
      );
    };

    _renderItem = ({item}) => {
      return <ScheduleRow item={item} onPress={this._handlePressRow} />;
    };

    _handlePressRow = item => {
      this.props.navigation.navigate('Details', {scheduleSlot: item});
    };
  }

  return ScheduleDayComponent;

  // return StackNavigator(
  //   {
  //     Day: {
  //       screen: ScheduleDayComponent
  //     }
  //   },
  //   {
  //     cardStyle: {
  //       backgroundColor: '#fafafa'
  //     },
  //     navigationOptions: {
  //       headerTitleStyle: {
  //         fontFamily: 'open-sans-bold'
  //       }
  //     }
  //   }
  // )
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
