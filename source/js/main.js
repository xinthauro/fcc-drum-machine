// Drum Pad
const ButtonPad = props => {
  return (
    <div className={props.className}>
      <button onClick={props.onClick} id={`btn-${props.value.key}`} className='btn btn-lg btn-block btn-secondary my-2 drum-pad'>
        <audio src={props.value.source} id={props.value.key} className='clip' />
        {props.value.key}
      </button>
    </div>
  );
}

class DrumPad extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
  }

  componetWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }

  handleClick(event) {
    // Send display text to parent
    const displayText = this.props.bank.filter(v => v.key === event.target.firstChild.id).map(v => v.display).toString();
    this.props.sendDisplayText(displayText);
    // Plays clip associated with the button
    event.target.firstChild.play();
  }

  handleKeyPress(event) {
    const key = event.key.toUpperCase();
    switch(key) {
      case 'Q':
      case 'W':
      case 'E':
      case 'A':
      case 'S':
      case 'D':
      case 'Z':
      case 'X':
      case 'C':
        const clip = document.getElementById(key).parentElement;
        clip.click();
        clip.focus();
        break;
      default:
        break;
    } 
  }

  render() {
    const buttons = this.props.bank.map(v => <ButtonPad onClick={this.handleClick} value={v} className='col-4' />);
    return (
      <div className='row'>
        {buttons}
      </div>
    );
  }
}

// Drum Control
class DrumControl extends React.Component {
  constructor(props) {
    super(props);
  
    this.state = {
      selectedBank: 'Bank One'
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const idClicked = event.target.id;
    if (idClicked === 'bank-one') {
      $('#l-bank-one').addClass('active');
      $('#l-bank-two').removeClass('active');
    } else {
      $('#l-bank-one').removeClass('active');
      $('#l-bank-two').addClass('active');
    }
    this.props.handleBankChange(event.target.value);
    this.setState({
      selectedBank: event.target.value
    });
  }

  render() {
    return (
        <div style={{height: '100%'}} className='d-flex flex-column justify-content-around'>
          <h3 id='display' className='text-center text-info border rounded py-2 my-1'>{this.props.display !== ''? this.props.display: <i className='fas fa-signature'></i>}</h3>
          <div className='btn-group btn-block btn-group-toggle'>
            <label className='btn btn-success active' id='l-bank-one'>
              Bank One
              <input onChange={this.handleChange} checked={this.state.selectedBank === 'Bank One'} type='radio' autocomplete='off' name='bank' value='Bank One' id='bank-one' />
            </label>
            <label className='btn btn-danger' id='l-bank-two'>
              Bank Two
              <input onChange={this.handleChange} checked={this.state.selectedBank === 'Bank Two'} type='radio' autocomplete='off' name='bank' value='Bank Two' id='bank-two' />
            </label>
          </div>
        </div>
    );
  }
}

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayText: '',
      bank: bankOne
    };

    this.retrieveDisplayText = this.retrieveDisplayText.bind(this);
    this.handleBankChange = this.handleBankChange.bind(this);
  }

  retrieveDisplayText(dataFromChild) {
    this.setState({
      displayText: dataFromChild
    });
  }

  handleBankChange(dataFromChild) {
    const newBank = dataFromChild === 'Bank One'? bankOne: bankTwo;
    this.setState({
      bank: newBank
    });
  }

  render() {
    return (
      <div className='card' id='drum-machine'>
        <h1 className='card-header display-3 text-center text-muted'>Drum Machine</h1>
        <div className='card-body'>
          <div className='row m-1'>
            <div className='col-8'>
              <DrumPad sendDisplayText={this.retrieveDisplayText} bank={this.state.bank} />
            </div>
            <div className='col-4'>
              <DrumControl handleBankChange={this.handleBankChange} display={this.state.displayText} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// App
const App = props => {
  return (
    <div style={{height: '100vh'}} className='container d-flex flex-column justify-content-center'>
      <div className='row align-items-center'>
        <div className='col-2'>
        </div>
        <div className='col-8'>
          <DrumMachine />
        </div>
        <div className='col-2'>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

