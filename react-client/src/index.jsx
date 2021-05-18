import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Button, Card, ListGroup} from 'react-bootstrap';
import LoadButton from './components/LoadButton.jsx';
const axios = require('axios');
const { INFURA_ENDPOINT } = require('./config.js');


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blockNumber: '',
      miner: '',
      reward: '',
      difficulty: '',
      transactionCount: '',
      timeStamp: ''
    }

    this.handleClick = this.handleClick.bind(this);
  }


  componentDidMount() {
    axios.post(INFURA_ENDPOINT, {
      jsonrpc: "2.0",
      id: 1,
      method: "eth_getBlockByNumber",
      params: [
        "latest", // latest block
        true  // retrieves the full transaction object in transactions array
      ]
    }).then((response) => {
      console.log(response.data);
      this.setState({blockNumber: parseInt(response.data.result.number)})
      this.setState({miner: response.data.result.miner})
      this.setState({reward: parseInt(response.data.result.gasUsed)})
      this.setState({transactionCount: response.data.result.transactions.length})
      this.setState({difficulty: response.data.result.difficulty})

      let unix_timestamp = parseInt(response.data.result.timestamp);
      // Create a new JavaScript Date object based on the timestamp
      // multiplied by 1000 so that the argument is in milliseconds, not seconds.
      let date = new Date(unix_timestamp * 1000).toString();
      this.setState({timeStamp: date});
    })
  }


  handleClick() {
    window.location.reload(true);
  }

  render () {
    return (
  <div>
    <Container fluid="xl">
      <Button variant="primary" size="lg" onClick={this.handleClick}>
      Refresh Latest Block
      </Button>
    </Container>
    <Container>
    <Card >
      <Card.Img variant="top" src="https://solidity-es.readthedocs.io/es/latest/_images/logo.svg" height="108"/>
      <Card.Body>
        <Card.Title>Block #{this.state.blockNumber} </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Mined by {this.state.miner} </Card.Subtitle>
        <Card.Subtitle className="mb-2 text-muted">Mined on {this.state.timeStamp} </Card.Subtitle>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the bulk of
          the card's content.
        </Card.Text> */}
        <ListGroup variant="flush">
          <ListGroup.Item>Gas Used: {this.state.reward} </ListGroup.Item>
          <ListGroup.Item>Difficulty: {this.state.difficulty}</ListGroup.Item>
          <ListGroup.Item>Total Transactions: {this.state.transactionCount}</ListGroup.Item>
       </ListGroup>
      </Card.Body>
    </Card>
</Container>

  </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));