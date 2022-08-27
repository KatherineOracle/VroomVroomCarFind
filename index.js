/* ./src/index.js
Defines the API operations to access and manipulate the cars database
○ PUT updates a car 
○ DELETE deletes a car.
○ GET retrieves a car or all the cars if no id is given.
○ POST adds a new car to the database.
*/


// importing the dependencies
const config = require('dotenv').config()
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const Cars = require("./cars");
const PORT = process.env.PORT || 8080;
const path = require("path"); //for heroku

// defining the Express app
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    safeFileNames: true,
    preserveExtension: true,
    tempFileDir: `./tmp/`,
  }) // EXPRESS-FILEUPLOAD BEING USED HERE
);




// defining an endpoint to return all cars
app.get("/api", (req, res) => {
  const results = Cars.readCars();

  if (results.error) {
    res.send(results.error);
  } else {
    res.send(results.results);
  }
});

// defining an endpoint to return car by id
app.get("/api/:id", (req, res) => {
  const result = Cars.readCar(req.params.id);

  if (result.error) {
    res.send(result.error);
  } else {
    res.send(result.results);
  }
});

/*  
defining an endpoint to create a new car. 
Data to be supplied in the body
*/
app.post("/api", (req, res) => {
  let car = {
    make: req.body.make,
    model: req.body.model,
    seats: req.body.seats,
    photo: req.body.photo,
  };
  let error = {};
  let result = {};
  if (req.files) {
    let uploadFile = req.files.file;
    const name = uploadFile.name;
    const id = uploadFile.md5;
    const saveAs = `${id}_${name}`;

    uploadFile.mv(`./front/public/images/${saveAs}`, function (err) {
      if (err) {
        error = { error: err };
      }

      car.photo = `/images/${saveAs}`;
      result = Cars.createCar(car);
      res.send(result);
    });
  } else {
    result = Cars.createCar(car);
    res.send(result);
  }
});

/*Error handling: user tried to update with a post query*/
app.post("/api/:id", (req, res) => {
  message = `Are you trying to update car with id ${req.params.id}? 
    Please try again with the put method`;
  res.send(message);
});

/*Error handling: user tried to update but supplied no ID */
app.put("/api", (req, res) => {
  message = `If you are trying to update a car, please supply the id as a parameter. 
    To add a new car. please use the post method.`;
  res.send(message);
});

/*  
defining an endpoint to update a car. 
Id to be passed as a parameter.
Data to be changed should be supplied in the body
*/
app.put("/api/:id", (req, res) => {
  let car = {
    make: req.body.make,
    model: req.body.model,
    seats: req.body.seats,
    photo: req.body.photo,
  };
  let error = {};
  let result = {};
  // if there is a file (photo); upload that first and get the hashed
  //image name to store in the api
  if (req.files) {
    let uploadFile = req.files.file;
    const name = uploadFile.name;
    const id = uploadFile.md5;
    const saveAs = `${id}_${name}`;

    uploadFile.mv(`./front/public/images/${saveAs}`, function (err) {
      if (err) {
        error = { error: err };
        res.send(error);
      }

      //update url in car object and then update the car
      car.photo = `/images/${saveAs}`;
      result = Cars.updateCar(req.params.id, car);
      res.send(result);
    });
  } else {
    //no image to save first - just update the car

    result = Cars.updateCar(req.params.id, car);
    res.send(result);
  }
});

/*Error handling: user tried to use delete operation but supplied no ID */
app.delete("/api", (req, res) => {
  message = "Please supply the id of the car to be deleted as a parameter.";
  res.send(message);
});

/*  
defining an endpoint to delete a  car. 
Id to be passed as a parameter.
*/
app.delete("/api/:id", (req, res) => {
  //send back clean car list
  const results = Cars.deleteCar(req.params.id);
  res.send(results);
});

//for heroku

if (process.env.NODE_ENV === 'production'){
  console.log(process.env.NODE_ENV) 
  app.use(express.static(path.join(__dirname, 'front/build')));
  app.get('*',(req,res)=> {res.sendFile(path.resolve(__dirname,
  'front', 'build','index.html'));
  });
}


/* start up the API server on port 8080!*/
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
