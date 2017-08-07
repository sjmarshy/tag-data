/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
/* eslint-disable no-console */

import 'isomorphic-fetch';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import range from 'lodash/range';
import last from 'lodash/last';
import padCharsStart from 'lodash/fp/padCharsStart';
import compose from 'lodash/fp/compose';
import styled from 'styled-components';

const inspect = x => {
    console.log(x); // eslint-disable-line no-undef
    return x;
};

const JSONRender = ({ children: data }) =>
    <div>
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>;

const parseDecimalInt = x => parseInt(x, 10);
const formatHH = x => format(x, 'HH');

const timestampToHourInt = compose(parseDecimalInt, formatHH, parseDecimalInt);

const StyledDay = styled.g`
    #day-background {
        fill: #cfd8dc;
    }
    &:hover #day-background {
        fill: #ff8a65;
    }
`;

const Day = ({
    children,
    position: pos,
    width,
    originX,
    originY,
    blipHeight,
}) =>
    <StyledDay width={width} height={24 * blipHeight}>
        <rect
            id="day-background"
            x={pos * width + originX}
            y={originY}
            width={width}
            height={24 * blipHeight}
        />

        <svg
            width={width}
            height={24 * blipHeight}
            x={pos * width + originX}
            y={originY}
        >
            {children}
        </svg>
    </StyledDay>;

const Blip = ({ width, timestamp, height, active }) =>
    <rect
        x={0}
        y={timestampToHourInt(timestamp) * height}
        width={width}
        height={height}
        fill={active ? '#fdd835' : '#f4511e'}
    />;

const dateFromCoordinates = (dates, colWidth, y) =>
    dates[Math.floor(y / colWidth) - 1];

const chunkIntoDays = data =>
    Object.keys(data).reduce((output, key) => {
        const date = format(parse(parseInt(key, 10)), 'YYYY-MM-DD');

        if (output.hasOwnProperty(date)) {
            output[date][key] = data[key];
        } else {
            output[date] = { [key]: data[key] };
        }

        return output;
    }, {});

// eslint-disable-next-line no-undef
export default class IndexPage extends React.Component {
    static async getInitialProps() {
        const res = await fetch('http://localhost:3000/static/data.json'); // eslint-disable-line no-undef
        const data = await res.json();

        return { data };
    }

    constructor() {
        super();

        this.state = {
            currentDay: '',
        };
    }

    setCurrentDay(date) {
        this.setState(() => ({
            currentDay: date,
        }));
    }

    render() {
        const { data } = this.props;
        const { currentDay } = this.state;

        const chunkedData = chunkIntoDays(data);
        const dates = Object.keys(chunkedData);

        const colNo = dates.length;
        const colWidth = 10;
        const blipHeight = 12;

        const graphOriginY = 10;
        const graphOriginX = 25;

        const height = 24 * blipHeight + graphOriginY; // hours in day vs how tall I want blips to be
        const width = colWidth * colNo + graphOriginX;
        return (
            <div>
                <p>
                    {this.state.currentDay}
                </p>
                <svg
                    height={height}
                    width={width}
                    onMouseOver={({ clientX }) =>
                        this.setCurrentDay(
                            dateFromCoordinates(
                                dates,
                                colWidth,
                                clientX - graphOriginX
                            )
                        )}
                >
                    <g>
                        {range(0, 24)
                            .map(padCharsStart('0', 2))
                            .map((str, pos) =>
                                <text
                                    key={str}
                                    y={(pos + 1) * blipHeight + graphOriginY}
                                >
                                    {str}
                                </text>
                            )}
                    </g>
                    <g>
                        {dates.map((date, i) =>
                            <Day
                                key={i}
                                position={i}
                                width={colWidth}
                                originX={graphOriginX}
                                originY={graphOriginY}
                                blipHeight={blipHeight}
                            >
                                {Object.keys(chunkedData[date]).map(timestamp =>
                                    <Blip
                                        key={timestamp}
                                        timestamp={timestamp}
                                        width={colWidth}
                                        height={blipHeight}
                                        active={currentDay === date}
                                    />
                                )}
                            </Day>
                        )}
                    </g>
                </svg>
                <JSONRender>
                    {last(
                        dates
                            .filter(date => date === currentDay)
                            .map(date => chunkedData[date])
                    )}
                </JSONRender>
            </div>
        );
    }
}
