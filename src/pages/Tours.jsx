import './tour.css';

const toursData = [
  {
    title: 'Eiffel Tower',
    image: './pictures/Eiffel_tower.jpg',
    description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.'
  },
  {
    title: 'Eiffel Tower',
    image: './pictures/Eiffel_tower.jpg',
    description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.'
  },
  {
    title: 'Eiffel Tower',
    image: './pictures/Eiffel_tower.jpg',
    description: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower.'
  }
];

const Tours = () => {
  return (
    <div className="toursContainer">
      {toursData.map((tour, index) => (
        <section 
          key={index} 
          className={`tourSection ${index % 2 !== 0 ? 'reverse' : ''}`}
        >
          <figure className="tourImageContainer">
            <img 
              src={tour.image} 
              alt={tour.title} 
              className="tourImage" 
            />
            <figcaption className="tourTitle">{tour.title}</figcaption>
          </figure>

          <div className="tourDescription">
            <p>{tour.description}</p>
          </div>
        </section>
      ))}
    </div>
  );
};

export default Tours;
