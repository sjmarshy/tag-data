/* eslint-disable react/react-in-jsx-scope */
import PropTypes from 'prop-types';

const JSONRender = ({ children: data }) =>
    <div>
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>;

JSONRender.propTypes = {
    children: PropTypes.oneOf(PropTypes.array, PropTypes.object),
};

export default JSONRender;
