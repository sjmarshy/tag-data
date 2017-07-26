import 'isomorphic-fetch'

const JSONRender = ({ children: data }) =>
    <div>
        <pre>
            {JSON.stringify(data, null, 2)}
        </pre>
    </div>

export default class IndexPage extends React.Component {
    static async getInitialProps() {
        const res = await fetch('http://localhost:3000/static/data.json')
        const data = await res.json()

        return { data }
    }

    render() {
        return (
            <JSONRender>
                {this.props.data}
            </JSONRender>
        )
    }
}
