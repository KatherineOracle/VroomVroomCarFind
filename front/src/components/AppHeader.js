import logo from "../logo.svg";
import { Link } from "react-router-dom";
const AppHeader = (props) => {

 return (     
    <header className="App-header">
    <Link to="/"><img src={logo} className="App-logo" alt="logo" /></Link>
    <Link to="/"><h1 className="App-title">Vroom-vroom CarFind</h1></Link>
    </header>
 )
}

export default AppHeader;


