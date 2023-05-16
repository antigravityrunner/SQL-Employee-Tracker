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
    'SELECT \
    employee.id, \
    employee.first_name, \
    employee.last_name, \
    role.title, \
    department.name as department, \
    role.salary, \
    CONCAT(manager.first_name, " ", manager.last_name) as manager \
    FROM employee \
    JOIN role ON employee.role_id = role.id \
    JOIN department ON role.department_id = department.id \
    LEFT OUTER JOIN employee manager ON employee.manager_id = manager.id;',
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

async function addDepartment() {
  let dep = await inquirer.prompt([
    {
      type: "input",
      message: "What is the name of the department?",
      name: "dep",
    },
  ]);

  db.query(
    `INSERT INTO department (name) VALUES (?)`,
    dep.dep,
    (err, result) => {
      if (err) {
        console.log("ERROR:");
        console.log(err);
      }
      chooseFunction();
    }
  );
}

async function addRole() {
  db.query("SELECT id, name FROM department", async function (err, result) {
    if (err) {
      console.log("ERROR:");
      console.log(err);
    }
    let userResponse = await inquirer.prompt([
      {
        type: "input",
        message: "What is the name of the role?",
        name: "role",
      },
      {
        type: "number",
        message: "What is your roles salary?",
        name: "salary",
      },
      {
        type: "list",
        message: "Choose a department for your role: ",
        name: "dep",
        choices: result,
      },
    ]);

    let depId = -1;
    for (i = 0; i < result.length; i++) {
      if (result[i].name == userResponse.dep) {
        depId = result[i].id;
      }
    }

    db.query(
      "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?);",
      [userResponse.role, userResponse.salary, depId],
      (err, result) => {
        if (err) {
          console.log("ERROR:");
          console.log(err);
        }
        chooseFunction();
      }
    );
  });
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
  } else if (ans.func == "Add a Department") {
    addDepartment();
  } else if (ans.func == "Add a Role") {
    addRole();
  }
}

chooseFunction();
