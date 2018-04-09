//note to self, run install npm init first to create package.json files
//then install the appropriate packages

var mysql = require("mysql");
var inquirer = require("inquirer");
var cli = require("cli-table");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_la"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});


//this is the start of the app that asks you if you want to see inventory or not
function start() {
    inquirer
        .prompt({
            default: true,
            name: "choice",
            type: "confirm",
            message: "Welcome to Bamazon-LA.  Would you like to see what we have to sell?",
        })
        .then(function (answer) {
            if (answer.choice === true) {
                inventory();
                console.log("inventory function here")
            } else {
                console.log("Thank you for visiting")
            }
        })



    //show the stock on hand and what can be bought
    function inventory() {

        var table = new cli({
            head: ['ID', 'Product', 'Department', 'Price', 'Qty'],
            colWidths: [10, 50, 20, 10, 10]
        });

        listInventory();

        function listInventory() { // table is an Array, so you can `push`, `unshift`, `splice` and friends
            connection.query("SELECT * FROM products", function (err, res) { //Variable creation from DB connection
                for (var i = 0; i < res.length; i++) {

                    var itemId = res[i].item_id, //these are from the sql column names
                        productName = res[i].product_name,
                        departmentName = res[i].dept_name,
                        price = res[i].price,
                        stockQuantity = res[i].stock_qty;
                    //these are from the var itemID
                    table.push(
                        [itemId, productName, departmentName, price, stockQuantity]
                    );
                }
                console.log("++++++++++Current Bamazon Inventory==========");
                console.log("");
                console.log(table.toString());
                continueStart();
            });
        } //this is the closing bracket for the function listInventory


        function continueStart() {

            inquirer.prompt([{
                type: "confirm",
                name: "continue",
                message: "Would you like to purchase an item?",
                default: true

            }]).then(function (user) {
                if (user.continue === true) {
                    selectionPrompt();
                    console.log("what do you want to buy")
                } else {
                    console.log("Thank you! Come back soon!");
                }
            });
        } //closing bracket for the continueStart function

    } ///this is the closing bracket for the function inventory
} //this is the closing bracket for start



//select from the inventory function
function selectionPrompt() {

    inquirer.prompt([{

            type: "input",
            name: "inputId",
            message: "Please enter the ID number of the item you would like to purchase.",
        },
        {
            type: "input",
            name: "inputNumber",
            message: "How many units of this item would you like to purchase?",

        }

    ]).then(function (userPurchase) {
        //connect to database to find stock_quantity in database. If user quantity input is greater than stock, decline purchase.

        connection.query("SELECT * FROM products WHERE item_id=?", userPurchase.inputId, function (err, res) {
            for (var i = 0; i < res.length; i++) {

                if (userPurchase.inputNumber > res[i].stock_qty) {

                    console.log("===================================================");
                    console.log("Sorry! Not enough in stock. Please try again later.");
                    console.log("===================================================");
                    start();

                } else {
                    //list item information for user for confirm prompt
                    console.log("===================================");
                    console.log("Sweet! We can fulfull your order.");
                    console.log("===================================");
                    console.log("You've selected:");
                    console.log("----------------");
                    console.log("Item: " + res[i].product_name);  //this calls product name from the DB
                    console.log("Department: " + res[i].dept_name);  
                    console.log("Price: " + res[i].price);
                    console.log("Quantity: " + userPurchase.inputNumber);
                    console.log("----------------");
                    console.log("Total: " + res[i].price * userPurchase.inputNumber);
                    console.log("===================================");

                    var newStock = (res[i].stock_qty - userPurchase.inputNumber);
                    var purchaseId = (userPurchase.inputId);
                    //console.log(newStock);
                    confirmPrompt(newStock, purchaseId);
                }
            }
        });
    });
}

//Confirm Purchase function

function confirmPrompt(newStock, purchaseId) {

    inquirer.prompt([{

        type: "confirm",
        name: "confirmPurchase",
        message: "Are you sure you would like to purchase this item and quantity?",
        default: true

    }]).then(function(userConfirm) {
        if (userConfirm.confirmPurchase === true) {

            //if user confirms purchase, update mysql database with new stock quantity by subtracting user quantity purchased.

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newStock
            }, {
                item_id: purchaseId
            }], function(err, res) {});

            console.log("=================================");
            console.log("Transaction completed. Thank you.");
            console.log("=================================");
            start();
        } else {
            console.log("=================================");
            console.log("No worries. Maybe next time!");
            console.log("=================================");
            start();
        }
    });
}