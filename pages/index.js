import 'isomorphic-fetch';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import styled from 'styled-components';
import range from 'lodash/range';
import last from 'lodash/last';

const JSONRender = ({ children: data }) =>
    <div>
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>;

const inspect = x => {
    console.log(x);
    return x;
};

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

export default class IndexPage extends React.Component {
    static async getInitialProps() {
        const res = await fetch('http://localhost:3000/static/data.json');
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
        const colWidth = 10;
        return (
            <div>
                <p>
                    {this.state.currentDay}
                </p>
                <svg
                    height={24 * colWidth}
                    width={dates.length * colWidth}
                    onMouseOver={e =>
                        this.setCurrentDay(
                            dateFromCoordinates(
                                Object.keys(chunkedData),
                                colWidth,
                                e.clientX
                            )
                        )}
                >
                    <g>
                        {Object.keys(chunkedData).map((date, i) =>
                            <rect
                                key={i}
                                x={i * colWidth}
                                y={0}
                                width={colWidth}
                                height={24 * colWidth}
                                fill={
                                    currentDay === date ? '#FF8A65' : '#CFD8DC'
                                }
                            />
                        )}

                        {Object.keys(chunkedData).map((date, i) =>
                            Object.keys(chunkedData[date]).map(ts =>
                                <rect
                                    key={ts}
                                    x={i * colWidth}
                                    y={
                                        parseInt(
                                            format(
                                                parse(parseInt(ts, 10)),
                                                'HH'
                                            ),
                                            10
                                        ) * colWidth
                                    }
                                    width={colWidth}
                                    height={10}
                                    fill={
                                        currentDay === date
                                            ? '#FDD835'
                                            : '#F4511E'
                                    }
                                />
                            )
                        )}
                    </g>
                </svg>
                <JSONRender>
                    {Object.keys(chunkedData)
                        .filter(date => date === currentDay)
                        .map(date => chunkedData[date])}
                </JSONRender>
            </div>
        );
    }
}
