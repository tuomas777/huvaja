import classNames from 'classnames';
import moment from 'moment';
import React, { PropTypes } from 'react';
import Sticky from 'react-sticky-el';

import { slotSize, slotWidth } from 'shared/availability-view';
import AvailabilityTimelineContainer from './AvailabilityTimeline';
import utils from './utils';

function getHourRanges(date) {
  const ranges = [];
  const current = moment(date);
  const end = moment(date).add(1, 'day');
  while (current.isBefore(end)) {
    ranges.push({ startTime: current.clone(), endTime: current.clone().add(1, 'hour') });
    current.add(1, 'hour');
  }
  return ranges;
}

export default class TimelineGroup extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    date: PropTypes.string.isRequired,
    excludeReservation: PropTypes.number,
    noStickyHours: PropTypes.bool,
    onAvailabilityViewMouseEnter: PropTypes.func,
    onAvailabilityViewMouseLeave: PropTypes.func,
    onReservationSlotClick: PropTypes.func,
    onReservationSlotMouseDown: PropTypes.func,
    onReservationSlotMouseEnter: PropTypes.func,
    onReservationSlotMouseUp: PropTypes.func,
    resources: PropTypes.arrayOf(PropTypes.string).isRequired,
    selection: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.setElement = this.setElement.bind(this);
    this.updateTime = this.updateTime.bind(this);
    this.state = { timeOffset: this.getTimeOffset() };
  }

  componentDidMount() {
    this.updateTimeInterval = window.setInterval(this.updateTime, 60000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.date !== nextProps.date) {
      this.setState({ timeOffset: this.getTimeOffset(nextProps) });
    }
  }

  componentWillUnmount() {
    window.clearInterval(this.updateTimeInterval);
    this.updateTimeInterval = null;
  }

  getTimeOffset(props = this.props) {
    const now = moment();
    const isToday = now.isSame(props.date, 'day');
    if (!isToday) return null;
    const offsetMinutes = now.diff(props.date, 'minutes');
    const offsetPixels = (offsetMinutes / slotSize) * slotWidth;
    return offsetPixels;
  }

  setElement(element) {
    this.element = element;
  }

  scrollTo(pixels) {
    if (this.element) this.element.scrollLeft = pixels;
  }

  updateTime() {
    const timeOffset = this.getTimeOffset();
    if (timeOffset !== this.state.timeOffset) {
      this.setState({ timeOffset });
    }
  }

  render() {
    const hours = (
      <div className="hours">
        {getHourRanges(this.props.date).map(range =>
          <div
            className="hour"
            key={range.startTime.format('HH')}
            style={{ width: utils.getTimeSlotWidth(range) }}
          >
            {range.startTime.format('HH:mm')}
          </div>
        )}
      </div>
    );
    return (
      <div
        className={classNames('timeline-group', this.props.className)}
        ref={this.setElement}
      >
        {this.state.timeOffset && (
          <div
            className="timeline-group-current-time"
            style={{ left: this.state.timeOffset }}
          />
        )}
        {this.props.noStickyHours ? hours : <Sticky>{hours}</Sticky>}
        {this.props.resources.map(resource =>
          <AvailabilityTimelineContainer
            date={this.props.date}
            excludeReservation={this.props.excludeReservation}
            id={resource}
            key={resource}
            onMouseEnter={this.props.onAvailabilityViewMouseEnter}
            onMouseLeave={this.props.onAvailabilityViewMouseLeave}
            onReservationSlotClick={this.props.onReservationSlotClick}
            onReservationSlotMouseDown={this.props.onReservationSlotMouseDown}
            onReservationSlotMouseEnter={this.props.onReservationSlotMouseEnter}
            onReservationSlotMouseUp={this.props.onReservationSlotMouseUp}
            selection={this.props.selection}
          />
        )}
      </div>
    );
  }
}
