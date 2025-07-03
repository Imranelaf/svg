import BlobAnimation from '../components/BlobBackground.jsx';
import './infos.css';

const Infos = () => {
  return (
    <div className="infosContainer">
      <h1 className='paragraph savate-regular'>
        Discover the charm of France is our unique and vibrant celebration of culture
        and adventure. We're embracing the beauty that dances between the fascinating
        architecture <img src="./emojis/tower.png" alt="tower" className="tower" />
        and the delicious food <img src="./emojis/croissant.png" alt="croissant" className="images" />. <br />
        Join us to explore the magic of France!
        <img src="./emojis/flag.png" alt="flag" className="images" />
      </h1>
	  
      <div className='firstBlob'> 
        <BlobAnimation color={"#000080"} imageSrc="./emojis/tower.png"/>
      </div>
	  
 
      <div className='thirdBlob'> 
        <BlobAnimation color={"#ff6b6b"} imageSrc="./emojis/louvre.png"/>
      </div>
     
    </div>
  );
};

export default Infos;
