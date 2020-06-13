import React from 'react';
import './App.css';
import { Button } from 'react-bootstrap';


function Tile(props) {
  let click, classname;
  classname = "tile";
  if(props.colour !== "#3b3b3b") {
    click = props.onClick;
    classname += " pointer";
  }
  if(props.action === 1)
    classname += " raise";

  return(
    <div className="col-lg-2 col-md-2 col-sm-2 col-4">
      <div className={classname} onClick={click} style={{backgroundColor: props.colour}}>
      </div>
    </div>
  );
}



class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { time: {}, seconds: 10 };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentDidMount() {
    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });
  }

  startTimer() {
    if ((this.timer === 0 && this.state.seconds > 0) || this.props.restarted) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds === 0) {
      clearInterval(this.timer);
      this.props.restart();
    }
  }

  render() {
    this.startTimer();
    if(this.props.pause) {
      clearInterval(this.timer);
    }
    return(
      <div>
        <p>{this.state.time.s} seconds</p>
      </div>
    );
  }
}



class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      win: false,
      roundScore: 0,
      numFlipped: 0,
      colourToMatch: null,
      indexOfLast: null,
      colours: this.randomiseColours(),
      tileAction: Array(18).fill(0),
    }
  }

  handleClick(colour, index) {
    this.state.gameStarted = true;
    this.state.numFlipped++;
    if(this.state.numFlipped === 2) {
      if(this.state.colourToMatch === colour && this.state.indexOfLast !== index) {
        this.state.roundScore++;
        this.updateColours([index,this.state.indexOfLast], 2);
      }
      let newTileAction = this.state.tileAction;
      newTileAction[this.state.indexOfLast] = 0;
      newTileAction[index] = 0;
      this.setState({
        numFlipped: 0,
        colourToMatch: null,
        indexOfLast: null,
        tileAction: newTileAction,
      });
    }
    else if(this.state.numFlipped === 1) {
      let newTileAction = this.state.tileAction;
      newTileAction[index] = 1;
      this.setState({
        colourToMatch: colour,
        indexOfLast: index,
        tileAction: newTileAction,
      });
    }

  }

  updateColours(indexChangeArr, action) {
    // where action is 0 for normal, 1 for raised, and 2 for dead
    let newColours = this.state.colours;

    for(let i = 0; i < indexChangeArr.length; i++) {
      if(action === 2) {
        // if dead
        newColours[indexChangeArr[i]] = "#3b3b3b";
      }
    }

    this.setState({
      colours: newColours,
    });
  }

  randomiseColours() {
    let allColours = ['#b99cff','#ed9cff','#ff9ca9','#ffca9c','#f8ff9c',
    '#9cffb0','#9cfff3','#9cc4ff', '#9c9cff'];
    let doubles = [];

    // first populate array
    let i = 0;
    while(i < allColours.length) {
      doubles.push(allColours[i]);
      doubles.push(allColours[i]);
      i++;
    }

    // then randomise it
    for(let i = 0; i < doubles.length; i++) {
      // get random index and swap them
      let randI = Math.floor(Math.random()*doubles.length);
      let _tmp = doubles[randI];
      doubles[randI] = doubles[i];
      doubles[i] = _tmp;
    }

    return doubles;
  }

  renderTiles() {
    let res = [];

    let actionArr = this.state.tileAction;
    const colours = this.state.colours;

    colours.map((colour, index) =>
      res.push(<Tile
        key={index.toString()}
        onClick={() => this.handleClick(colour, index)}
        colour={colour}
        action={actionArr[index]}
        />),
    );

    return (res);
  }


  restart() {
    this.setState({
      gameStarted: false,
      win: false,
      roundScore: 0,
      numFlipped: 0,
      colourToMatch: null,
      indexOfLast: null,
      colours: this.randomiseColours(),
      tileAction: Array(18).fill(0),
    });
  }


  render() {
    let score = "Matches left: " + (9-this.state.roundScore);
    if(this.state.roundScore >= 9) {
      score = "You Win!"
      this.state.win = true;
    }
    let timer = <p>{"10 seconds"}</p>;
    if(this.state.gameStarted)
      timer = <Timer pause={this.state.win} restart={() => this.restart()}/>
    return(
      <div className="container">
        <h1> {this.props.title} </h1>
        <h3> {score} </h3>
        {timer}
        <div className="row">
        {
          this.renderTiles()
        }
        </div>
        <Button variant="outline-light" onClick={() => this.restart()}>Restart</Button>{' '}
      </div>

    );
  }

}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Game
        title={"Match the Colours!"}
        />
      </header>
    </div>
  );
}

export default App;
