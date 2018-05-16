//var express = require('express');
//var utility = require('utility');
//var app = express();
const cheerio = require('cheerio');
const superagent = require('superagent');
const url = require('url');
const  eventproxy = require('eventproxy');
const fs = require('fs');
const xlsx = require('node-xlsx'); //基于Node.js解析excel文件数据及生成excel文件，仅支持xlsx格式文件；

/*
// 存放月报路径
var filepath = 'D:\\node_project\\indeed_crawler\\test_xlsx';
// 整理后文件及路径
var savepath = "D:\\node_project\\indeed_crawler\\indeed.xlsx";
// 获得月报下的文件集合
var filesList = fs.readdirSync(filepath);
//读取文件内容
var obj = xlsx.parse(__dirname+'/test.xlsx');
var excelObj=obj[0].data;
console.log(excelObj);

var data = [];
for(var i in excelObj){
    var arr=[];
    var value=excelObj[i];
    for(var j in value){
        arr.push(value[j]);
    }
    data.push(arr);
}
var buffer = xlsx.build([
    {
        name:'sheet1',
        data:data
    }        
]);

//将文件内容插入新的文件中
fs.writeFileSync('test1.xlsx',buffer,{'flag':'w'});

*/


function isNULL(e){
	return typeof e === 'object' && !(e instanceof  Object);
}

function str_trim(a){
	return typeof a === 'string' ? a.replace(/\n/g,''): "null" ;
}

function get_real_Date(str){
	if(typeof str === 'string'){
		var days = 0;
		if(str.search(/day/)){
			days =  parseInt(str.match(/(\d)+.*(?=day)/g)[0]);
			return  new Date((new Date()).getTime() - days*24*60*60*1000).toString().slice(4,15);
		}else{
			return  'null' ;
		}	
	}
}


function get_contents(content_url){
	var index = 0;
	// 用 superagent 去抓取 https://cnodejs.org/ 的内容
	superagent.get(content_url).end(function (err, sres) {
		// 常规的错误处理
		try{
			var $ = cheerio.load(sres.text);
			//console.log(typeof $);
			var  items = [];
			$('.row.result').each(function (idx, element) {
				var $element = $(element);
/*
				items.push({
					title:$(element).find('.jobtitle a').html(),
					company:str_trim($($element).find('.company a').html()),
					company_location:$($element).find('.location').html(),
					summary:str_trim($($element).find('.summary').html()),
					date:get_real_Date($($element).find('.date').html()),
					salary:(function(){
						var a = $($element).find('.snip div');
						if(a.length > 11 ){
							return  str_trim($($element).find('.snip div').first().text());
						}else{
							return 'not mentioned';
						}
					})()
				});
*/
				var temp_arr = [];
				temp_arr[0] = $(element).find('.jobtitle a').html();
				temp_arr[1]  = str_trim($($element).find('.company a').html());
				temp_arr[2] = $($element).find('.location').html();
				temp_arr[3]  = str_trim($($element).find('.summary').html());
				temp_arr[4] = str_trim($($element).find('.summary').html());
				temp_arr[5] = 	get_real_Date($($element).find('.date').html());
				temp_arr[6] = (function(){
						var a = $($element).find('.snip div');
						if(a.length > 11 ){
							return  str_trim($($element).find('.snip div').first().text());
						}else{
							return 'null';
						}
					})();
					
 				items.push(temp_arr);
				temp_arr = null;
				
			});;
			//console.log(items);
			console.log('parse items  '+(index+1)+' -- '+(index+9)+'  success !');
			//return items;
			

//console.log(content);
var buffer = xlsx.build([
    {
        name:'sheet1',
        data:items
    }        
]);

//将文件内容插入新的文件中
fs.writeFileSync('test1.xlsx',buffer,{'flag':'w'});
console.log('write success !!');		
			
		}catch(e){
			console.log(e.message);
		}
	});
}
//   https://cnodejs.org/
// https://www.indeed.com/jobs?l=California&start=10
var  indeed_url = 'https://www.indeed.com/jobs?q=&l=California';

//  var  indeed_url = 'https://www.indeed.com/jobs?l=California&start='+10;


var  content = get_contents(indeed_url);











/*

app.get('/', function (req, res, next) {
  // 用 superagent 去抓取 https://cnodejs.org/ 的内容
  superagent.get('https://cnodejs.org/')
    .end(function (err, sres) {
      // 常规的错误处理
      if (err) {
        return next(err);
      }
      // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
      // 就可以得到一个实现了 jquery 接口的变量，我们习惯性地将它命名为 `$`
      // 剩下就都是 jquery 的内容了
      var $ = cheerio.load(sres.text);
      var items = [];
      $('#topic_list .topic_title').each(function (idx, element) {
        var $element = $(element);
        items.push({
          title: $element.attr('title'),
          href: $element.attr('href')
        });
      });

      res.send(items);
    });
});

app.listen(3000, function (req, res) {
  console.log('app is running at port 3000');
});
*/

/*
var sleep = function (time) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, time);
    })
};



var start = async function () {
    // 在这里使用起来就像同步代码那样直观
    console.log('start');
    await sleep(3000);
    console.log('end');
};

start();




const http = require('http');
async function ab() {
    //这里的关键是await后面要跟一个Promise
    await new Promise(function(resolve) {
        http.get('http://www.baidu.com/', (res) => {
            console.log('1');
            resolve();
        })
    });
    console.log('2');
    console.log('3');
}
ab();



*/

/*
async function main() {
 await ping();
}

async function ping() {
 for (var i = 0; i < 10; i++) {
 await delay(300);
 console.log("ping");
 }
}
//function delay(ms: number) {
function delay(ms=300) {
 return new Promise(resolve => setTimeout(resolve, ms));
}

main();


*/
/*
function async getTrace () {  
  let pageContent
  try { 
    pageContent = await fetch('https://www.jdon.com', { 
      method: 'get' 
    }) 
  } catch (ex) { 
    console.error(ex) 
  } 
 
  return pageContent
} 
 
getTrace()  
  .then() 
  
  */
  
 /* 
const  fs = require('fs'); 
const  path = require('path'); 
const  request = require('request'); 

var movieDir = __dirname + '/movies',
    exts     = ['.mkv', '.avi', '.mp4', '.rm', '.rmvb', '.wmv'];


// 读取文件列表
var readFiles = function () {
    return new Promise(function (resolve, reject) {
        fs.readdir(movieDir, function (err, files) {
            resolve(files.filter((v) => exts.includes(path.parse(v).ext)));
        });
    });
};

// 获取海报
var getPoster = function (movieName) {
    let url = `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`;

    return new Promise(function (resolve, reject) {
        request({url: url, json: true}, function (error, response, body) {
            if (error) return reject(error);

            resolve(body.subjects[0].images.large);
        })
    });
};

// 保存海报
var savePoster = function (movieName, url) {
    request.get(url).pipe(fs.createWriteStream(path.join(movieDir, movieName + '.jpg')));
};


(async () => {
    let files = await readFiles();

    // await只能使用在原生语法
    for (var file of files) {
        let name = path.parse(file).name;

        console.log(`正在获取【${name}】的海报`);
        savePoster(name, await getPoster(name));
    }

    console.log('=== 获取海报完成 ===');
})();


*/

