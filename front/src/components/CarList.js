/*
This component loads all the cars from the API into a cute list.

Each item in the car list has buttons to
1) route to a particular cars edit form
2) delete the car. API returns the clean car list after a DELETE request 

*/

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Image, Button } from "react-bootstrap";
import { carGet, carDelete } from "../utils/carAPICalls";

function CarList() {
  const [cars, setCars] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);  

  useEffect(() => {    
    carGet("").then((data) => {
      if (typeof data.error === "undefined") {
        setCars(data);
        setLoaded(true);
      } else {
        setLoaded(true);
        setError(data.error);
      }        
  })
  }, []);

/**
 * handle clicks on the delete buttons
 * Will send delete request to api and then update the cars in state
 * with the returned clean data.
 */
  const handleDelete = (carid) => {
    carDelete(carid).then((data) => {
      if (typeof data.error === "undefined") {
        setCars(data);
        setLoaded(true);
      } else {
        setLoaded(true);
        setError(data.error);
      } 
    });    
  }


  /*
  Handle errors from API, if all good display the list
  */

  if (error) {

    return <div>Error: {error}</div>;
    
    } else if (!loaded) {

    return <div>Loading...</div>;

    } else {

  return (  

      <Container>
        <Row className="justify-content-center align-items-center">
          <Col xs lg="6">
            <p className="text-center"><Link className="btn btn-primary" to="/new">Add a new car</Link></p>
            <ul className="unstyled car-list">
              {cars.map((car) => {
                return (
                  <li key={car.id}>
                    
                      <Row className="justify-content-center align-items-center">
                        <Col xs lg="4">
                          <Image fluid alt="Car thumb" src={car.photo} />
                        </Col>
                        <Col xs lg="8">
                          <p>
                            {car.make}, {car.model}, {car.seats} seater
                          </p>
                          <p><Link to={"/" + car.id} state={{car:car}} className="btn btn-secondary btn-sm">View/edit</Link>
                          &nbsp; <Button className="btn btn-danger btn-sm" onClick={() => handleDelete(car.id)}>Delete</Button></p>
                        </Col>
                      </Row>
                    
                  </li>
                );
              })}
            </ul>
          </Col>
        </Row>
      </Container>
    );
  }            
}

export default CarList;
