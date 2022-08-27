/*
This componenent provides the form for editing a car or adding a new one.

As the list component is going to call the API every time it mounts anyway
I decided this component could just manage its own state.

A car object can be passed in from the car list componenent,
aleterntively if the user goes directly to a particular car via the url
then there will be no location.state and car data will be requested from the API. 

After changes are submitted here, the app routes back to its root rul, ie the list of cars. 

*/

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image } from "react-bootstrap";
import { carGet, carPost, carPut } from "../utils/carAPICalls";

const CarEdit = () => {

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const carId = params.id; //get the carid from the url

  //initialise  variables that will require state 
  const [car, setCar] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);  
  const [image, setImage] = useState({data: null }); //stores image data from form

  //similar to ComponentDidMount
  useEffect(() => {

    /*
    1) carid = new         :: means set car to default empty values 
    2) location.state null :: means user got here via the url so get the car from the API
    3) otherwise set car to the  object sent over from in location.state from link in the car list component 
    */

    switch (true) {
      case carId === "new":
        setCar({ id: "new", make: "", model: "", seats: 5, photo: "./images/add-photo.png" });
        setLoaded(true);
        break;
      case location.state === null:
        carGet(carId).then((data) => {
          if (typeof data.error === "undefined") {
            setCar(data);
            setLoaded(true);
          } else {
            setLoaded(true);
            setError(data.error);
          }
        });
        break;
      default:
        setCar(location.state.car);
        setLoaded(true);
    }
  }, [carId, location.state]);



  const handleSubmit = (e) => {
    e.preventDefault(); //don't refresh page

    //prepare data to send to API
    let formData = new FormData();
    formData.append('file', image.data);
    formData.append('make', car.make);
    formData.append('model', car.model);
    formData.append('seats', car.seats);
    formData.append('photo', car.photo);


    /*A new car will send a POST request
    after which we will navigate to the carlist component 
    */
    if(car.id === "new"){
      carPost(formData)
      .then((result) => {
        if (typeof result.error != "undefined") {
          setError(result.error);
        } else { 
        navigate("/");
        }
    });


    } else {
    /*An existing car with an Id will send a PUT request
    after which we will navigate to the carlist component 
    */
      carPut(car.id, formData)
      .then((result) => {
        if (typeof result.error != "undefined") {
          setError(result.error);
        } else { 
        navigate("/");
        }

    });
    }


  };

  /*
  if a new image is uploaded, store the image data  
  create a preview image which we will update to the car.photo attribute  
  */
  const handleFileChange = (e) => {

    const img = {
      data: e.target.files[0]
    }
    setImage(img)
    setCar({...car, photo: URL.createObjectURL(e.target.files[0])});
    console.log(img);
  }

  /*
  Handle errors from API, if all good display the form
  */

  if (error) {

    return <div>Error: {error}</div>;
    
    } else if (!loaded) {

    return <div>Loading...</div>;

    } else {

  return (

    <Form onSubmit={handleSubmit}>
      <Container key={"car-" + car.id}>
        <Row className="align-items-center justify-content-center">
          <Col xs={4}>
            <Image alt="Car thumb" fluid src={car.photo} />
            <Form.Group className="position-relative mb-3">
              <Form.Label>Select new photo</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e)}
              />
            </Form.Group>
          </Col>
          <Col xs={4}>
            <Form.Group className="mb-3" controlId="formMake">
              <Form.Label>Car Make</Form.Label>
              <Form.Control
                type="text"
                name="make"
                defaultValue={car.make}
                placeholder="Car make"
                onChange={(e) => setCar({ ...car, make: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formModel">
              <Form.Label>Car Model</Form.Label>
              <Form.Control
                type="text"
                name="model"
                defaultValue={car.model}
                placeholder="Car model"
                onChange={(e) => setCar({ ...car, model: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSeats">
              <Form.Label>No. of seats</Form.Label>
              <Form.Control
                type="number"
                name="seats"
                defaultValue={car.seats}
                placeholder="No of seats"
                onChange={(e) => setCar({ ...car, seats: e.target.value })}
              />
            </Form.Group>
            <Button type="submit">Save and return to list</Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
    }
};

export default CarEdit;
