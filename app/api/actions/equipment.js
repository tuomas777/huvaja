import schemas from './schemas';
import createApiAction from './createApiAction';

function fetchEquipment() {
  return createApiAction({
    endpoint: 'equipment',
    params: { pageSize: 100 },
    method: 'GET',
    type: 'EQUIPMENT',
    options: { schema: schemas.paginatedEquipmentSchema },
  });
}

export {
  fetchEquipment,  // eslint-disable-line import/prefer-default-export
};