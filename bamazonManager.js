const mysql=require("mysql");
const inquirer=require("inquirer");
const colors = require('colors');
var strpad = require('strpad');

require("dotenv").config();
var keys = require("./keys.js");


const connection = mysql.createConnection( keys.dbpassword);


//begin manage view
function managerview(){
    console.log("\n\r");
    inquirer.prompt([
        {
            name: "item",
            type: "list",
            message: ("What would you like to do?\n\r").bold.blue,
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
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
        ]).then((mgrorder) => {
            if(mgrorder.item==='View Products for Sale'){
                display("view");
            }else if(mgrorder.item==='View Low Inventory'){
                display("low",5);
            }else if(mgrorder.item==='Add to Inventory'){
                display("addinventory");
            }else if(mgrorder.item==='Add New Product'){
                connection.query('select distinct(department_name) as dep FROM bamazon_db.departments', (err, data) => {
                    if(err) throw err; 
                    var deplist=[];
                    for(var i=0;i<data.length;i++){
                        deplist.push(data[i].dep);
                    }
                    
                    inquirer.prompt([
                        {
                            name: "productname",
                            message: ("\n\rWhat is the name of the product you would like to add?".bold.yellow)
                        },
                        {
                            name: "deptname",
                            type: "list", 
                            message: ("\n\rWhich department does this product fall into?".bold.yellow),
                            choices: deplist
                        },
                        {
                            name: "productcost",
                            validate: function(value){
                                if(isNaN(value)===false && value>0){
                                    return true;
                                }
                                return false;
                            },
                            message: ("\n\rHow much does it cost?".bold.yellow)
                        },
                        {
                            name: "productnum",
                            validate: function(value){
                                if(isNaN(value)===false && value>=0){
                                    return true;
                                }
                                return false;
                            },
                            message: ("\n\rHow many do we have?".bold.yellow)
                        }
                    ]).then((addproduct) => {
                        display("addnewproduct",addproduct);
                    });
                });
            }
        }
    );
}

managerview();

function display(whr,quantity){

    //Creates query based on the manager selection    
    if(whr==="view" || whr==="addinventory"){
        var sqlquery='select * from products';
    }else if(whr==="low"){
        var sqlquery='select * from products where stock_quantity<'+quantity;
    }else if(whr==="update"){
        var sqlquery="UPDATE products SET stock_quantity=stock_quantity+"+quantity.itemcount+" WHERE item_id="+quantity.itemid;
    }else if(whr==="addnewproduct"){
        var sqlquery="insert into products SET product_name='"+quantity.productname+"'"
        +", department_name='"+quantity.deptname+"'"+", price="+quantity.productcost+
        ", stock_quantity="+quantity.productnum;
    }

    const query=connection.query(sqlquery, (err, data) => {
        if(err) throw err; 
        var itemlist={items:[],itemsid:[]};
        
        if(whr!=="update" && whr!=="addnewproduct"){
            console.log("\n\r");
            console.log((`\n\r${strpad.center('ITEMID', 6)} | ${strpad.right('PRODUCT NAME', 35)} | ${strpad.right('DEPARTMENT NAME', 15)} | ${strpad.left('PRICE', 8)} | ${strpad.left('STOCK', 7)}  \n${'---------------------------------------------------------------------------------------'}\n`),);
        }else if(whr==="update"){
            //perform a check in case the manager enters a wrong id for inventory update
            connection.query('select count(*) as idexist,product_name from products where item_id=?',[quantity.itemid], (err, testdata) => {
                if(err) throw err;
                if(testdata[0].idexist>0){
                    console.log(("\n\rSuccessfully added "+quantity.itemcount+" "+testdata[0].product_name+"\n\r").bold.green);
                }else{
                    console.log(("\n\r"+quantity.itemid+" ID does not exist Try Again!!!\n\r").bold.bgRed);
                }
                managerview();

            });
            
        }else if(whr==="addnewproduct"){
            console.log(("\n\r"+quantity.productnum+" "+quantity.productname+" Successfully added to BAMAZON\n\r").bold.green);
        }

        //this message display is for the situation when there is no low inventory
        if(whr==="low"){
            connection.query('select count(*) as lowcount from products where stock_quantity<'+quantity, (err, testdata) => {
                if(err) throw err;
                if(testdata[0].lowcount===0){
                    console.log(("\n\r\n\rYay!! we are fully stocked. None of the proucts have inventory below "+quantity).bold.green); 
                }
                managerview();
            });
            
        }
        for(var i=0;i<data.length;i++){
            itemlist.items.push(`${strpad.center(data[i].item_id.toString(), 6)} | ${strpad.right(data[i].product_name, 35)} | ${strpad.right(data[i].department_name, 15)} | ${strpad.left(data[i].price.toFixed(2).toString(), 8)} | ${strpad.left(data[i].stock_quantity.toString(), 7)}`);
            itemlist.itemsid.push(data[i].item_id);
            console.log(itemlist.items[i]+"\n\r");
        }
                
        if(whr!=="addinventory" && whr!=="update"  && whr!=="low"){
            managerview();
        }

        if(whr==="addinventory"){
            inquirer.prompt([
                {
                    name: "itemid",
                    message: ("\n\rWhat is the id of the item you would like to add to?".bold.yellow)
                },
                {
                    name: "itemcount",
                    validate: function(value){
                        if(isNaN(value)===false && value>0){
                            return true;
                        }
                        return false;
                    },
                    message: ("How many would you like to add?".bold.yellow)
                }
            ]).then((additem) => {
                display("update",additem);
            });
        }
    });

}
