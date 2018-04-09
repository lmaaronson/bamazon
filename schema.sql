-- # **Instructions**

-- * It's time to test your skills in creating databases and tables as you create 
-- a database called `top_songsDB` which will eventually house all of the music data contained within `TopSongs.csv`
 
DROP DATABASE IF EXISTS top_songsDB;

CREATE DATABASE top_songsDB;

USE top_songsDB;

-- -- * Within your database create a table called `Top5000` and create columns 
-- capable of holding all of the data contained within `TopSongs.csv` properly.

create table Top5000 (
	id int  not null auto_increment,
    artist varchar(255),
    song_name varchar(555),
    release_year year,
-- --number of digits total and then after decimal--    
    raw_scores decimal(5, 2),  
    usa_scores decimal(5, 2),
    uk_scores decimal(5, 2),
    europe_scores decimal(5, 2),
    world_scores decimal(5, 2),
    primary key(id)
)

-- -- * All of your code should be written and saved within a filed called `
-- schema.sql` so that you can use this same code later should the need ever arise

-- -- * HINT: Try to have your table's columns match those within the CSV file 
-- as closely as possible or else you may find the next step in this assignment 
-- more difficult than it would otherwise be

-- -- * BONUS: Create a `seeds.sql` file that contains the data for the first 
-- three songs found within `TopSongs.csv`



-- -- * BONUS: Look into how MySQL Workbench can import and export data files. 
-- What file types does it accept? How does it convert the data?
