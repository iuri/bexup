create table models (
    id int generated always as identity,
    code int not null, 
    title varchar(200),
    brand_code int not null, 
    brand_title varchar(200), 
    notes text, 
    primary key(id)
);

create table brands(
    id int generated always as identity,
    code int not null,
    title varchar(200) not null,
    notes text, 
    primary key(id)
);


INSERT INTO models (code, title, brand_code, brand_title) VALUES (6673, 'VOYAGE SELEÇÃO 1.6 Total Flex 8V 4p', 59, 'VW - VolksWagen');
INSERT INTO models (code, title, brand_title, brand_code) VALUES (4755, 'VOYAGE TREND 1.6 Mi Total Flex 8V 4p', 'VW - VolksWagen', 59);
INSERT INTO models (code, title, brand_title, brand_code) VALUES (7326, 'up! move 1.0 TSI Total Flex 12V 5p', 'VW - VolksWagen', 59);
INSERT INTO models (code, title, brand_code, brand_title) VALUES (5936, 'L200 Triton GLS 3.2 CD TB Int.Diesel Mec', 41, 'Mitsubishi');
select * from models;