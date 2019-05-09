pragma solidity ^0.4.25;

import "./Ownable.sol";

/**
* @title GradeChain
* @dev The GradeChain contract can manage data .
*/
contract GradeChain is Ownable{
  //Structs
  struct Course{
    uint blockNumber;
    uint id;
    string name;
  }

  struct Student {
    uint blockNumber;
    uint id;
    string firstName;
    string lastName;
    string career;
    string birthDate;

    uint[] CoursesList;
    mapping (uint => uint) Grades;
    mapping (uint => uint) BlockNumbers;
  }

  //Variables
  Student[] private StudentsList;

  mapping (uint => Student) private Students;

  Course[] private CoursesList;

  //Mappings
  mapping (uint => Course) private Courses;


  //Events
  event AddCourse(uint blockNumber, uint id, string name);

  event AddStudent(uint blockNumber, uint id, string firstName, string lastName, string career, string birthDate);

  event AddGrade(uint blockNumber, uint studentId, uint courseId, uint grade);

  //Functions
  function addCourse(uint id, string name) public onlyOwner {
    uint blockNumber = block.number;

    Course memory course = Courses[id];

    require(course.id == 0 && bytes(course.name).length == 0);

    Course memory newCourse = Course(blockNumber, id, name);

    Courses[id] = newCourse;
    CoursesList.push(newCourse);

    emit AddCourse(blockNumber, id, name);
  }


  function addStudent(uint id, string firstName, string lastName, string career, string birthDate) public onlyOwner {
    uint blockNumber = block.number;

    Student memory student = Students[id];

    require(student.id == 0 && bytes(student.firstName).length == 0);

    Student memory newStudent = Student(blockNumber, id, firstName, lastName, career, birthDate, new uint[](0));

    Students[id] = newStudent;
    StudentsList.push(newStudent);

    emit AddStudent(blockNumber, id, firstName, lastName, career, birthDate);
  }

  function addGrade(uint studentId, uint courseId, uint courseGrade) public onlyOwner {
    Student storage student = Students[studentId];

    require(student.id != 0 && bytes(student.firstName).length != 0);

    Course memory course = Courses[courseId];

    require(course.id != 0 && bytes(course.name).length != 0);

    uint grade = student.Grades[courseId];

    require(grade == 0);

    student.CoursesList.push(courseId);

    student.Grades[courseId] = courseGrade;
    student.BlockNumbers[courseId] = block.number;

    emit AddGrade(block.number, studentId, courseId, courseGrade);
  }

  function getStudentById(uint id) public view returns (uint, uint, string, string, string, string) {
    Student memory student = Students[id];
    return(student.blockNumber, student.id, student.firstName, student.lastName, student.career, student.birthDate);
  }

  function getStudentByPosition(uint position) public view returns (uint, uint, string, string, string, string) {
    uint size = StudentsList.length;

    require(position >= 0 && position < size);

    Student memory student = StudentsList[position];

    return(student.blockNumber, student.id, student.firstName, student.lastName, student.career, student.birthDate);
  }

  function getCourseById(uint id) public view returns (uint, uint, string) {
    Course memory course = Courses[id];
    return(course.blockNumber, course.id, course.name);
  }

  function getCourseByPosition(uint position) public view returns (uint, uint, string) {
    uint size = CoursesList.length;

    require(position >= 0 && position < size);

    Course memory course = CoursesList[position];

    return(course.blockNumber, course.id, course.name);
  }

  function getStudentGradesById(uint studentId) public view returns (uint[] blockNumbers, uint[] course, uint[] grade) {
    Student storage student = Students[studentId];

    require(student.id != 0);

    uint size = student.CoursesList.length;

    blockNumbers = new uint[](size);
    course = new uint[](size);
    grade = new uint[](size);

    for(uint i = 0; i < size; i++){
      uint courseId = student.CoursesList[i];

      blockNumbers[i] = student.BlockNumbers[courseId];
      course[i] = courseId;
      grade[i] = student.Grades[courseId];
    }
  }

  function getStudentsLength() public view returns (uint) {
    return StudentsList.length;
  }

  function getCoursesLength() public view returns (uint) {
    return CoursesList.length;
  }
}
