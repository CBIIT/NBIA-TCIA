import { DynamicCriteriaQueryPart } from './dynamic-criteria-query-part';
import { WIDGET_TYPE } from '@app/tools/query-section-module/dynamic-query-criteria/widget/widget.component';

describe('DynamicCriteriaQueryPart', () => {
  it('should create an instance', () => {
    expect(new DynamicCriteriaQueryPart( WIDGET_TYPE.UNKNOWN, ['x'], 'x', 'x', 'x')).toBeTruthy();
  });
});
