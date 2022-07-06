const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const msgDisplay = document.querySelector('.message-container')
let wordle = "GREAT"

// const getWordle =async () =>{ 
//       let fetchData = await fetch('http://localhost:8000/word')
//       let data = await fetchData.json()
//       console.log(data)
//       wordle = data.toUpperCase()
// }
// getWordle()


const guessRows = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

const keys = [
    'Q','W','E','R','T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D',
    'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V',
    'B', 'N', 'M', '<<'
] 


guessRows.forEach((guessRow, guessRowIndex) =>{
    const rowElem = document.createElement('div')
    rowElem.setAttribute('id', 'guessRow' + guessRowIndex)
    guessRow.forEach((guess, guessIndex) =>{
       const tileElem = document.createElement('div')
       tileElem.setAttribute('id', 'guessRow' + guessRowIndex + '-tile-' + guessIndex)
       tileElem.classList.add('tile')
       rowElem.append(tileElem) 
    })
    tileDisplay.append(rowElem)
})

keys.forEach(key =>{
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
}) 


let currentRow = 0
let currentTile = 0
let isGameOver = false


const addLetter = (letter) =>{
    if(currentTile < 5 && currentRow < 6){
        const tile = document.getElementById('guessRow' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        tile.setAttribute('data', letter)
        guessRows[currentRow][currentTile] = letter
        currentTile++
    }
   
}

const deleteLetter = () =>{
    if(currentTile > 0){    
        currentTile--
        const tile = document.getElementById('guessRow' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        tile.setAttribute('data', '' )
        guessRows[currentRow][currentTile] = ''
    }

}
const messageElem = document.createElement('p')

const showMessage = (message) =>{
    messageElem.textContent = message
    msgDisplay.append(messageElem)
    setTimeout(() =>{msgDisplay.removeChild(messageElem)}, 3000)
}

const checkWord = () =>{
    const guess = guessRows[currentRow].join('')
  

    if(currentTile > 4){
        fetch(`http://localhost:8000/check/?word=${guess}`)
        .then(response => response.json())
        .then(json =>{
            if (json== 'Entry word not found'){
                messageElem.classList.add('lose')
                // tile.classList.add('yellow-tile')            
                showMessage("Word doesn't exist")
                currentRow++
                currentTile = 0
                return
            }

            else{
                flipTile()
                if(wordle == guess){
                    showMessage('Welldone! You guessed right')
                    messageElem.classList.remove('lose')
                    messageElem.classList.add('win')
                    isGameOver = true
                    return
                } else{
                    if(currentRow>=5){
                        isGameOver = true
                        messageElem.classList.add('lose')
                        showMessage('Game Over')
                        return
                    }
                    if(currentRow < 5){
                        currentRow++
                        currentTile = 0
                    }
                }
            }
        }).catch(err => console.log(error))

    }
}



const flipTile = () => {
    if(currentTile > 4){
        const rowTiles = document.querySelector('#guessRow' + currentRow).childNodes
        rowTiles.forEach((tile, index) =>{
            const dataLetter = tile.textContent

            setTimeout(()=>{
                tile.classList.add('flip')
                if(dataLetter == wordle[index]){
                    tile.classList.add('green-tile')
                } else if(wordle.includes(dataLetter)){
                    tile.classList.add('yellow-tile')            
                } else{
                    tile.classList.add('grey-tile')
                }
            }, 300*index)
        })
       
    } else{
            messageElem.classList.add('lose')
            showMessage("Input 5 letter words")
        }

}

const handleClick = (letter) => {
    if(!isGameOver){
         console.log('clicked', letter)
            if(letter === '<<'){
                deleteLetter()
                return
            }
            if(letter === 'ENTER'){
                checkWord()
                return
            }
            addLetter(letter)
        }
    }





{/* <a href="#" onclick="window.location.reload(true);">1</a> */}



