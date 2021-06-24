// assigning some variables used in Game...
let isPlaying = false
let isWon = null 
let time = 0
let timer = null
let occupiedPosition = []

// load up the boxes in initial render
const board = document.querySelector('.board')
for (let i = 0; i < 64; i++) {
    board.innerHTML += `<div class="box" id=${i} onclick="playMove(this.id)" onmousedown="markFlag(event,this.id)"></div>`
}

// starting the game
const startGameButton = document.querySelector('.btn')
startGameButton.addEventListener('click', () => {
    console.log('executing...');
    isPlaying = !isPlaying //setting the value of Game Status.
    // resetting the dom when the game restarts.
    const message = document.querySelector('.status')
    if(message.contains(document.querySelector('.message'))){
        message.removeChild(document.querySelector('.message'))
    }
    const boxes = document.querySelectorAll('.box')
    boxes.forEach((e)=>{
        e.innerText = null
    })
    for(let i =0; i < occupiedPosition.length; i++){
        const e = document.getElementById(String(occupiedPosition[i]))
        e.style.backgroundColor  = null
        e.classList.remove('occupied')
    }
    document.querySelector('.board').style.backgroundColor = "hsl(200, 100%, 50%)"
    const number = document.querySelector('.number')
    number.innerText = 10 //resetting the flags
    const statusEmoji = document.querySelector('.status-emoji')
    statusEmoji.innerText = "😀"//resetting the status-emoji
    //setting the timer
    timer = setInterval(() => {
        document.querySelector('.timer').innerText = time
        time++
    }, 1000) //starting the timer
    startGameButton.style.display = "none" //removing the startButton after game started .
    gameStarter()
})



//function for  making the mine array.
function generateMines() {
    const arr = []
    while (arr.length < 10) {
        const randomPosition = Math.floor(Math.random() * 64)
        const element = document.getElementById(String(randomPosition))
        if (!element.classList.contains('mine')) {
            arr.push(randomPosition)
            element.classList.add(`mine`)
        }
    }
    return arr
}

let mines = generateMines() //generating the mines


// generating number across mines.
function generateNumbersNearTheMine(){
    let numbersNearTheMine = []
    for(let i = 0;i<mines.length; i++){
        const number = mines[i]
        const number1 = mines[i] + 1
        const number2 = mines[i] - 1
        const arr = [number + 8, number - 8, number1 - 8, number1 + 8,  number2 + 8,number2 - 8, number1, number2]
        numbersNearTheMine.push(...arr)
    }
    numbersNearTheMine = numbersNearTheMine.filter((element)=>{
        return element > 0 && element < 63
    })
    for(let i =0; i<mines.length; i++){
        const e = mines[i]
        for(let j=0; j<numbersNearTheMine.length; j++){
            if(e === numbersNearTheMine[j]){
                numbersNearTheMine.splice(j,1)
            }
        }
    }
    return numbersNearTheMine
}  
let numbersNearTheMine = generateNumbersNearTheMine()


// the game function
function playMove(id){
     const element = document.getElementById(id)
     if(isPlaying){
        if(element.classList.contains('mine')){
            //resetting the game values and startButton.
            isPlaying = false
            isWon = false
            occupiedPosition.push(element.id)
            element.classList.add('occupied')
            clearInterval(timer) //ends the timer
            time = 0 //reset the time
            startGameButton.style.display = "block"
            startGameButton.innerText = "Play Again"
            // setting the DOM .
            for(let i=0; i<mines.length; i++){
                const e = document.getElementById(String(mines[i]))
                e.innerText = "X"
                e.style.color = "red"
                e.classList.remove('mine')
            }
            document.querySelector('.board').style.backgroundColor = "#CCC"
            mines = generateMines() //regenerating the mines
            numbersNearTheMine = generateNumbersNearTheMine() //regenrating the numbers near the mines .
            if(isWon === false){
                const message = document.querySelector('.status')
                message.innerHTML += `<h1 class="message">You Lost! Better luck next time...</h1>`
                const statusEmoji = document.querySelector('.status-emoji')
                statusEmoji.innerText = "🤬"
            }
        }
        if(!element.classList.contains('occupied')){
            element.classList.add('occupied')
            element.style.backgroundColor = '#CCC'
            occupiedPosition.push(element.id)
            isWon = undefined
            generateNumberNearMine(id)
        } 
    }
    checkWin()
}


// functions that check if we have won the game ...
function checkWin(){
    let elements = document.querySelectorAll('.box')
    elements = Array.from(elements)
    elements = elements.filter(e => !e.classList.contains('mine'))
    for(let i=0; i<elements.length; i++){
       if(elements[i].classList.contains('occupied')){
           isWon = true
       }
       else{
           isWon = false
           break
        }
    }
    if(isWon === true){
        isPlaying = false
        clearInterval(timer)
        time = 0
        startGameButton.style.display = "block"
        startGameButton.innerText = "Play Again"
        const message = document.querySelector('.status')
        message.innerHTML += `<h1 class="message">Congrats ! You won the game...</h1>`
        const statusEmoji = document.querySelector('.status-emoji')
        statusEmoji.innerText = "😁"
    }
 }


// displays the numbersNearTheMine onClick...
function generateNumberNearMine(id){
    const element = document.getElementById(String(id))
    for(let i = 0; i<numbersNearTheMine.length; i++){
        if(numbersNearTheMine[i] === parseInt(id)){
            if(isNaN(parseInt(element.innerText))){
                element.innerText = 1
                element.style.color = 'green'
                element.classList.add('occupied')
                occupiedPosition.push(element.id)
            }
            else{
                element.innerText = parseInt(element.innerText) + 1
                element.style.color = 'green'
                element.classList.add('occupied')
                occupiedPosition.push(element.id)
            }
        }
    }
}


//gameStarter function
 function gameStarter(){
    let elements = document.querySelectorAll('.box')
    elements = Array.from(elements)
    const numbersToBlast = []
    while (numbersToBlast.length < 10) {
        const randomPosition = Math.floor(Math.random() * elements.length)
        const element = document.getElementById(String(randomPosition))
        if (!element.classList.contains('occupied') && !element.classList.contains('mine')) {
            numbersToBlast.push(randomPosition)
            element.classList.add(`occupied`)
            element.style.backgroundColor = '#CCC'
            occupiedPosition.push(element.id)
            isWon = undefined
            generateNumberNearMine(element.id)
        }
    }
}

//markFlag function
function markFlag(event,id){
    if(event.button === 2){
        const element = document.getElementById(String(id))
        const number = document.querySelector('.number')
        if(!element.classList.contains('occupied') && parseInt(number.innerText)>0){
            element.innerHTML = "🚩"
            element.style.background = "#CCC"
            element.classList.add('occupied')
            occupiedPosition.push(element.id)
            number.innerText = parseInt(number.innerText) - 1
        }
    }
}