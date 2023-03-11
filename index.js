var canvas = document.getElementById("canvas");
var trex = document.getElementById("Trex");
var msCount = 0;
var score = 0;
var gameRunning = false;
var dodging = false;

var trexWidth = 75;
var trexHeight = 75;

var peakJump = 0;
var airTime = 125;
var trexBottom = 0;

var obstacleSpeed = 2;
var jumpHeight = 125;
var jumping = false;

var obstacleInterval = 500;
var lastObstacle = 0;

function randomObstacleInterval()
{
    obstacleInterval = parseInt(Math.random() * 1000 )
    while ( obstacleInterval < 250 || obstacleInterval > 500 )
    {
        obstacleInterval = parseInt(Math.random() * 1000 );
    }
}

async function AddObstacle()
{
    var rand = randomIntFromInterval(5,5)
    {
        if ( rand == 5 ) // 20% change of bird
        {
            var topOrBottom = randomIntFromInterval(1,2) // 50% 50% for top or bottom bird
            console.log(topOrBottom)
            if ( topOrBottom == 1 )
                canvas.innerHTML +=
                `
                    <img id="obstacle" class="Bird bird-top" src="Assets/1bird.png" >
                `
            else if ( topOrBottom == 2 )
                canvas.innerHTML +=
                `
                    <img id="obstacle" class="Bird bird-bottom" src="Assets/1bird.png" >
                `
        }
        else // 80% of adding cactus
        {
            var random  = randomIntFromInterval(1,2); // 50% 50% small of large cactus11
            if ( random == 1 )
                canvas.innerHTML += 
                `
                    <img id="obstacle" class="ob1" src="Assets/Obstacle1.png" >
                `
            else if ( random == 2 )
            {
                var count = randomIntFromInterval(1,4)
                for( var i=1; i<=count; i++ )
                {
                    canvas.innerHTML += 
                    `
                        <img id="obstacle" class="ob2" src="Assets/Obstacle2.png" >
                    `
                    await delay(45);
                }
            }    
        }
    }



}

function ShuffleImages()
{
    var trex = document.getElementById("Trex");
    var src = trex.src;

    if ( dodging )
    {
        if ( src.includes("1dodging.png") )
            src = src.replace("1dodging.png", "2dodging.png")
        else if ( src.includes("2dodging.png") )
            src = src.replace("2dodging.png", "1dodging.png")
        else
            src = "Assets/1dodging.png"
    }
    else
    {
        if ( trexBottom > 0  )
        {
            if ( src.includes("2.png") )
            {
                src = src.replace("2.png", "1.png");
            }
            else if ( src.includes("3.png") )
            {
                src = src.replace("3.png", "1.png")
            }
            else 
                src = "Assets/1.png";
        }
        else
        {
            if ( src.includes("1.png") )
            {
                src = src.replace("1.png", "2.png");
            }
            else if ( src.includes("2.png") )
            {
                src = src.replace("2.png", "3.png")
            }
            else if ( src.includes("3.png") )
            {
                src = src.replace("3.png", "2.png")
            }
            else    
                src = "Assets/2.png";
        }
    }
 
    trex.src = src;
}

var gameLoop;

