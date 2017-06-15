import React, { Component, PropTypes } from 'react';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';

class ServingTimeField extends Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    controlProps: PropTypes.object,
    label: PropTypes.string,
    type: PropTypes.string,
  }

  constructor(props) {
    super(props);
    this.state = {
      enabledCustomTime: Boolean(props.input.value),
    };
  }

  disableCustomTime = () => {
    this.props.input.onChange('');
    this.setState({
      enabledCustomTime: false,
    });
  }

  enableCustomTime = () => {
    this.setState({
      enabledCustomTime: true,
    });
  }

  render() {
    return (
      <div className="serving-time-field">
        <div className="form-group">
          <ControlLabel>
            {this.props.label}
          </ControlLabel>
          <div>
            <input
              defaultChecked={!this.state.enabledCustomTime}
              id="serving-reservation-time"
              type="radio"
              name="customTime"
              onClick={this.disableCustomTime}
            />
            <label className="radio-label" htmlFor="serving-reservation-time">
              Varauksen alkamisaika
            </label>
          </div>
          <div>
            <input
              defaultChecked={this.state.enabledCustomTime}
              type="radio"
              id="serving-custom-time"
              name="customTime"
              onClick={this.enableCustomTime}
            />
            <label className="radio-label" htmlFor="serving-custom-time">Klo</label>
            <FormControl
              {...this.props.input}
              {...this.props.controlProps}
              className="serving-time-form-control"
              disabled={!this.state.enabledCustomTime}
              id="servingTime"
              type={this.props.type}
            />
          </div>
        </div>
      </div>
    );
  }
}


export default ServingTimeField;