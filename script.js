'use strict';

$(window).load(function(){
 
    var canvas = $("#canvas")[0];
    var ctx = canvas.getContext('2d');
        
    var Width,
        Height,
        i, j,
        bricks,
        bonuses,
        row,
        col,
        timer,
        score, lives,
        colors,    
        brick,
        player, 
        ball,
        bonus,
        gameStarted;
     
    
    function start(){
        
        bricks = [];
        bonuses = [];
        score = 0;
        lives = 3;
        gameStarted = false;
        colors = ['gray', 'dimgray']
        
        brick = {
        
            color:"gray",        
            height:20,
            width:40
        
        }
        
        player = {         
        
            color:"limegreen",
            lineColor: "black",
            height:20,
            width:200,
            x:0,
            y:0,

            setY: function(){

                this.y = Height - this.height*2 - $("#scoreBar").height();
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
                this.y = ((col * brick.height) + brick.height) + ball.size; 
            }
        
    }
        
        bonus = {
        
            color:"yellow",
            font:"bolder 18px Cursive",            
            size:5,
            speedY:10
        
        }
        
        player.setX();
        
        player.setY();
        
        ball.setX();         
        
        generateBricks();
        
        ball.setY();
        
        draw();
        
        checkLife();
        
        
    }
    
    
    $("#canvas").mousemove(function(e){   
            
        if(gameStarted) player.x = e.pageX - player.width/2; 
            
    });

    $("#stop").click(function(){

        clearInterval(timer);  
        gameStarted = false;
        
    });

    $("#start").click(function(){ 

        if(!gameStarted){
            $(this).css("visibility", "hidden");
        }
        
        startCountDown();

    });
   
    setCanvasSize();
    
    //start();
    
    function draw(){
        
        //clear canvas
        ctx.clearRect(0, 0, Width, Height);
        
        //draw ball
        ctx.beginPath();        
        ctx.fillStyle = ball.color;
        
        if(gameStarted){
            
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            
        }
        
        
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
        
        ctx.beginPath();
        ctx.strokeStyle = player.lineColor;
        ctx.strokeRect(player.x, player.y, player.width - 1, player.height - 1);
        ctx.stroke();
        
        drawBricks();
        
        //draw coins
        if(bonuses.length > 0){
            
            for(i=0; i< bonuses.length; i++){
                
                bonuses[i].y += bonus.speedY;
                
            }
            
            drawBonuses();
        }
        
         
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
        
        //Check collission with player
        else if(ball.x > player.x && ball.x < (player.x+player.width) && (ball.y+ball.size) > player.y && (ball.y+ball.size) < (player.y + player.height)){
            
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
                   
                    var random = generateRandom(0,1);
                    console.log("Rnd " + random);
                    
                   if(random === 1){
                   
                        bonuses.push({x: (brX + (brick.width/2)), y: brY, color: "black", text:"+1"});                        
                    }
                    else {
                        bonuses.push({x:(brX + (brick.width/2)), y: brY, color:"red", text: "-1"});  
                    }
                    
                    
                    
                    ball.speedX = generateRandom(-10,10);
                    ball.speedY = generateRandom(5,10);
                    break;
                    
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
            
             lives--;
             checkLife();
            
        }  
        
        //BONUS collission check        
        if(bonuses.length > 0){
                        
            for(i = 0; i < bonuses.length; i++){
                
                //if bonus collides crosses the y limit
                if(bonuses[i].y > player.y ){
                    
                    if(bonuses[i].x > player.x && bonuses[i].x < (player.x + player.width)){
                        
                        if(bonuses[i].text === "+1") score++;  
                        
                        else{
                          
                            score--;
                            if(score < 0 ) score = 0;                            
                        } 
                        
                        updateScore();
                        
                    }
                                      
                    bonuses.splice(i,1);
                    
                }
                
            }
            
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

                for(j = 0; j < col; j++){

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
                
        for(length = bonuses.length, i = 0; i < length; i++){
 
            ctx.font = "bolder 18px Cursive";
            ctx.fillStyle = bonuses[i].color;
            ctx.fillText(bonuses[i].text, bonuses[i].x, bonuses[i].y);

        }
        
    }
            
    function setCanvasSize(){
        
        Width = $("body").width();
        Height = $("body").height();
                  
        $("#canvas").attr("width", Width);
        $("#canvas").attr("height", Height);
     
    }
    
    function updateScore(){
        
        $("#score").text("Score : " + score);
        
    }
    
    function checkLife(){
   
        if(lives < 0){
            
            lives = 0;
            
            clearInterval(timer);
           
            gameStarted = false;
            
            //show game over message
            var msg = "Game Over";
            ctx.font = "bolder 100px Cursive";
            ctx.fillStyle = "whitesmoke";
            ctx.fillText(msg, Width/2 - (msg.length*100)/4, Height/2);
            
            //show start game button
            $("#start").css("visibility", "visible");
            
           
        }
        else{
            
            if(gameStarted){
                
                 ball.setX();
                 ball.setY(); 
                 
            }
           
            
        }
        
        $("#lives").text("Lives : " + lives);
        
    }
    
    function startCountDown(){
        
        var num = 3;
        start();
        
        var counter = setInterval(count, 1000);
        
        
        function count(){
            
            ctx.clearRect(0, 0, Width, Height);            
            draw();
            ctx.font = "bolder 100px Cursive";
            ctx.fillStyle = "whitesmoke";
            if(num !== 0) ctx.fillText(num.toString(), Width/2, Height/2);
            else ctx.fillText("Go", Width/2, Height/2);
            ctx.fillText(num.toString(), Width/2, Height/2);
            num--;
            
            if(num < 0){
                
                clearInterval(counter);
                
                clearInterval(timer);
                timer = setInterval(draw, 30); 
                gameStarted = true;
                
            }
            
        }
        
    }
        
});
	
