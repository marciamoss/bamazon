const mysql=require("mysql");
const inquirer=require("inquirer");
const colors = require('colors');
var strpad = require('strpad');

require("dotenv").config();
var keys = require("./keys.js");


const connection = mysql.createConnection( keys.dbpassword);


function customerview(){
    connection.query('select * from products', (err, data) => {
        if(err) throw err; 
        var itemlist={items:[],itemsid:[]};
        itemlist.items.push(`${strpad.center(("Select this to quit or use your arrow key to order\n\r".bgRed.bold),100)}`);
        itemlist.itemsid.push("q");
        for(var i=0;i<data.length;i++){
            itemlist.items.push(`${strpad.center(data[i].item_id.toString(), 6)} | ${strpad.right(data[i].product_name, 35)} | ${strpad.right(data[i].department_name, 15)} | ${strpad.left(data[i].price.toFixed(2).toString(), 8)} | ${strpad.left(data[i].stock_quantity.toString(), 7)}`);
            itemlist.itemsid.push(data[i].item_id);
        }
        
        inquirer.prompt([
            {
                name: "item",
                type: "list",
                message: (`\nWHAT IS THE ITEM YOU WOULD LIKE TO PURCHASE?\n\r`.bold.bgBlue+`${strpad.center('ITEMID', 8)} | ${strpad.right('PRODUCT NAME', 35)} | ${strpad.right('DEPARTMENT NAME', 15)} | ${strpad.center('PRICE', 8)} | ${strpad.center('STOCK', 7)}  \n${'---------------------------------------------------------------------------------------'}\n`),
                choices: itemlist.items,
                pageSize:15
            },
            {
                when: (response) => { 
                    
                    if(response.item!==
                        '              \u001b[1m\u001b[41mSelect this to quit or use your arrow key to order\n\r\u001b[49m\u001b[22m               '){
                        return false;
                    }else{ 
                        console.log("Good Bye!!".magenta.bold);
                        process.exit();
                    }
                }
            },
            {
                name: "quantity",
                validate: function(value){
                    if((isNaN(value)===false && value>0) || value.toLowerCase()==='q'){
                        return true;
                    }
                    return false;
                },
                message: ("\nHow many would you like? [PRESS Q TO QUIT]")
            },
            {
                when: (response) => { 
                    
                    if(response.quantity.toLowerCase()!=='q'){
                        return false;
                    }else{ 
                        console.log("Good Bye!!".magenta.bold);
                        process.exit();
                    }
                }
            },
        ]).then((order) => {
            
            inventoryUpdate(itemlist.itemsid[itemlist.items.indexOf(order.item)], order.quantity);         

        });
        
    });
}

customerview();

const inventoryUpdate=(orderid,quantity) => {
    connection.query(`select * from products where item_id=${orderid}`, (err, datacheck) => {
        if(err) throw err; 
        
        if(((datacheck[0].stock_quantity)-quantity)>=0){
            var totalcost=datacheck[0].price*quantity;
            
            connection.query(`UPDATE products SET stock_quantity=stock_quantity ${-quantity}, product_sales=IFNULL(product_sales, 0)+(price*${quantity}) WHERE item_id=${orderid}`,
            (err1, dataupdate) => {
                if(err1) throw err1;
                
                console.log(("\n\rYour Order has been placed, The total purchase price is: $"+totalcost.toFixed(2)+"\n\n\rBelow is the updated inventory\n\r").bold.magenta);
                setTimeout(customerview,1000);
            });
        }else{
            console.log("\r\nINSUFFICIENT QUANTITY!! TRY AGAIN\r\n".bold.bgRed);
            setTimeout(customerview,1200);
        }
    });
}


