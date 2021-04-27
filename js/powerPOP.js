//canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

const initial_speed_coef = 1.1;

let score = 0;
let gameFrame = 0;
var pause = false;
ctx.font = '50px Georgia';

let speedCoeficient = initial_speed_coef; // Greicio koeficientas regulioja kaip greit kyla burbuliukai ir kaip greit jie atsiranda


/*modal boxas game over*/

const modals = document.querySelectorAll(".modal");
const modalCloseButtons = document.querySelectorAll(".modal-close");


modalCloseButtons.forEach(elem => {
    elem.addEventListener("click", event => toggleModal(event.currentTarget.closest(".modal").id));
});


function toggleModal(modalId) {
    const modal = document.getElementById(modalId);

    if (getComputedStyle(modal).display === "flex") { // alternatively: if(modal.classList.contains("modal-show"))
        modal.classList.add("modal-hide");
        setTimeout(() => {
            document.body.style.overflow = "initial";
            modal.classList.remove("modal-show", "modal-hide");
            modal.style.display = "none";
        }, 200);
    } else {
        document.body.style.overflow = "hidden";
        modal.style.display = "flex";
        modal.classList.add("modal-show");
    }
}



// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}

canvas.addEventListener('mousedown', function(event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;

});

canvas.addEventListener('mouseup', function() {
    mouse.click = false;
})

goodPasswordList = ["J6i^V6iK",
    "NyK1r542*Z",
    "9fq7yb&U!u",
    "l40h6#Wu$U",
    "IecBf3a8%^5",
    "4sV#dmX^*4&",
    "X4pWg6#@ae",
    "59&ssuw#%Kt",
    "#aIBW5@@l8",
    "4S#RvEb7%w#"
];

badPasswordList = [{ password: "Password", explanation: "Do not use dictionary words" },
    { password: "Laura123", explanation: "Do not use personal information" },
    { password: "123456", explanation: "Do not use easy combinations" },
    { password: "myprettykitty", explanation: "Do not use dictionary words" },
    { password: "aaa8888", explanation: "Do not use repeating characters" },
    { password: "mylovelydog", explanation: "Do not use dictionary words" }
];


// player
class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 7; //kad per viduri butu rutuliukas pakeiciau i 5 o siaip buvo 2
        this.radius = 30;
        this.angle = 0;
        this.frameX = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (mouse.y != this.y) {
            this.x -= dx / 20;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 20;
        }
    }
    draw() {
        if (mouse.click) {

            ctx.moveTo(this.x, mouse.y);
        }

        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        /*cirkle for a player*/
        ctx.fill();
        ctx.closePath();
    }
}


const player = new Player();



//bubbles
const bubblesArray = [];
class Bubble {
    constructor(password) {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 75; //juodu kamuoliuku dydis
        this.speed = 0.5 * speedCoeficient + 1; //juodu kamuoliuku greitis
        this.distance;
        this.counted = false;
        this.password = password;
        //this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'; //if this condition is true play sound 1 if false play sound 2
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy); //to get collision warning when circkles overlaps

    }
    draw() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "white"; //text in the bubble
        ctx.font = "18px Georgia"; //text in the bubble
        ctx.fillText(this.password, this.x - (this.password.length * 4.8), this.y); //text in the bubble
    }

    isFriendly = () => true;
}
//blogieji kamuoliukai
class BadBubble {
    constructor(password, explanation) {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 1;
        this.radius = 60; //blogu kamuoliuku dydis
        this.speed = 0.5 * speedCoeficient + 1; //zaliu kamuoliuku greitis
        this.distance;
        this.counted = false;
        /*this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'; */ //if this condition is true play sound 1 if false play sound 2
        this.password = password;
        this.explanation = explanation;
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.round(Math.sqrt(dx * dx + dy * dy)); //to get collision warning when circkles overlaps
    }
    draw() {
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = "white"; //text in the bubble
        ctx.font = "18px Georgia"; //text in the bubble
        ctx.fillText(this.password, this.x - (this.password.length * 4), this.y); //text in the bubble
    }

    isFriendly = () => false;
}


function handleBubbles() {
    /*run this code every 250 frames*/
    if (gameFrame % Math.round(250 - speedCoeficient * 15) == 0) { //kuo didesnis daugiklis tuo greiciau dauges kamuoliuku / sekunde skaicius
        bubblesArray.push(new Bubble(goodPasswordList[Math.floor(Math.random() * goodPasswordList.length)]));
        let randomBadPassword = badPasswordList[Math.floor(Math.random() * badPasswordList.length)]
        bubblesArray.push(new BadBubble(randomBadPassword.password, randomBadPassword.explanation));

    }
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();
    }
    /*to get rid of blinking*/
    for (let i = 0; i < bubblesArray.length; i++) {

        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
            bubblesArray.splice(i, 1);
        } else
        //distance between cickles. first one represents bubbles, second one player
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {

            if (!bubblesArray[i].counted) {
                score = score + (1 * Math.round(speedCoeficient)) //whenever collision is detected increase score by speed rate
                bubblesArray[i].counted = true; //every bubble should be counted like one
                deletedBubbles = bubblesArray.splice(i, 1); //to remove which one is touched
                for (let k = 0; k < deletedBubbles.length; k++) {
                    if (!deletedBubbles[k].isFriendly()) {
                        evilBuble = deletedBubbles[k];
                        pause = true;
                        setModalValues(evilBuble.password, evilBuble.explanation);
                        toggleModal("modal1");
                    } //kai blogi yra  game over
                }
            }
        }
    }
}
/*game o ver langas*/
const setModalValues = (password, explanation) => {
    document.getElementById("password").innerHTML = password;
    document.getElementById("explanation").innerHTML = explanation;
    document.getElementById("score").innerHTML = score;
}



const resetGame = () => {
    score = 0;
    gameFrame = 0;
    bubblesArray.splice(0, bubblesArray.length);
    speedCoeficient = initial_speed_coef;
    /*cia kad kai nusiresetina butu vel nuo 0 ir duotu tasku pagal greiti */
    pause = false;
    toggleModal("modal1"); /*toggle tai kai buna uzdetas ir vel rasai nusiima*/
    animate();
}
document.getElementById("resetButton").onclick = () => resetGame();
/*kai clikini buttona issauke reset game funkcija*/

//animation loop
function animate() {
    if (gameFrame % 50 == 0) {
        speedCoeficient += 0.1; // kaip greit zaidimas greiteja
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'red'; //spalva score
    ctx.font = "28px Georgia";
    ctx.fillText('Score:' + score, 40, 40); //vieta kur score cia galiu dadet ir speeda
    gameFrame++;
    if (pause) return; // kai priliecia zalius kad sustotu
    requestAnimationFrame(animate);
}
animate();