const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
app.use(express.json());
 
const dbConfig = {
 host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
};

const pool = mysql.createPool(dbConfig);

app.get('/api/studentlogin', async (req, res) => {
  try {

    const [results] = await pool.execute('SELECT student_id, password, roll_no FROM student_profile');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/teacherlogin', async (req, res) => {
  try {
    const [results] = await pool.execute('SELECT school_id, password FROM teacher_profile');
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});
app.get('/studentprofile/:id', async (req, res) => {
  const stdid = parseInt(req.params.id);
  try {
    const [results] = await pool.execute(`SELECT * FROM all_classes INNER JOIN class_sections ON all_classes.class_id = class_sections.fk_class_id INNER JOIN student_class ON class_sections.section_id = student_class.fk_section_id INNER JOIN student_profile ON student_class.fk_student_id =student_profile.student_id WHERE student_id = ${stdid} AND status='1'`);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
})
app.get('/hello', async (req, res) => {
  console.log('hello')
 res.json({message:'Hello world'})
})
app.get('/attendance/:id', async (req, res) => {
  const stdid = parseInt(req.params.id);
  try {
    const [results] = await pool.execute(`SELECT student_id,name,attendance,date from student_profile INNER JOIN attendance ON student_profile.student_id=attendance.fk_student_id where student_id=${stdid}`);
    res.json(results);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error fetching users' });
  }
})
app.get('/section', async (req, res) => {
  try {
    const [results] = await pool.execute(`select * from all_classes INNER JOIN class_sections ON all_classes.class_id=class_sections.fk_class_id`);
    res.json(results);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error fetching users' });
  }
})
app.get('/class', async (req, res) => {
  try {
    const [results] = await pool.execute(`select * from all_classes `);
    res.json(results);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error fetching users' });
  }
})
app.get('/showclass/:class_name/:section_name', async (req, res) => {
  const cname=req.params.class_name;
  const section_name=req.params.section_name;
  try {
    const [results] = await pool.execute(`  SELECT roll_no ,name,student_id FROM all_classes INNER JOIN class_sections ON all_classes.class_id = class_sections.fk_class_id INNER JOIN student_class ON class_sections.section_id = student_class.fk_section_id INNER JOIN student_profile ON student_class.fk_student_id = student_profile.student_id WHERE class_name =${cname} AND section_name='${section_name}' `);
    res.json(results);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Error fetching users' });
  }
})
app.post('/insertattendance', async (req, res) => {
  const { attendance } = req.body;
   const query = `INSERT INTO attendance (fk_student_id, attendance,date) VALUES ${attendance.map(() => '(?,?,?)').join(', ')}`;
  const query2=``;
  const values = attendance.flatMap((attendance) => [attendance.student_id, attendance.attendance,attendance.date]);

  try {
    const [results] = await pool.execute(query, values);
    res.send({ message: 'Attendance inserted successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error inserting attendance' });
  }
});
app.listen(process.env.PORT, () => {
  console.log(process.env.PORT)
  console.log("ITS runing")
})
