import Immutable from 'seamless-immutable';

import {
  changeColumnOrder,
} from './reducers';

describe('TableColumnReordering reducers', () => {
  describe('#changeColumnOrder', () => {
    const order = ['a', 'b', 'c'];
    const payload = { sourceColumnName: 'a', targetColumnName: 'b' };

    it('should work', () => {
      const nextOrder = changeColumnOrder(order, payload);

      expect(nextOrder).toEqual(['b', 'a', 'c']);
    });

    it('should work with immutable order', () => {
      const nextOrder = changeColumnOrder(Immutable(order), payload);

      expect(nextOrder).toEqual(['b', 'a', 'c']);
    });
  });
});
