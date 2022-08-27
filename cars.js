/* Define all functions needed 
to manage the cars data file and export as a module 
*/

// get dependencies
const fs = require("fs");

// used frequently
let carFile = "./data/cars.json";
let carList = [];

/*

/*----------CREATE A CAR----------*/
function createCar(data) {
  const cars = readCars().results;

  //Id of a new car will be the array length + 1
  const newId = { id: cars.length + 1 };

  //spread id and data into new car object  
  const newCar = { ...newId, ...data };

  //add to end of array
  cars.push(newCar);

  //write cars back to json file
  const result = writeCars(cars);
  
  return result;
}


/*----------FIND A CAR----------*/
function readCar(id) {

  //retrieve all the cars  
  const cars = readCars().results;

  //find requested car by its id key in the cars array
  let result = cars.find((e) => e.id == id);

  //handle car not found
  if (typeof result === "undefined") {
    return {"error": "Car not found" };
  }
  // ok, we have a car
  return {"results": result};
}

/*----------FIND ALL CARS----------*/
function readCars() {   
  //check if cars already loaded into global cars variable before reading file again      
  if (carList.length === 0) {
    try {
      //read file and load cars into cars variable   
      const content = fs.readFileSync(carFile);
      carList = JSON.parse(content);
    } catch (e) {
      // file non-existent, so create the file 
      fs.writeFileSync(carFile, "[]");
      return {"error": "The database is empty" };
    }
  }
    
  return {results: carList};
}

/*----------WRITE UPDATED CARS TO FILE----------*/
function writeCars(data) {

  //empty the car array because the data is about to change.  
  //carList = [];
  try {
    //write to file  
    fs.writeFileSync(carFile, JSON.stringify(data));
  } catch (e) {

    //could not write file
    console.log(e);
    return { "error": "Could not write to file"};
  } finally {
    //no errors returned above, report success
    return { "results": "Cars updated successfully" };
  }
}

/*----------UPDATE A CAR----------*/
function updateCar(id, data) {

  //get cars and single car to update  
  const cars = readCars().results;
  const car = cars.find(car => car.id == id);
  const carIndex = cars.indexOf(car);

  //make check that car exists in array   
  if (carIndex > -1) {

    /*loop through the key/value pairs supplied by user 
    and update the car. ie we leave unchanged data as is. */
    for (const prop in data) {
        car[prop] = data[prop];
    }  
    cars[carIndex] = car;
  
    //write cars back to file
    const result = writeCars(cars);
    return result;

  } else {

     //will return "Error: Car not found" 
    return {"error": "Car not found"};
  }
}

/*----------DELETE A CAR----------*/
function deleteCar(id) {

  //get cars and single car to update    
  const cars = readCars().results;

  const carIndex = cars.findIndex(x => x.id ==id);

  if (carIndex > -1) {
    //delete car at index
    cars.splice(carIndex, 1);

    //write updated cars array back to file
    const result = writeCars(cars);
    return readCars().results;

  } else {

    //will return "Error: Car not found" 
    return {"error": "Car not found"};
  }
}

module.exports = {
  createCar,
  readCar,
  readCars,
  updateCar,
  deleteCar,
};
