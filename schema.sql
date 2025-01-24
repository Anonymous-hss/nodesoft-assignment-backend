CREATE TABLE student1 (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Marks2 (
    mark_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    marks_obtained INT NOT NULL, 
    FOREIGN KEY (student_id) REFERENCES student1(id) ON DELETE CASCADE
);
