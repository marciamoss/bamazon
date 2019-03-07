# bamazon

**video link for installation:** https://drive.google.com/open?id=1zzmj2OI7pAYA3QPWpkXC7wjjeJJ9tiJi

**video link for customer view:** https://drive.google.com/open?id=1XzgWptH0HEZ8tvZu_i0xRSk3Y377jheX

**video link for manager view:** https://drive.google.com/open?id=1GFEC2rTiEaf_kGYNk2_W-tzFT5HP8z19

**video link for supervisor view:** https://drive.google.com/open?id=1kljUKlesegiFnhJu4gSLJh04_nMkdTJK

* Bamazon is an Amazon-like storefront created with the MySQL skills.
To install the app:
* First have the github repo `https://github.com/marciamoss/bamazon.git` cloned to your computer and then in the git    bash run command 'npm i' without the quotes. That will install all the packages required to run the app.
* Next, create a file named **.env**, add the following to it, replacing the values with your DB keys (no quotes)       once you have them:

    DBHOST=your dbhost 
    DBPORT=your dbport
    DBUSER=your user 
    DBPASSWORD=your db password
    DBDATABASE=your db name

* If you don't have your own data you can use the schema.sql and seeds.sql in db folder to create a dummy database to run this app.

* There are three views built in this app:

    **bamazonCustomer.js:**
    1. The bamazonCustomer.js app will display the available items for sale with price and quantity and takes in orders from customers and depletes the stock from the store's inventory. 
    2. Once the customer has placed the order, the application checks if the store has enough of the product to meet the customer's request.
    3. If not, the app display's a phrase like `Insufficient quantity!`, and then prevents the order from going through and let's the customer reorder unless they want to quit.
    4. However, if the store does have enough of the product, customer's order is fulfilled and show's the customer the total cost of their purchase.

    **bamazonManager.js:**
    Manager has following options:
    1. View Products for Sale: If this option is selected the app list's every available item in the store, the item IDs, product name, department name, prices, and quantities.
    2. View Low Inventory: If this option is selected the app list's all the items with an inventory count lower than five. And if none of the items stock are below 5 it just displays a message saying `WE ARE FULLY STOCKED`
    3. Add to Inventory:  If this option is selected the app display's a prompt that will let the manager "add more" of any item currently in the store.
    4. Add New Product:  If this option is selected the app allow's the manager to add a completely new product to the store.

    **bamazonSupervisor.js**
    Supervisor has following options:
    1. View Product Sales by Department: If this option is selected the app display's a summarized table in the user's  terminal/bash window.
    2. Create New Department: If this option is selected the app let's the supervisor add a new department to department table.

    
     