function GameLoop()
{
    gameLoop = setInterval( function ()
    {
        CheckIfDead();

        // Game speeding up
        if ( msCount % 10000 == 0 && msCount > 0)
        {
            obstacleSpeed += 1;
            console.log("speed up")
        }


        // Handling the Obstacle movement
        document.querySelectorAll("#obstacle").forEach( obstacle =>
        {
            obstacle.style.left = obstacle.offsetLeft - obstacleSpeed;
        } )
        
        // Handling random obstacle added
        if ( lastObstacle + obstacleInterval < msCount )
        {
            lastObstacle = msCount;
            AddObstacle();
            randomObstacleInterval();
        }

        // Handling ground moving
        document.querySelectorAll(".ground").forEach( ground  => 
        {
            ground.style.left = (ground.offsetLeft - obstacleSpeed) + "px";
            if ( ground.offsetLeft < -1200 )
            {
                ground.style.left = "1200px";
            }
        })

        // Handling bird images 
        if ( msCount % 100 == 0 )
        {
            document.querySelectorAll(".Bird").forEach( bird =>
            {
                var src = bird.src;

                if ( src.includes("1bird.png") )
                    src = src.replace("1bird.png", "2bird.png")
                else if ( src.includes("2bird.png") )
                    src = src.replace("2bird.png", "1bird.png")
                
                bird.src = src;
            })
        }

        if ( msCount % 30 == 0 )
        {
            ShuffleImages();
        }
        
        // Handle Jupming
        if ( jumping )
        {
            trexBottom += 1.75;
            if ( trexBottom > jumpHeight ) 
            {
                peakJump = msCount;
                jumping = false;
            }
        }
        else if ( trexBottom > 0 )
        {
            if ( peakJump + airTime > msCount )
                trexBottom -= 1.25;
            else
                trexBottom -= 2;
        }    
        document.getElementById("Trex").style.bottom = trexBottom + "px";

        // Updating Score:
        if ( msCount % 25 == 0 )
        {
            score ++;
            document.getElementById("score").textContent = score;
        }
        msCount += 1;
    }, 1)

}

function StartGame()
{
    msCount = 0;
    score = 0;
    lastObstacle = 0;
    obstacleInterval = 500;
    gameRunning = true;

    document.getElementById("canvas").innerHTML = `
        <img id="Trex" src="Assets/1.png" >
        <img class="ground" src="Assets/Ground.png" >
        <img class="ground ground-2" src= "Assets/Ground.png" > 
        <label class="score" id="score" > 0 </label>
    `

    GameLoop();

}

function CheckIfDead()
{
    document.querySelectorAll("#obstacle").forEach( obstacle =>
    {
        if ( obstacle.offsetLeft < 0 )
            obstacle.remove();
        
        var trexOffet = document.getElementById("Trex").offsetLeft
        if ( obstacle.offsetLeft < trexOffet + trexWidth - 10 && obstacle.offsetLeft + 30 > trexOffet )
        {
            if ( obstacle.classList.contains("ob1") && trexBottom >= 50 ) return;
            if ( obstacle.classList.contains("ob2") && trexBottom >= 40 ) return;
            if ( obstacle.classList.contains("Bird") && obstacle.classList.contains("bird-top")  && trexBottom <= 5 && dodging ) return;
            if ( obstacle.classList.contains("Bird") && obstacle.classList.contains("bird-bottom") && trexBottom >= 55 ) return;
            
            clearInterval(gameLoop)
            var trex = document.getElementById("Trex");
            var src = trex.src;
            if ( src.includes("1.png") || src.includes("2.png") || src.includes("3.png") )
            {
                src = src.replace("1.png", "dead.png");
                src = src.replace("2.png", "dead.png");
                src = src.replace("3.png", "dead.png");
            }

            trex.src = src;
            gameRunning = false;
        }
        
    })
}

window.addEventListener("keydown", e => 
{
    if ( e.keyCode == 38 || e.keyCode == 32)
    {
        if ( !gameRunning )
        {
            StartGame();
        }
        if ( !jumping && trexBottom <= 5 )
        {
            jumping = true;
        }
    }
    if ( e.keyCode == 40 )
    {
        dodging = true;
        var trex = document.getElementById("Trex");
        trex.style.height = "50px";
        trex.src = "Assets/1dodging.png"
    }
})

window.addEventListener("keyup", e =>
{
    if ( e.keyCode == 40 )
    {
        dodging = false;
        var trex = document.getElementById("Trex");
        trex.style.height = "75px";
        trex.src = "Assets/2.png"
    }
})

window.addEventListener("load", e => 
{
})

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }