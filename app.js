//indeed content crawler 
// use node
//use ES7  async/await
//author @amormaid

const cheerio = require('cheerio');
const superagent = require('superagent');
const url = require('url');
const  eventproxy = require('eventproxy');
const fs = require('fs');
const xlsx = require('node-xlsx'); 


var buffer ;
var  items = [];
var page_index = 0 ;
var file_index =   page_index/100 ;   //95

main(6);   

function isNULL(e){
	return typeof e === 'object' && !(e instanceof  Object);
}

function str_trim(a){
	return typeof a === 'string' ? a.replace(/\n/g,''): "null" ;
}

function get_real_Date(str){
	if(typeof str === 'string'){
		try{
			var days = 0,hours = 0;
			if(str.search(/day/)){
				days =  parseInt(str.match(/(\d)+.*(?=day)/g)[0]);
				return  new Date((new Date()).getTime() - days*24*60*60*1000).toString().slice(4,15);
			}else if(str.search(/hour/)){
				hours =  parseInt(str.match(/(\d)+.*(?=hour)/g)[0]);
				return  new Date((new Date()).getTime() - hours*60*60*1000).toString().slice(4,15);
			}
		}catch(e){
			return 'null';
		}
	}else{
		return 'null';
	}
}

function write_to_excel(){
	buffer = xlsx.build([
		{
			name:'sheet'+file_index,
			data:items
		}        
	]);
	
	fs.writeFileSync('test'+file_index+'.xlsx',buffer,{'flag':'w'});
	console.log('write file test'+file_index+'.xlsx  success !!');		
	file_index++;
	buffer = null ;
	items = [];	
}

async function get_contents(index){
	page_index++;
	var temp_index = index ;
	var status_indicator = false ;
	setTimeout(function(){
		if(!status_indicator){
			console.log('page parsing of '+temp_index+' restart');
			return get_contents(temp_index);
		}
	},10000);
	//index means page_number
	//every page contents 10 jobs
	//var content_url = 'https://www.indeed.com/jobs?q=&l=California&start='+10*index;
	
	var content_url;
	if(index === 0){
		content_url = 'https://www.indeed.com/jobs?q=javascript&l=CA';
	}else{
		content_url = 'https://www.indeed.com/jobs?q=javascript&l=CA&start='+10*index;
	}
	
	superagent.get(content_url).end(function (err, sres) {

		try{
			var $ = cheerio.load(sres.text);
			$('.row.result').each(function (idx, element) {
				var $element = $(element);
				var temp_arr = [];
				
				//content
				temp_arr[0] = $(element).find('.jobtitle a').html(); //title
				temp_arr[1]  = str_trim($($element).find('.company a').html());//company
				temp_arr[2] = $($element).find('.location').html();//company_location
				temp_arr[3]  = str_trim($($element).find('.summary').html());//summary
				temp_arr[4] = get_real_Date($($element).find('.date').html());//date
				temp_arr[5] = (function(){
						var a = $($element).find('.snip div');
						if(a.length > 11 ){
							return  str_trim($($element).find('.snip div').first().text());
						}else{
							return 'null';
						}
					})();//salary
 				items.push(temp_arr);
				temp_arr = null;
			});;
			console.log('parse jobs  '+(index*10)+' -- '+(index*10+9)+'  success !');
			status_indicator = true ;
			
			//write content into an excel 
			if(items.length >0 && items.length%1000  === 0  || index === 777 ){
				write_to_excel();
			}
			
			get_contents(page_index);
		
		}catch(e){
			console.log(e.message);
			console.log('program is wrong at page '+temp_index);
		}

	});
}

function main(thread){
	for(var i=0;i<thread;i++){
		setTimeout(function(){get_contents(page_index);},1000*i);
		console.log('crawer '+i+' is  running !');
	}
}
