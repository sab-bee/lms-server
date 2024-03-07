create table student(
  student_id varchar(8),
  primary key (student_id)
);

create table admin(
  admin_id varchar(8),
  primary key (admin_id)
);

create table auth(
  student_id varchar(8),
  admin_id varchar(8),
  user_name varchar(45),
  email varchar(45),
  password varchar(255),
  account_type varchar(10),
  join_date date,
  foreign key (student_id) references student(student_id),
  foreign key (admin_id) references admin(admin_id)
);

create table book(
  book_id varchar(32),
  title varchar(45),
  author varchar(45),
  genre varchar(10),
  edition varchar(45),
  stock int,
  borrow_count int,
  primary key (book_id)
);

create table transaction(
  transaction_id varchar(32),
  student_id varchar(8),
  admin_id varchar(8),
  book_id varchar(32),
  issue date,
  due date,
  status ENUM('pending','approved','denied'),
  share boolean,
  foreign key (student_id) references student(student_id),
  foreign key (admin_id) references admin(admin_id),
  foreign key (book_id) references book(book_id)
);

-- get
select * from auth where student_id = '19301142';
select * from auth where admin_id = '19301142';


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


-- get all the boooks under an user
SELECT * FROM book WHERE book_id IN (SELECT book_id FROM transaction WHERE student_id = '20245678' && status='pending');
SELECT * FROM book WHERE book_id IN (SELECT book_id FROM transaction WHERE student_id = '20245678' && status='approved');
SELECT * FROM book WHERE book_id IN (SELECT book_id FROM transaction WHERE student_id = '20245678' && status='denied');

or

select b.* from book b join transaction t on b.book_id = t.book_id where t.student_id = '20245678' && status='pending';
select b.* from book b join transaction t on b.book_id = t.book_id where t.student_id = '20245678' && status='approved';
-- action by admin
