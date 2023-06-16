export function getWordWeightedDifference(word1: string, word2: string, weights?:{
  case?: number,
  position?: number,
  keyboardDistance?: number,
}): number {
    const word1Length = word1.length;
    const word2Length = word2.length;
    const minLength = Math.min(word1Length, word2Length);
    let weightedDifference = 0;

    const caseWeight = weights?.case || 0.1
    const positionWeight = weights?.position || 1
    const keyboardDistanceWeight = weights?.keyboardDistance || 1
    let lastShift = 0
    for (let i = 0; i < minLength; i++) {
      const letter1 = word1[i] || '';
      const letter2 = word2[i] || '';

      if (letter1 !== letter2) {
        if (letter1.toLowerCase() === letter2.toLowerCase()) {
          weightedDifference += caseWeight; // case difference
          continue
        }
        const [difIndex, dist] = findClosestIndexAndDif(word1, word2 ,i)
        let minPosDist = 1
        if(difIndex > -1){
          let newShift = difIndex - i
          if(lastShift !== newShift){
            minPosDist = 1 - 1/(dist/2+1)
            lastShift = newShift
          }
          else {
            minPosDist = 0
            continue
          }
        } else {
          lastShift = 0
        }
        weightedDifference += minPosDist * positionWeight; // letter position switch
        const keyboardDistance = getKeyboardDistance(word1[i], word2[i]); // letter keyboard distance
        const minKeyDist = 1 - 1/(keyboardDistance/2+ 1)
        weightedDifference += minKeyDist * keyboardDistanceWeight
      }
    }
  
    return weightedDifference / minLength;
  }

  
  export function getKeyboardDistance(letter1: string, letter2: string): number {
    const keyboardLayout = {
      // Define your keyboard layout here
      // Example layout for a standard QWERTY keyboard
      'q': { row: 1, col: 1 },
      'w': { row: 1, col: 2 },
      'e': { row: 1, col: 3 },
      'r': { row: 1, col: 4 },
      't': { row: 1, col: 5 },
      'y': { row: 1, col: 6 },
      'u': { row: 1, col: 7 },
      'i': { row: 1, col: 8 },
      'o': { row: 1, col: 9 },
      'p': { row: 1, col: 10 },
      'a': { row: 2, col: 1 },
      's': { row: 2, col: 2 },
      'd': { row: 2, col: 3 },
      'f': { row: 2, col: 4 },
      'g': { row: 2, col: 5 },
      'h': { row: 2, col: 6 },
      'j': { row: 2, col: 7 },
      'k': { row: 2, col: 8 },
      'l': { row: 2, col: 9 },
      'z': { row: 3, col: 1 },
      'x': { row: 3, col: 2 },
      'c': { row: 3, col: 3 },
      'v': { row: 3, col: 4 },
      'b': { row: 3, col: 5 },
      'n': { row: 3, col: 6 },
      'm': { row: 3, col: 7 },
    } as {[key: string]: {row: number, col: number}};
  
    const pos1 = keyboardLayout[letter1.toLowerCase()];
    const pos2 = keyboardLayout[letter2.toLowerCase()];
  
    if (pos1 && pos2) {
      const rowDirection = pos1.row - pos2.row;
      const rowDiff = Math.abs(rowDirection);
      const rowAdjust = rowDirection * 0.5;
      const colDiff = Math.abs(pos1.col + rowAdjust - pos2.col);
      return rowDiff + colDiff;
    }
  
    return 0;
  }


  function findClosestIndexAndDif(firstString: string, secondString: string, firstIndex: number): [number, number] {
    const target = firstString[firstIndex];
    let minDiff = Infinity;
    let closestIndex = -1;
  
    for (let i = 0; i < secondString.length; i++) {
      if (secondString[i].toLowerCase() === target.toLowerCase()) {
        const diff = Math.abs(firstIndex - i);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }
    }
  
    return [closestIndex, minDiff];
  }