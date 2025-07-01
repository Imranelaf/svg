
import BlobAnimation from '../components/BlobBackground.jsx';
import './infos.css';


const Infos = () => {
  return (
    <div className="infosContainer">
		
    
      <h1 className='paragraph'>
        Discover the charm of France is our unique and vibrant celebration of culture
        and adventure. We're embracing the beauty that dances between the fascinating
        architecture <img src="./tower.png" alt="tower" className="tower" />
        and the delicious food <img src="./croissant.png" alt="croissant" className="images" />. <br />
        Join us to explore the magic of France!
        <img src="./flag.png" alt="flag" className="images" />
      </h1>
	  
	  <div className='firstBlob'> <BlobAnimation color={"#000080"}/></div>
	  
	
    </div>
  );
};

export default Infos;
