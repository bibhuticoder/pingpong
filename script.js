'use strict';

$(window).load(function(){
 
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
    
    
    var Width, Height;
    var i, j;
    var bricks;
    var bonuses;
    var row;
    var col;
    var timer;
    var score;
    var colors;    
    var brick; 
    var player; 
    var ball;
    var bonus;
     
    
    function start(){
        
        bricks = [];
        bonuses = [];
        score = 0;
        colors = ['gray', 'dimgray']
        
        brick = {
        
            color:"gray",        
            height:20,
            width:40
        
        }
        
        player = {         
        
            color:"saddlebrown",
            height:20,
            width:200,
            x:0,
            y:0,

            setY: function(){

                this.y = Height - this.height*2;
            },

            setX: function(){

                this.x = generateRandom(10,Width-this.width);
            }       

    }
        
        ball = {
        
            color: "red",
            x: 0,
            y: 0,
            speedX: 10,
            speedY: 10,
            size: 10,

            setX: function(){            
                this.x = generateRandom(ball.size * 2, Width- ball.size);            
            },

            setY: function(){
                this.y = ((col * brick.height) + brick.height); 
            }
        
    }
        
        bonus = {
        
            color:"yellow",
            font:"bolder 18px Cursive",            
            size:5,
            speedY:10
        
        }

        setCanvasSize();
        
        player.setX();
        
        player.setY();
        
        ball.setX();
          
        
        $("#canvas").mousemove(function(e){       
            player.x = e.pageX - player.width/2;                
        });
        
        $("#stop").click(function(){       
            clearInterval(timer);        
        });
    
        $("#start").click(function(){       
            timer = setInterval(draw, 30);        
        });
        
        generateBricks();
        
         ball.setY();
        
        draw();
        
    }
    
    start();
    
    function draw(){
        
        //clear canvas
        ctx.clearRect(0, 0, Width, Height);
        
        //draw ball
        ctx.beginPath();        
        ctx.fillStyle = ball.color;
        ball.x += ball.speedX;
        ball.y += ball.speedY;
        ctx.arc(ball.x, ball.y, ball.size, 0, 360);
        ctx.fill();
        
        ctx.beginPath();
        ctx.strokeStyle = "black";       
        ctx.arc(ball.x, ball.y, ball.size, 0, 360);
        ctx.stroke();
        
        
        //draw player
        ctx.beginPath();
        ctx.fillStyle = player.color;
        ctx.fillRect(player.x, player.y, player.width, player.height);
        
        drawBricks();
        
        //draw coins
        if(bonuses.length > 0){
            
            for(i=0; i< bonuses.length; i++){
                
                bonuses[i].y += bonus.speedY;
                
            }
            
            drawBonuses();
        }
        
        //draw score
        ctx.fillStyle = "red";
        ctx.font = "bold 20px Cursive";
        ctx.fillText("Score : " + score, 20, 25);
        
        ctx.font = "10px Cursive";
        ctx.fillText("X : " + ball.x + " Y : " + ball.y + ball.size + " > height : " + Height, 500, 25);
        
        
        //check for collissions
        checkCollission();
    }

    function checkCollission(){
        
        // LEFT boundary check
        if((ball.x - ball.size) < 0) {
                        
            ball.speedX = generateRandom(0,3);
            ball.speedY = generateRandom(5,10);
            
        }
        
        //RIGHT boundary check
        else if((ball.x + ball.size) > Width){
                        
             ball.speedX = generateRandom(-3, 0);
             ball.speedY = generateRandom(5, 10);
            
        }
        
        
        //check collission with player
        else if(ball.x > player.x && ball.x < (player.x+player.width) && (ball.y+ball.size) > player.y){
            
            //at right edge
            if((ball.x - ball.size/2) > (player.x + (3 * player.width)/4)){
                
                ball.speedX = generateRandom(5,10);
                
            }
            
            //at left edge
            if((ball.x + ball.size/2) < (player.x + (player.width)/4)){
                
                ball.speedX = generateRandom(-10,-5);
                
            }
            
            else{
                
                 //at middle            
                 ball.speedX = generateRandom(-5, 5);
                 
            }
            
            ball.speedY = generateRandom(-15,-10);
           
        }
        
        //BRICK collission check
        else if(ball.y < (row * brick.height)) {
            
            var bY = ball.y - ball.size;
            var bX = ball.x;
            
            for(length = bricks.length-1, i = length; i > 0; i--){
                
                var brX = bricks[i].x;
                var brY = bricks[i].y + brick.height;
                
                if(bX > brX  && bX < (brX + brick.width) && bY < (brY + brick.height)){
                    
                    bricks.splice(i,1);
                   
                   if(generateRandom(0,1) === 1){
                        bonuses.push({x: brX - (brick.width/2), y: brY, color: "black", text:"+1"});                        
                    }
                    else {
                        bonuses.push({x:brX - (brick.width/2), y: brY, color:"red", text: "-1"});  
                    }
                    
                    ball.speedX = generateRandom(-10,10);
                    ball.speedY = generateRandom(5,10);
                    break;
                    
                }
                
            }

        }
        
        //BONUS collission check
        else if(bonuses.length > 0){
            
            for(i=0; i< bonuses.length; i++){
                
                //if coins collide with player
                if(bonuses[i].x > player.x && bonuses[i].x < (player.x + player.width) && bonuses[i].y > player.y ){
                    
                    if(bonuses[i].text === "+1"){
                        
                        score++;
                        
                    }
                    else{
                        
                        score--;
                    }
                    
                    
                    bonuses.splice(i,1);
                    
                }
                
                //if coins fall
                else if(bonuses[i].y > Height){
                                        
                    bonuses.splice(i,1);
                    
                }
                
            }
            
        }
        
        //UPPER boundary check
        else if((ball.y - ball.size) < 0){
            
             ball.speedX = generateRandom(-5,5);
             ball.speedY = generateRandom(0,6);
            
        }
        
        //LOWER boundary check
        else if((ball.y) > Height){
            
             clearInterval(timer);
             alert("Dead");
             start();
            
        }          
                
    }
    
    function generateRandom(min, max){
        
         return Math.floor(Math.random() * (max - min + 1)) + min;
    }
 
    function generateBricks(){
        
            var bX, bY;        
            var bricksHeight = generateRandom(8,12) * brick.height;
            var numBricks = (Width * bricksHeight)/(brick.height * brick.width);
            row = Width/brick.width;
            col = (numBricks * brick.width)/Width;
       

            for(i = 0; i < row; i++){

                for(j = 2; j < col; j++){

                    bX = i * brick.width;
                    bY = j * brick.height;                    
                    bricks.push({x: bX, y: bY, color:colors[generateRandom(0, colors.length - 1)]});

                }

            }
        
        
    }
    
    function drawBricks(){
                
        for(length = bricks.length-1, i = length; i >= 0; i--){
            
            ctx.beginPath();
            ctx.strokeStyle = "whitesmoke";
            ctx.strokeRect(bricks[i].x, bricks[i].y, brick.width, brick.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.fillStyle = bricks[i].color;
            ctx.fillRect(bricks[i].x+1, bricks[i].y+1, brick.width-1, brick.height-1);
            ctx.fill();
            
                
        }
        
    }
    
    function drawBonuses(){
                
        for(length = bonuses.length-1, i = length; i >= 0; i--){
 
            ctx.font = "bolder 18px Cursive";
            ctx.fillStyle = bonuses[i].color;
            ctx.fillText(bonuses[i].text, bonuses[i].x, bonuses[i].y);

        }
        
    }
            
    function setCanvasSize(){
        
        Width = $(document).width();
        Height = $(document).height();
        
        
            
        $("#canvas").attr("width", Width);
        $("#canvas").attr("height", Height);
     
    }
    
    
    
    
    
    
});
	
