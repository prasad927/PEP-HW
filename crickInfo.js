
let cheerio=require("cheerio");
let request=require("request");
let fs=require("fs");
let path=require("path");
const { stringify } = require("querystring");
let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595/match-results";

request(url,cb);

function cb(error,resp,html){
    if(error){
        console.log(error);
    }else{
        extractHtml(html);
    }
}

function extractHtml(html){
    let selectorTool = cheerio.load(html);
    let allMatchesDom = selectorTool(".match-score-block");
    for(let i=0;i<allMatchesDom.length;i++){
          let eachMatchDom = selectorTool(allMatchesDom[i]);
          let scorcardDom = selectorTool(eachMatchDom).find(".match-info-link-FIXTURES");
          let scrLink = scorcardDom.attr("href");
          let fullLink="https://www.espncricinfo.com"+scrLink;//making full link with url(link to scorcard)
          extractTeamNames(fullLink);
    }
}

function extractTeamNames(fullLink){
    console.log(fullLink);
    request(fullLink,cb);
    function cb(err,resp,html){
        if(err){
            console.log(err);
        }else{
            extractTeamNameAndVenue(html);
            //console.log(html);
        }
    }    
}

function extractTeamNameAndVenue(html){
    let selectorTool = cheerio.load(html);
    let matchDetailDom = selectorTool(".match-info.match-info-MATCH");

    //Extracting result 
    let statusDom = selectorTool(matchDetailDom).find(".status-text");
    let result=statusDom.text();
    console.log(result);//convert this in string;*/

    //extracting venue

    let datevenueDom = selectorTool(matchDetailDom).find(".description")
    let Venue = datevenueDom.text().split(",")[1].trim();
    console.log(Venue);

    //extract date
    let date=datevenueDom.text().split(",")[2].trim();
    console.log(date);
    /*********************************************** */
    let teamNameDom=selectorTool(".header-title.label ");
    teamNameDom = teamNameDom.slice(0,2);
    let teamNameArr=[]
    for(let i=0;i<teamNameDom.length;i++){
        let name=selectorTool(teamNameDom[i]).text();
        name=name.split("INNINGS")[0];
        teamNameArr.push(name);
    }
    /*table for players (batsman table)*/
    let temp=1;
    let batsManTableDom = selectorTool(".table.batsman");
    for(let j=0;j<batsManTableDom.length;j++){
         let batsManDetatil=selectorTool(batsManTableDom[j]).find("tbody>tr");//all batsman out not out
         for(let i=0;i<batsManDetatil.length;i++){
             let batsManStats = selectorTool(batsManDetatil[i]).find("td");
             let obj={
             }
             obj.table=[];
             if(batsManStats.length==8){
                 /*extract each stat*/
                 let name= selectorTool(batsManStats[0]).text().trim();
                 let run = selectorTool(batsManStats[2]).text().trim();
                 let ball= selectorTool(batsManStats[3]).text().trim();
                 let fours=selectorTool(batsManStats[5]).text().trim();
                 let sixes=selectorTool(batsManStats[6]).text().trim();
                 let srate=selectorTool(batsManStats[7]).text().trim();
                 //console.log(name+"  "+run+"  "+ball+"  "+fours+"  "+sixes+"  "+srate+"  VS  "+teamNameArr[temp]);
                 let stObj={
                     "runs":run,
                     "ball":ball,
                     "fours":fours,
                     "sixes":sixes,
                     "srate":srate,
                     "date":date,
                     "venue":Venue,
                     "result":result,
                     "opponentName":teamNameArr[temp]
                 }
                 obj.table.push(stObj)
                 let selfteamname=teamNameArr[j].trim();
                 createAndWriteFile(name,selfteamname,obj);
            } 
        }
        temp--;
        console.log("****************************************");
    }
}

/*create json file to that foleder*/
function createAndWriteFile(playerName,teamName,obj){
    //let mainfolderPath="C:\\Users\\pc\\Desktop\\WebScrapping\\raw\\pocs\\IPL2020"
    let pathOfFoleder = path.join("C:\\Users\\pc\\Desktop\\WebScrapping\\raw\\pocs\\IPL2020",teamName);
    if(fs.existsSync(pathOfFoleder)==false){
        fs.mkdirSync(pathOfFoleder);
    }
    console.log("CREATE AND WRITE FILE CALLED");
    /*creating playere json file*/
    let pathOfFile = path.join(pathOfFoleder,playerName+".JSON");

   /* let createStream = fs.createWriteStream(pathOfFile,{flags:'a'});
    createStream.write(JSON.stringify(dataArr));
    createStream.end();*/
    fs.writeFileSync(pathOfFile,JSON.stringify(obj),{flag:'a+'});
    
}