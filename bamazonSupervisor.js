const mysql=require("mysql");
const inquirer=require("inquirer");
const colors = require('colors');
var strpad = require('strpad');

require("dotenv").config();
var keys = require("./keys.js");


const connection = mysql.createConnection( keys.dbpassword);

//begin supervisor view
function supervisorview(){
    inquirer.prompt([
        {
            name: "item",
            type: "list",
            message: ("What would you like to do?\n\r").bold.blue,
            choices: ['View Product Sales by Department', 'Create New Department', 'Quit']
        },
        {
            when: (response) => { 
                
                if(response.item!=='Quit'){
                    return false;
                }else{ 
                    console.log("Good Bye!!".magenta.bold);
                    process.exit();
                }
            }
        }
        ]).then((superorder) => {
            
            if(superorder.item==='View Product Sales by Department'){

                console.log("\n\r");
                console.log((`\n\r${strpad.center('DEPARTMENT_ID', 6)} | ${strpad.right('DEPARTMENT NAME', 35)} | ${strpad.left('OVERHEAD COSTS', 8)} | ${strpad.left('PRODUCT SALES', 8)} | ${strpad.left('TOTAL PROFIT', 8)}\n${'-----------------------------------------------------------------------------------------------------'}\n`),);

                connection.query("select department_id, department_name,over_head_costs, sum(product_sales) as totalsales from (SELECT departments.*,products.product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name) as sumtable group by department_name  order by totalsales  desc", (err, datajoin) => {
                    if(err) throw err; 
                    var profit=[], itemlist={items:[],itemsid:[]};
                    for(var i=0;i<datajoin.length;i++){

                        if(datajoin[i].totalsales==null){datajoin[i].totalsales=0;}
                        if(datajoin[i].over_head_costs==null){datajoin[i].over_head_costs=0;}

                        profit.push(datajoin[i].totalsales-datajoin[i].over_head_costs);

                        itemlist.items.push(`${strpad.center(datajoin[i].department_id.toString(), 13)} | ${strpad.right(datajoin[i].department_name, 35)} | ${strpad.left(datajoin[i].over_head_costs.toFixed(2).toString(), 14)} | ${strpad.left(datajoin[i].totalsales.toFixed(2).toString(), 13)} | ${strpad.left(profit[i].toFixed(2).toString(), 8)}`);

                        console.log(itemlist.items[i]+"\n\r");
                        
                    }
                    supervisorview();
                });
                

            }else if(superorder.item==='Create New Department'){
                inquirer.prompt([
                    {
                        name: "depname",
                        message: ("Enter the department name?").bold.blue,
                    },
                    {
                        name: "overhead",
                        validate: function(value){
                            if(isNaN(value)===false && value>0){
                                return true;
                            }
                            return false;
                        },
                        message: ("Enter the department over head costs?").bold.blue,
                    }
                    ]).then((adddept) => {
                        console.log(adddept.depname,adddept.overhead);
                        connection.query(`insert into departments SET department_name='${adddept.depname}', over_head_costs=${adddept.overhead}`, (err, datainsert) => {
                            if(err) throw err; 
                            console.log("New department has been added");
                            supervisorview();
                            
                        });
                        
                    }
                );
            }
            
        }
    );
}

supervisorview();
