var example = [ 
    [1,2,3,4,5],
    [16,17,18,19,6],
    [15,24,25,20,7],
    [14,23,22,21,8],
    [13,12,11,10,9]
];

function snail(matrix) {
    var snail =  []
    var yMax = matrix.length - 1
    var xMax = matrix[0].length - 1    

    var xStart = 0
    var yStart = 0
    
    while(yStart <= yMax && xStart <= xMax ){
        //left to right
        for(var i = xStart; i <= xMax; i++){
            snail.push(matrix[yStart][i])
        }

        //top to bottom
        for(var i = yStart + 1; i <= yMax; i++){
            snail.push(matrix[i][xMax])
        }

        //right to left
        if(xStart + 1 <= xMax ){
            for(var i = xMax - 1; i >= xStart; i--){
                snail.push(matrix[yMax][i])
            }
        }
        

        //bottom to top
        if(yStart+ 1 <= yMax){
            for(var i = yMax - 1; i > yStart ; i--){
                snail.push(matrix[i][xStart])
            }    
        }
        
        yStart++
        xStart++
        yMax--
        xMax--

    }
    return snail
}

console.log(snail(example))