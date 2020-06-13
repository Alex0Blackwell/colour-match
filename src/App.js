import React from 'react';
import './App.css';


function Tile(props) {
  return(
    <div className="col-lg-4 col-md-4 col-6">
      <div className="tile" onClick={props.onClick} style={{backgroundColor: props.colour}}>
      </div>
    </div>
  );
}

class Votes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oneFlipped: false,
      colours: this.randomiseColours(),
    }
  }

  handleClick(colour) {
    console.log("the colour is", colour);
    // let totalPresses = this.state.tileVotes;
    // totalPresses[i]++;
    // this.setState({
    //   // oneFlipped: !oneFlipped,
    //   tileVotes: totalPresses,
    // });
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
    // console.log("res before is is: ", res);

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

    const colours = this.state.colours;

    const listItems = colours.map((colour, index) =>
      res.push(<Tile
        key={index.toString()}
        onClick={() => this.handleClick(colour)}
        colour={colour}/>),
    );

    return (res);
  }

  render() {
    return(
      <div className="container">
        <h1> {this.props.title} </h1>
        <div className="row">
        {
          this.renderTiles()
        }
        </div>
      </div>

    );
  }

}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Votes
        title={"Match the Colours!"}
        />
      </header>
    </div>
  );
}

export default App;
