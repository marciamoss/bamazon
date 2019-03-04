const mysql=require("mysql");
const inquirer=require("inquirer");
const colors = require('colors');
var strpad = require('strpad');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '' ,
    database: 'bamazon_db'
});

function customerview(){
    connection.query('select * from products', (err, data) => {
        if(err) throw err; 
        var itemlist={items:[],itemsid:[]};
        itemlist.items.push("Select this to quit or use your arrow key to order".red.bold);
        itemlist.itemsid.push("q");
        for(var i=0;i<data.length;i++){
            itemlist.items.push(`${strpad.center(data[i].item_id.toString(), 6)} | ${strpad.right(data[i].product_name, 35)} | ${strpad.right(data[i].department_name, 15)} | ${strpad.left(data[i].price.toString(), 8)} | ${strpad.left(data[i].stock_quantity.toString(), 7)}`);
            itemlist.itemsid.push(data[i].item_id);
        }
        
        inquirer.prompt([
            {
                name: "item",
                type: "list",
                message: (`\nWHAT IS THE ITEM YOU WOULD LIKE TO PURCHASE?\n\r`.bold.bgBlue+`${strpad.center('ITEMID', 8)} | ${strpad.right('PRODUCT NAME', 35)} | ${strpad.right('DEPARTMENT NAME', 15)} | ${strpad.left('PRICE', 8)} | ${strpad.left('STOCK', 7)}  \n${'---------------------------------------------------------------------------------------'}\n`),
                choices: itemlist.items,
                pageSize:12
            },
            {
                when: (response) => { 
                    
                    if(response.item!=='\u001b[1m\u001b[31mSelect this to quit or use your arrow key to order\u001b[39m\u001b[22m'){
                        return false;
                    }else{ 
                        process.exit();
                    }
                }
            },
            {
                name: "quantity",
                validate: function(value){
                    if(isNaN(value)===false && value>0){
                        return true;
                    }
                    return false;
                },
                message: ("\nHow many would you like?")
            }
        ]).then((order) => {
            
            update(itemlist.itemsid[itemlist.items.indexOf(order.item)], order.quantity);         

        });
        
    });
}

customerview();

function update(orderid,quantity){
    connection.query('select * from products where item_id='+orderid, (err, datacheck) => {
        if(err) throw err; 
        if(((datacheck[0].stock_quantity)-quantity)>=0){
            connection.query("UPDATE products SET stock_quantity=stock_quantity"+-quantity+" WHERE item_id="+orderid,
            (err1, dataupdate) => {
                if(err1) throw err1;
                console.log("\n\rYour Order Has been place, Below is the updated inventory\n\r".bold.magenta);
                setTimeout(customerview,1000);
            });
        }else{
            console.log("\r\nINSUFFICIENT QUANTITY!! TRY AGAIN\r\n".bold.bgRed);
            setTimeout(customerview,1200);
        }
    });
}

