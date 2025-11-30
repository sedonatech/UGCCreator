/**
 * @format
 */

import React from 'react';
import App from '../App';
import ReactTestRenderer from 'react-test-renderer';

// Note: test renderer must be required after react-native.

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
