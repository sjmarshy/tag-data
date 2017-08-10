import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';

import RawJSONRender from './';

test('RawJSONRender renders', t => {
    const jsonRendered = shallow(
        <RawJSONRender>
            {{ hi: 'world' }}
        </RawJSONRender>
    );

    t.true(jsonRendered.exists());
});
