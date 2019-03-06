drop database if exists bamazon_db;
create database bamazon_db;
use bamazon_db;

    
create table products (
 item_id int not null auto_increment,
 product_name varchar(50),
 department_name varchar(50),
 price decimal(10,2),
 stock_quantity int,
 product_sales decimal(10,2),
 primary key(item_id)
);

select * from products;

create table departments (
 department_id int not null auto_increment,
 department_name varchar(50),
 over_head_costs decimal(10,2),
 primary key(department_id)
);

select * from departments;
