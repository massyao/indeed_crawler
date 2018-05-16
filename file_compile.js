
const fs = require('fs');
const xlsx = require('node-xlsx'); 



// 目标excel文件存放路径
var filepath = 'D:\\node_project\\indeed_crawler\\test_xlsx';
// 整理后文件及路径
var savepath = "D:\\node_project\\indeed_crawler\\indeed.xlsx";

var globe_data = [];
main();

async function read_one_excel(index){
	var xlsx_arr = xlsx.parse(__dirname+'/test_xlsx/test'+index+'.xlsx');
	//console.log(xlsx_arr[0]);
	//console.log();
	var excel_arr=xlsx_arr[0].data;	
	
	for(var j in excel_arr){
		var arr=[];
		var value=excel_arr[j];  //把array当关联数组用，速度会略慢，下一步改for循环
		for(var k in value){
			arr.push(value[k]);
		}
		globe_data.push(arr);
	}	
	console.log('program parsed '+globe_data.length+' rows of data !');
}
async function read_excels(){
	// 获得excel文件集合
	var filesList = fs.readdirSync(filepath);

	for(let i=0;i<filesList.length;i++){
		//读取文件内容
		await  read_one_excel(i);
	}
}

async function write_compile_file(){
	console.log('build the excel !');
	// build the new excel
	var buffer = xlsx.build([
		{
			name:'sheet1',
			data:globe_data
		}        
	]);
	
	globe_data = [];//释放内存
	//将文件内容插入新的文件中
	fs.writeFileSync('compile.xlsx',buffer,{'flag':'w'});
	console.log('bingo !');
	buffer = null ;  //释放内存
	
}

async function main(){
	await read_excels();
	write_compile_file();
}





