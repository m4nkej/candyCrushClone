import { useEffect, useState, useCallback } from "react";
import ScoreBoard from "./components/ScoreBoard";
import GreenCandy from './img/green.gif'
import BlueCandy from './img/blue.gif'
import RedCandy from './img/red.gif'
import YellowCandy from './img/yellow.gif'
import OrangeCandy from './img/orange.gif'
import PurpleCandy from './img/purple.webp'
import BlankCandy from './img/blank.png'


const width = 8;
const candyColors = [BlueCandy, GreenCandy, OrangeCandy, YellowCandy, RedCandy, PurpleCandy];

const App = () => {
  const [currentColorArr, setCurrentColorArr] = useState([]);
  const [squareDragged, setSquareDragged] = useState(null)
  const [squareReplaced, setSquareReplaced] = useState(null)
  const [scoreDisaply, setScoreDisplay] = useState(0)
  /**
 * Check if 4 next square in comumn are the same
 */
  const checkForColOf4 = () => {
    for (let i = 0; i <= 39; i++) {
      const columnOf4 = [i, i + width, i + width * 2, i + width * 3];
      const decidedColor = currentColorArr[i];
      const isBlank = currentColorArr[i] === BlankCandy

      if (
        columnOf4.every((square) => currentColorArr[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4)
        columnOf4.forEach((square) => (currentColorArr[square] = BlankCandy));
        return true
      }
    }
  };
  /**
   * Check if 3 next square in comumn are the same
   */
  const checkForColOf3 = useCallback(() => {
    for (let i = 0; i <= 47; i++) {
      const columnOf3 = [i, i + width, i + width * 2];
      const decidedColor = currentColorArr[i];
      const isBlank = currentColorArr[i] === BlankCandy

      if (
        columnOf3.every((square) => currentColorArr[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 3)
        columnOf3.forEach((square) => (currentColorArr[square] = BlankCandy));
        return true
      }
    }
  });

  const checkForRowOf4 = () => {
    for (let i = 0; i < 64; i++) {
      const rowOf4 = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArr[i];
      const isBlank = currentColorArr[i] === BlankCandy
      const notValid = [5, 6, 7, 13, 14, 15,
        21, 22, 23, 29, 30, 31,
        37, 38, 39, 45, 46, 47,
        53, 54, 55, 62, 63, 64]

      if (notValid.includes(i)) continue

      if (
        rowOf4.every((square) => currentColorArr[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 4)
        rowOf4.forEach((square) => (currentColorArr[square] = BlankCandy));
        return true
      }
    }
  };

  const checkForRowOf3 = () => {
    for (let i = 0; i < 64; i++) {
      const rowOf3 = [i, i + 1, i + 2];
      const decidedColor = currentColorArr[i];
      const isBlank = currentColorArr[i] === BlankCandy
      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64]

      if (notValid.includes(i)) continue

      if (
        rowOf3.every((square) => currentColorArr[square] === decidedColor && !isBlank)
      ) {
        setScoreDisplay((score) => score + 3)
        rowOf3.forEach((square) => (currentColorArr[square] = BlankCandy));
        return true
      }
    }
  };

  const moveToBellow = () => {
    for (let i = 0; i < 55; i++) {

      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
      const isFirstRow = firstRow.includes(i)

      if (isFirstRow && currentColorArr[i] === BlankCandy) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArr[i] = candyColors[randomNumber]
      }

      if (currentColorArr[i + width] === BlankCandy) {
        currentColorArr[i + width] = currentColorArr[i]
        currentColorArr[i] = BlankCandy
      }
    }
  }

  const dragStart = (e) => {
    setSquareDragged(e.target)
  }

  const dragDrop = (e) => {
    setSquareReplaced(e.target)
  }

  const dragEnd = (e) => {
    const squareReplacedId = parseInt(squareReplaced.getAttribute('data-id'))
    const squareDraggedId = parseInt(squareDragged.getAttribute('data-id'))

    currentColorArr[squareReplacedId] = squareDragged.getAttribute('src')
    currentColorArr[squareDraggedId] = squareReplaced.getAttribute('src')


    const validMoves = [
      squareDraggedId - 1,
      squareDraggedId - width,
      squareDraggedId + 1,
      squareDraggedId + width
    ]
    const validMove = validMoves.includes(squareReplacedId)
    if (!validMove) {
      currentColorArr[squareReplacedId] = squareReplaced.getAttribute('src')
      currentColorArr[squareDraggedId] = squareDragged.getAttribute('src')
      setCurrentColorArr([...currentColorArr])
    }
    const isColOf4 = checkForColOf4()
    const isRowOf4 = checkForRowOf4()
    const isColOf3 = checkForColOf3()
    const isRowOf3 = checkForRowOf3()

    if (squareReplacedId &&
      validMove &&
      (isColOf4 || isRowOf4 || isColOf3 || isRowOf3)) {
      setSquareDragged(null)
      setSquareReplaced(null)
    } else {
      currentColorArr[squareReplacedId] = squareReplaced.getAttribute('src')
      currentColorArr[squareDraggedId] = squareDragged.getAttribute('src')
      setCurrentColorArr([...currentColorArr])
    }
  }



  /**
   * Create a game board width x width
   */
  const createBoard = () => {
    const randomColorArr = [];
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArr.push(randomColor);
    }
    setCurrentColorArr(randomColorArr);
    console.log(randomColorArr);
  };

  useEffect(() => {
    createBoard();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      checkForColOf4()
      checkForRowOf4()
      checkForColOf3()
      checkForRowOf3()
      moveToBellow()
      setCurrentColorArr([...currentColorArr])
    }, 50);
    return () => clearInterval(timer);
  }, [checkForColOf4, checkForRowOf4, checkForColOf3, checkForRowOf3, moveToBellow, currentColorArr]);



  return (
    <div className="app">
      <div className="game">
        {currentColorArr.map((candyColor, index) => (
          <img
            key={index}
            src={candyColor}
            alt={candyColor}
            data-id={index}
            draggable={true}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => e.preventDefault()}
            onDragLeave={(e) => e.preventDefault()}
            onDragStart={dragStart}
            onDrop={dragDrop}
            onDragEnd={dragEnd}
          />
        ))}
      </div>
      <ScoreBoard score={scoreDisaply} />
    </div>
  );
};

export default App;
