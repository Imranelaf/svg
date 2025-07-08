import gsap from 'gsap';
import toursAnimation from './ToursAnimation';
import './tour.css';
import { useGSAP } from '@gsap/react';


const toursData = [
  {
    title: 'Eiffel Tower',
    image: './pictures/Eiffel_tower.jpg',
    description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.'
  },
  {
    title: 'Eiffel Tower',
    image: './pictures/Eiffel_tower.jpg',
    description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.'
  },
  {
    title: 'Eiffel Tower',
    image: './pictures/Eiffel_tower.jpg',
    description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France.'
  }
];

const Tours = () => {
  gsap.registerPlugin(useGSAP);

  useGSAP(() => {
  // gsap code here...
  toursAnimation();

}, {}); 
  


  return (
    
    <div className="toursContainer">
      {toursData.map((tour, index) => (
        <section 
          key={index} 
          className={`tourSection ${index % 2 !== 0 ? 'reverse' : ''}`}
        >
          <figure className="tourImageContainer">
            {/* Scotch tape positioned on each photo */}
            <img 
              src="./emojis/scotch.png" 
              alt="scotch tape" 
              className="scotchTape"
            />
           
            <img 
              src={tour.image} 
              alt={tour.title} 
              className="tourImage" 
            />
            <figcaption className="tourTitle">{tour.title}</figcaption>
          </figure>

          <div className="tourDescription">
            <p className='parag'>{tour.description}</p>
          </div>
        </section>
      )      )}
    </div>
  );
};

export default Tours;
