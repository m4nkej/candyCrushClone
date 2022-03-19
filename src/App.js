/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import ScoreBoard from "./components/ScoreBoard";
import GreenCandy from './img/icons8-candy-48-green.png'
import BlueCandy from './img/icons8-candy-48-blue.png'
import RedCandy from './img/icons8-candy-48-red.png'
import YellowCandy from './img/icons8-candy-48-yellow.png'
import GrayCandy from './img/icons8-candy-48-gray.png'
import PurpleCandy from './img/icons8-candy-48-purple.png'
import BlankCandy from './img/blank.png'


const width = 8;
const candyColors = [BlueCandy, GreenCandy, GrayCandy, YellowCandy, RedCandy, PurpleCandy];

const App = () => {
  const [currentColorArr, setCurrentColorArr] = useState([]);
  const [squareDragged, setSquareDragged] = useState(null)
  const [squareReplaced, setSquareReplaced] = useState(null)
  const [scoreDisaply, setScoreDisplay] = useState(0)

  /**
  * Check if 4 next square in comumn are the same
  * @returns true when found points
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
   * @returns true when found points
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

  /**
   * Check if 4 next square in row are the same
   * @returns true when found points
   */
  const checkForRowOf4 = () => {
    for (let i = 0; i < 64; i++) {
      const rowOf4 = [i, i + 1, i + 2, i + 3];
      const decidedColor = currentColorArr[i];
      const isBlank = currentColorArr[i] === BlankCandy
      const notValid = [
        5, 6, 7, 13, 14, 15,
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

  /**
   * Check if 3 next square in row are the same
   * @returns true when found points
   */
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

  /**
   * Move all candies to bottom, when empty fields will be found (like falling)
   */
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

  /**
   * Set dragged square when grab candy
   * @param {Event} e 
   */
  const dragStart = (e) => {
    setSquareDragged(e.target)
  }

  /**
   * Set replaces square when realeasing dragged candy
   * @param {*} e 
   */
  const dragDrop = (e) => {
    setSquareReplaced(e.target)
  }

  const dragEnd = (e) => {
    // get id of dreagged and replaced squares
    const squareReplacedId = parseInt(squareReplaced.getAttribute('data-id'))
    const squareDraggedId = parseInt(squareDragged.getAttribute('data-id'))

    currentColorArr[squareReplacedId] = squareDragged.getAttribute('src')
    currentColorArr[squareDraggedId] = squareReplaced.getAttribute('src')
    const notValidLastCol = [7, 15, 23, 31, 39, 47, 55]
    const notValidFisrstCol = [8, 16, 24, 32, 40, 48, 56]
    // chekc if squareReplacedId is in valid moves
    const validMoves = [
      squareDraggedId - width, // top
      squareDraggedId + width // bottom
    ]

    // prevent move from last col to first col (row below), and oposite site
    if (!(notValidLastCol.includes(squareDraggedId))) validMoves.push(squareDraggedId + 1)// right
    if (!(notValidFisrstCol.includes(squareDraggedId))) validMoves.push(squareDraggedId - 1) //left

    const validMove = validMoves.includes(squareReplacedId)

    //if not in valid moves, revers move
    if (!validMove) {
      currentColorArr[squareReplacedId] = squareReplaced.getAttribute('src')
      currentColorArr[squareDraggedId] = squareDragged.getAttribute('src')
      setCurrentColorArr([...currentColorArr])
    }
    // if move was valid, check for points
    const isColOf4 = checkForColOf4()
    const isRowOf4 = checkForRowOf4()
    const isColOf3 = checkForColOf3()
    const isRowOf3 = checkForRowOf3()

    // if was points, and move was valid, make a move
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
    // fill array with random colors
    for (let i = 0; i < width * width; i++) {
      const randomColor =
        candyColors[Math.floor(Math.random() * candyColors.length)];
      randomColorArr.push(randomColor);
    }
    setCurrentColorArr(randomColorArr);
    console.log(randomColorArr);
  };

  /**
   * Creat board on startup
   */
  useEffect(() => {
    createBoard();
  }, []);

  /**
   * Check board every 100ms for points
   */
  useEffect(() => {
    const timer = setInterval(() => {
      checkForColOf4()
      checkForRowOf4()
      checkForColOf3()
      checkForRowOf3()
      moveToBellow()
      setCurrentColorArr([...currentColorArr])
    }, 100);
    return () => clearInterval(timer);
  }, [checkForColOf4, checkForRowOf4, checkForColOf3, checkForRowOf3, moveToBellow, currentColorArr]);



  return (
    <div className="app">

      <ScoreBoard score={scoreDisaply} />

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

    </div>
  );
};

export default App;
