import 'isomorphic-fetch'
import format from 'date-fns/format'
import parse from 'date-fns/parse'

const JSONRender = ({ children: data }) =>
    <div>
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>

const chunkIntoDays = data =>
    Object.keys(data).reduce((output, key) => {
        const date = format(parse(parseInt(key, 10)), 'YYYY-MM-DD')

        if (output.hasOwnProperty(date)) {
            output[date][key] = data[key]
        } else {
            output[date] = { [key]: data[key] }
        }

        return output
    }, {})

export default class IndexPage extends React.Component {
    static async getInitialProps() {
        const res = await fetch('http://localhost:3000/static/data.json')
        const data = await res.json()

        return { data }
    }

    constructor() {
        super()

        this.state = {
            currentDay: '',
        }
    }

    setCurrentDay(date) {
        this.setState(() => ({
            currentDay: date,
        }))
    }

    render() {
        const { data } = this.props
        const { currentDay } = this.state

        const chunkedData = chunkIntoDays(data)
        return (
            <div>
                <p>
                    {this.state.currentDay}
                </p>
                <svg height={24 * 12} width={Object.keys(chunkedData).length * 13}>
                    <g>
                        {Object.keys(chunkedData).map((date, i) =>
                            <rect
                                onMouseOver={() => this.setCurrentDay(date)}
                                key={i}
                                x={i * 13}
                                y={0}
                                width={12}
                                height={24 * 12}
                                fill={currentDay === date ? 'red' : 'black'}
                            />
                        )}

                        {Object.keys(chunkedData).map((date, i) =>
                            Object.keys(chunkedData[date]).map(ts =>
                                <rect
                                    key={ts}
                                    x={i * 13}
                                    y={parseInt(format(parse(parseInt(ts, 10)), 'HH'), 10) * 12}
                                    width={10}
                                    height={10}
                                    fill="green"
                                />
                            )
                        )}
                    </g>
                </svg>
                <JSONRender>
                    {chunkedData}
                </JSONRender>
            </div>
        )
    }
}
