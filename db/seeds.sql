-- * Insert some data into the table.
use bamazon_db;

insert into products(product_name,department_name,price,stock_quantity) 
values('Unchartered 4', 'Video Games',49.95,150),('Doom', 'Video Games',59.99,199),
('Crate of Spam', 'Food and Drink',24.50,50),('Cool Shades', 'Apparel',75,5),
('Worn Denim Jeans', 'Apparel',54.25,35),('Survival Towel', 'Necessities',42.42,42),
("Bill and Ted's Excellent Adventure", 'Film',15,25),('Mad Max: Fury Road', 'Film',25.50,57),
("Monopoly", 'Board Games',30.50,35),('Yahtzee', 'Board Games',19.95,18),
("Bike", 'Recreation',299,4);

insert into departments(department_id,department_name,over_head_costs) 
values(1001, 'Video Games',2500),(1002, 'Food and Drink',5000),(1003, 'Apparel',3500),
(1004, 'Necessities',3200),(1005, 'Film',10000),(1006, 'Board Games',500),(1007, 'Recreation',1200),
(1008,'Appliances',1200);

