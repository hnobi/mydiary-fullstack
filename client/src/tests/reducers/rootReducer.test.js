import rootReducer from '../../app/redux/reducers';
import newEntryReducer from '../../app/redux/reducers/newEntryReducer';
import { NEW_ENTRY_SAVE_INPUT, USER_LOGOUT } from '../../app/redux/constant/actionTypes';

describe('reducers', () => {
  it('logout resets every slice to its initial state', () => {
    const initial = rootReducer(undefined, { type: '@@INIT' });
    const dirty = {
      ...initial,
      entries: { allEntries: [{ id: 1 }], loading: false, error: null },
      loginData: { data: { id: 1 }, token: 't', status: 'success' }
    };
    expect(rootReducer(dirty, { type: USER_LOGOUT })).toEqual(initial);
  });

  it('saving input does not mutate the previous state', () => {
    const before = newEntryReducer(undefined, { type: '@@INIT' });
    const frozen = Object.freeze({ ...before, input: Object.freeze({ ...before.input }) });
    const after = newEntryReducer(frozen, {
      type: NEW_ENTRY_SAVE_INPUT, payload: { field: 'title', value: 'hello' }
    });
    expect(after.input.title).toBe('hello');
    expect(frozen.input.title).toBe('');
  });
});
