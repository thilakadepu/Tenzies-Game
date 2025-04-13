import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import MessageOrTimer from "./MessageOrTimer";

export default function App() {
  const [dice, setDice] = React.useState(() => generateAllNewDice())
  const [startTimer, setstartTimer] = React.useState(false)
  const [startGame, setStartGame] = React.useState(false)
  const [pointerStyle, setPointerStyle] = React.useState({});
  const [rollCount, setRollCount] = React.useState(0)

  const buttonRef = React.useRef(null)
  const diceContainerRef = React.useRef(null)

  const gameWon = dice.every(die => die.isHeld) &&
        dice.every(die => die.value === dice[0].value)

  React.useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
      setStartGame(false)
    }
  }, [gameWon])

  React.useEffect(() => {
    if (diceContainerRef.current) {
      setPointerStyle({
        pointerEvents: startGame ? 'auto' : 'none',
        opacity: startGame ? 1 : 0.5,
      });
    }
  }, [startGame])

  function generateAllNewDice() {
    return new Array(10)
                .fill(0)
                .map(() => ({
                  value: Math.ceil(Math.random() * 6), 
                  isHeld: false,
                  id: nanoid()
                }))
  }
  
  function hold(id) {
    setDice(oldDice => oldDice.map(die => 
      die.id === id ? {...die, isHeld: !die.isHeld} : die
    ))
  }

  function rollDice() {
    setDice(oldDice => oldDice.map(die =>
      die.isHeld ? die: {...die, value: Math.ceil(Math.random() * 6)}
    ))
    setRollCount(prev => prev + 1)
  }

  function newGame() {
    setDice(generateAllNewDice())
    setStartGame(true)
    setRollCount(0)
  }

  function start() {
    setStartGame(true)
    setstartTimer(true)
  }

  const dieElements = dice.map((die) => {
    return (
      <Die
        key={die.id} 
        value={die.value} 
        isHeld={die.isHeld} 
        hold={() => hold(die.id)}
      />
    )
  })

  const startButton = <button className="game-interaction start" onClick={start}>Start</button>
  const rollButton = <button className="game-interaction roll" onClick={rollDice}>Roll</button>
  const newGameButton = <button ref={buttonRef} className="game-interaction new-game" onClick={newGame}>New Game</button>

  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You Won! Press "New Game" to start again</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      {!startTimer ? <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p> : <MessageOrTimer gameWon={gameWon} rollCount={rollCount}/>}
      <div ref={diceContainerRef} className="dice-container"style={pointerStyle} >{dieElements}</div>
      { !startTimer ? startButton : (gameWon ? newGameButton : rollButton) }
    </main>
  )
}