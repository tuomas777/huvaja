import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import { Field, reduxForm } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';
import CateringMenu from './CateringMenu';
import CateringOrderTable from '../CateringOrderTable';

const requiredFields = [
  'invoicingData',
];

function hasOrders(values) {
  if (!values.order) return false;
  const quantities = Object.values(values.order);
  const total = quantities.reduce(
    (sum, value) => sum + parseInt(value, 10) || 0,
    0,
  );
  return total > 0;
}

export function validate(values) {
  if (!hasOrders(values)) return {};
  const errors = {};
  requiredFields.forEach((value) => {
    if (!values[value]) {
      errors[value] = 'Pakollinen tieto';
    }
  });
  return errors;
}

function renderField(name, type, label, controlProps) {
  const required = requiredFields.indexOf(name) !== -1;
  return (
    <Field
      component={ReduxFormField}
      controlProps={controlProps}
      label={`${label}${required ? '*' : ''}`}
      name={name}
      type={type}
    />
  );
}

UnconnectedCateringForm.propTypes = {
  addOrRemoveItem: PropTypes.func.isRequired,
  cateringMenu: PropTypes.array.isRequired,
  formValues: PropTypes.object.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  initialized: PropTypes.bool.isRequired,
  orderItems: PropTypes.array.isRequired,
  priceListUrl: PropTypes.string,
  updateOrder: PropTypes.func.isRequired,
};
export function UnconnectedCateringForm(props) {
  // If form was rendered before being initialized, fields would not have
  // correct initial values on the first render which would cause warning
  // about uncontrolled input changing to controlled input.
  if (!props.initialized) return <div />;

  return (
    <form className="catering-form" onSubmit={props.handleSubmit} >
      <Row>
        <Col xs={12} sm={6} md={6}>
          {renderField(
            'time',
            'time',
            'Tarjoiluaika',
            { step: 5 * 60, value: props.formValues.time }
          )}
          {renderField(
            'invoicingData',
            'text',
            'Projektinumero (laskutustieto)',
            { value: props.formValues.invoicingData },
          )}
          {renderField(
            'message',
            'textarea',
            'Viesti tarjoilun toimittajalle',
            { rows: 7, value: props.formValues.message },
          )}
        </Col>
        <Col xs={12} sm={6} md={6}>
          <h3>Tarjoiluvaihtoehdot</h3>
          <p>
            Poimi haluamasi Tarjoiluvaihtoehdot.
            Alempana kohdassa tilaus pääset muokkaamaan valittujen tuotteiden kappalemääriä.
          </p>
          {props.priceListUrl &&
            <a
              className="pricing-link"
              href={props.priceListUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Hinnasto
            </a>
          }
          <CateringMenu
            categories={props.cateringMenu}
            onItemClick={props.addOrRemoveItem}
            order={props.formValues.order}
          />
        </Col>
      </Row>
      <h3>Tilaus</h3>
      {props.orderItems.length
        ? <CateringOrderTable editOrder={props.updateOrder} items={props.orderItems} />
        : <div>Ei tilausta</div>
      }
      <div className="form-controls">
        <Button
          className="cancel-button"
          onClick={props.handleCancel}
          type="button"
        >
          Peruuta
        </Button>
        <Button
          bsStyle="primary"
          className="save-button"
          type="submit"
        >
          Valmis
        </Button>
      </div>
    </form>
  );
}

export default reduxForm({
  form: 'catering',
  validate,
})(UnconnectedCateringForm);