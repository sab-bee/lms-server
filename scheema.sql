create table student(
  student_id varchar(8) primary key
);

create table admin(
  admin_id varchar(8) primary key
);

create table auth(
  student_id varchar(8),
  admin_id varchar(8),
  user_name varchar(45),
  email varchar(45),
  phone varchar(11),
  password varchar(255),
  account_type varchar(10),
  otp varchar(6), 
  join_date date,
  foreign key (student_id) references student(student_id),
  foreign key (admin_id) references admin(admin_id)
);

create table book(
  book_id int(11) auto_increment primary key,
  title varchar(45),
  author varchar(45),
  genre varchar(10),
  edition varchar(45),
  image varchar(255),
  desc text,
  stock int,
  borrow_count int,
);

CREATE TABLE transaction (
  transaction_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(8),
  admin_id VARCHAR(8),
  book_id INT(11),
  issue_date DATE,
  due_date DATE,
  status ENUM('pending', 'approved', 'denied'),
  share BOOLEAN,
  FOREIGN KEY (student_id) REFERENCES student(student_id),
  FOREIGN KEY (admin_id) REFERENCES admin(admin_id),
  FOREIGN KEY (book_id) REFERENCES book(book_id),
  UNIQUE KEY unique_student_book (student_id, book_id), -- prevent duplicate request

  -- CHECK (status IN ('pending', 'approved', 'denied')) // either enum or check
);

-- get
select * from auth where student_id = '19301142';
select * from auth where admin_id = 'admin101';


-- insert auth
insert into auth values(
  '19301142',
  'sabbir ahmed',
  'sabbir@mail.com',
  'raccoonskt',
  'free',
  '2023-03-07'
);

-- insert student
insert into student values(
  '19301142'
);

-- insert admin
insert into admin values(
  'admin101'
);


-- get the boooks under an user
SELECT * FROM book WHERE book_id IN (SELECT book_id FROM transaction WHERE student_id = '20245678' && status='pending');
SELECT * FROM book WHERE book_id IN (SELECT book_id FROM transaction WHERE student_id = '20245678' && status='approved');
SELECT * FROM book WHERE book_id IN (SELECT book_id FROM transaction WHERE student_id = '20245678' && status='denied');

-- or

select b.* from book b join transaction t on b.book_id = t.book_id where t.student_id = '20245678' && status='pending';
select b.* from book b join transaction t on b.book_id = t.book_id where t.student_id = '20245678' && status='approved';

-- get pending books infos

select b.title, t.book_id, issue_date, due_date, student_id from book b join transaction t on b.b
ook_id = t.book_id where status='pending';

-- includes command
select  * from book where title like ? or author like ?

--- common commands
select student_id, admin_id, user_name, email, account_type, join_date, otp from auth;
select title, book_id, author, genre, edition, stock from book;
