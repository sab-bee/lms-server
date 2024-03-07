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



-- insert auth
insert into auth values(
  '19301142',
  'sabbir ahmed',
  'sabbir@mail.com',
  'raccoonskt',
  'free',
  '2023-03-07'
);

-- commands
select * from auth where student_id = '19301142';
select * from auth where admin_id = '19301142';

-- insert student
insert into student values(
  '19301142'
);

-- insert admin
insert into admin values(
  'admin101'
);