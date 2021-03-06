import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import simple from 'simple-mock';

import ResourceSelectorModal from 'shared/modals/resource-selector';
import ResourceField from './ResourceField';

describe('shared/form-field/resource-field/ResourceField', () => {
  const defaults = {
    id: 'resource',
    controlProps: {
      allowedCateringProvider: { id: 78 },
      resource: { name: { fi: 'Room 123' } },
      timeRange: {
        begin: {},
        end: {},
      },
    },
    help: 'Tila on pakollinen.',
    hideSelector: () => null,
    label: 'Tila',
    showSelector: () => null,
    validationState: 'success',
  };

  function getWrapper(props) {
    return shallow(<ResourceField {...defaults} {...props} />);
  }

  it('renders div.resource-field', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.resource-field')).to.be.true;
  });

  describe('FormGroup', () => {
    function getFormGroupWrapper(props) {
      return getWrapper(props).find(FormGroup);
    }
    it('is rendered with correct props', () => {
      const wrapper = getFormGroupWrapper();
      expect(wrapper).to.have.length(1);
      expect(wrapper.prop('controlId')).to.equal(defaults.id);
      expect(wrapper.prop('onClick')).to.equal(defaults.showSelector);
      expect(wrapper.prop('validationState')).to.equal(defaults.validationState);
    });

    it('renders label', () => {
      const label = getFormGroupWrapper().find(ControlLabel);
      expect(label.children().text()).to.equal(defaults.label);
    });

    it('renders readonly input with resource name as value', () => {
      const control = getFormGroupWrapper().find(FormControl);
      expect(control.prop('value')).to.equal('Room 123');
      expect(control.prop('readOnly')).to.be.true;
    });

    it('renders readonly input with empty string as value if no resource', () => {
      const props = {
        controlProps: {
          ...defaults.controlProps,
          resource: null,
        },
      };
      const control = getFormGroupWrapper(props).find(FormControl);
      expect(control.prop('value')).to.equal('');
    });

    it('renders button for changing resource', () => {
      const button = getFormGroupWrapper().find(Button);
      expect(button.children().text()).to.equal('Vaihda tila');
    });

    it('renders button for selecting resource if no resource', () => {
      const controlProps = {
        ...defaults.controlProps,
        resource: null,
      };
      const button = getFormGroupWrapper({ controlProps }).find(Button);
      expect(button.children().text()).to.equal('Valitse tila');
    });

    it('renders help text', () => {
      const help = getFormGroupWrapper().find(HelpBlock);
      expect(help).to.have.length(1);
      expect(help.children().text()).to.equal(defaults.help);
    });
  });

  describe('ResourceSelectorModal', () => {
    function getModalWrapper(props) {
      return getWrapper(props).find(ResourceSelectorModal);
    }
    it('is rendered with correct props', () => {
      const modal = getModalWrapper();
      expect(modal).to.have.length(1);
      expect(modal.prop('onSelect')).to.be.a('function');
      expect(modal.prop('selectedResource')).to.deep.equal(
        defaults.controlProps.resource
      );
      expect(modal.prop('selectedTimeRange')).to.deep.equal(
        defaults.controlProps.timeRange
      );
      expect(modal.prop('allowedCateringProvider')).to.deep.equal(
        defaults.controlProps.allowedCateringProvider
      );
    });

    describe('onSelect call', () => {
      let modal;
      let hideSelector;
      let onChange;
      const resourceId = '123';

      before(() => {
        hideSelector = simple.mock();
        onChange = simple.mock();
        const props = {
          controlProps: {
            ...defaults.controlProps,
            onChange,
          },
          hideSelector,
        };
        modal = getModalWrapper(props);
        modal.prop('onSelect')(resourceId);
      });

      it('changes resource', () => {
        expect(onChange.callCount).to.equal(1);
        expect(onChange.lastCall.arg).to.equal(resourceId);
      });

      it('hides resource selector', () => {
        expect(hideSelector.callCount).to.equal(1);
      });
    });
  });
});
