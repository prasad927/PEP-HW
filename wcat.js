
let fs = require("fs");
let path = require("path");

function readContent(dirPath){
        try {  
   
            let content = fs.readFileSync(path.join(dirPath), 'utf8');
            return content;
         } catch(e) {
            console.log('Error:', e.stack);
         }

}

function sCommand(dirpath){
            let content=readContent(dirpath);
            let contentArr = content.split("\r\n");
            for(let i=0;i<contentArr.length;i++){
                 if(contentArr[i].length> 0){
                    console.log(contentArr[i]);
                 }
            }
}

function nCommand(dirpath){
            let content=readContent(dirpath);
            let contentArr = content.split("\r\n");
            let count=1;
            for(let i=0;i<contentArr.length;i++){
                    console.log(count,contentArr[i]);
                    count++;
            }
}

function bCommand(dirpath){
           let content=readContent(dirpath);
           let contentArr = content.split("\r\n");
           let count=1;
           for(let i=0;i<contentArr.length;i++){
                  if(contentArr[i].length > 0){
                      console.log(count,contentArr[i]);
                      count++;
                  }
           }
}

let input = process.argv.slice(2);

if(input[0]=="-s"||input[0]=="-n"||input[0]=="-b"){
    let cmd=input[0];
    //node wcat.js -s filepath => convert big line breaks into a singular line break
    //node wcat -n filepath => give numbering to all the lines
    //node wcat -b filepath => give numbering to non-empty lines 
    switch(cmd){
        case "-s":
                    sCommand(input[input.length-1]);
                    break;
        case "-n":
                    nCommand(input[input.length-1]);
                    break;
        case "-b":
                    bCommand(input[input.length-1]);
                    break;  
        default: 
                    console.log("User enter wrong command");
                    break;
    }

}else{

    let content="";
    for(let i=0;i<input.length;i++){
         content+=readContent(input[i]);
    }
    console.log(content);
}