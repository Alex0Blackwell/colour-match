import React from 'react';
import './App.css';


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


class Votes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roundScore: 0,
      numFlipped: 0,
      colourToMatch: null,
      indexOfLast: null,
      colours: this.randomiseColours(),
      tileAction: Array(18).fill(0),
    }
  }

  handleClick(colour, index) {
    this.state.numFlipped++;
    if(this.state.numFlipped === 2) {
      if(this.state.colourToMatch === colour && this.state.indexOfLast !== index) {
        console.log("Nice, that's a match");
        let newScore = this.state.roundScore++;
        this.setState({
          roundScore: newScore,
        });
        this.updateColours([index,this.state.indexOfLast], 2);
        this.renderTiles()
      } else {
        console.log("Not epic, not a match");
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
      console.log("waiting for next...")
      let newTileAction = this.state.tileAction;
      newTileAction[index] = 1;
      // console.log(tindex, newTileAction);
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
      else if(action === 1) {
        // if raised
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
    // console.log(actionArr);
    const colours = this.state.colours;

    const listItems = colours.map((colour, index) =>
      res.push(<Tile
        key={index.toString()}
        onClick={() => this.handleClick(colour, index)}
        colour={colour}
        action={actionArr[index]}
        />),
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
