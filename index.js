const mysql = require("mysql2");
const cTable = require("console.table");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "rootroot",
    database: "employee_tracker",
  },
  console.log(`Connected to the employee_tracker database.`)
);

function showDepartments() {
  db.query("SELECT * FROM department", function (err, result) {
    if (err) {
      console.log("ERROR:");
      console.log(err);
    }
    console.table(result);
    chooseFunction();
  });
}

function showRoles() {
  db.query(
    "SELECT role.id, title, salary, department.name as department FROM role JOIN department ON role.department_id = department.id;",
    function (err, result) {
      if (err) {
        console.log("ERROR:");
        console.log(err);
      }
      console.table(result);
      chooseFunction();
    }
  );
}

function showEmployees() {
  db.query(
    `SELECT \
    employee.id, \
    first_name, \
    last_name, \
    role.title, \
    department.name as department, \
    manager_id \
    FROM employee \
    JOIN role ON employee.role_id = role.id \
    JOIN department ON role.department_id = department.id;`,
    function (err, result) {
      if (err) {
        console.log("ERROR:");
        console.log(err);
      }
      console.table(result);
      chooseFunction();
    }
  );
}

async function chooseFunction() {
  let ans = await inquirer.prompt([
    {
      type: "list",
      message: "Please selection something to do",
      name: "func",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
      ],
    },
  ]);

  if (ans.func == "View All Departments") {
    showDepartments();
  } else if (ans.func == "View All Roles") {
    showRoles();
  } else if (ans.func == "View All Employees") {
    showEmployees();
  }
}

chooseFunction();
