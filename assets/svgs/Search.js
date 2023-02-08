import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import PropTypes from 'prop-types';

function Search({height, width, ...props}) {
  return (
    <Svg
      width={height}
      height={width}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.804 1.5c4.028 0 7.304 3.276 7.304 7.303 0 1.9-.73 3.634-1.923 4.934l2.348 2.344a.562.562 0 11-.795.796l-2.376-2.37a7.268 7.268 0 01-4.558 1.6c-4.027 0-7.304-3.276-7.304-7.303C1.5 4.776 4.777 1.5 8.804 1.5zm0 1.125a6.186 6.186 0 00-6.179 6.178 6.186 6.186 0 006.18 6.18 6.186 6.186 0 006.178-6.18 6.185 6.185 0 00-6.179-6.178z"
        fill="#78828A"
      />
    </Svg>
  );
}

Search.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

Search.defaultProps = {
  height: 18,
  width: 18,
};

export default Search;
