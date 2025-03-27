import React, { useState, useEffect } from "react";
import '../styles/CatDisplay.css';
const API_URL = "https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1";
const API_KEY = import.meta.env.ACCESS_KEY;

export default function CatDisplay() {
  const [catData, setCatData] = useState(null);
  const [banList, setBanList] = useState([]);

  const fetchCat = async () => {
    let catOne;
    let cat;
    do {
      const response = await fetch(API_URL, {
        headers: {
          "x-api-key": API_KEY,
        },
    });
    const data = await response.json();
    catOne = data[0];
    const catID = catOne.id;
    let query2 = `https://api.thecatapi.com/v1/images/${catID}`;
    const response2 = await fetch(query2);
    cat = await response2.json();
    } while (cat?.breeds && banList.some(banned => cat.breeds[0][banned.key] === banned.value));
    setCatData(cat);
  };

  useEffect(() => {
    fetchCat();
  }, []);

  const addToBanList = (key, value) => {
    if (!banList.some(ban => ban.key === key && ban.value === value)) {
      setBanList([...banList, { key, value }]);
    }
  };
  console.log(catData);

  return (
    <div className="display">
      <div className="flex-1 flex flex-col justify-center items-center bg-cover bg-center" style={{ backgroundImage: 'url("/cat-collage.jpg")' }}>
        <div className="bg-black/60 rounded-2xl p-10 shadow-xl">
          <h1 className="text-4xl font-bold text-center mb-4">Veni Vici!</h1>
          <p className="text-lg text-center mb-4">Discover cats from your wildest dreams!</p>
          <p className="text-center text-2xl mb-4">😺😹😻😼😽🙀😿😸😾</p>
          <div className="flex justify-center">
            <button onClick={fetchCat}>
              🔄 Discover!
            </button>
          </div>
        </div>
        {catData && (
          <div className="mt-6 w-[300px] bg-white text-black">
            <div>
                <img
                    src={catData.url}
                    alt="A cat"
                    width='300px'
                    height='auto'
                />
                <div className='attributes'>
                    {catData.breeds && (
                        <div>
                        <p className="attribute" onClick={() => addToBanList("name", catData.breeds[0].name)}>Breed: {catData.breeds[0].name}</p>
                        <p className="attribute" onClick={() => addToBanList("origin", catData.breeds[0].origin)}>Origin: {catData.breeds[0].origin}</p>
                        <p className="attribute" onClick={() => addToBanList("life_span", catData.breeds[0].life_span)}>Life Span: {catData.breeds[0].life_span}</p>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
      <div className="ban-list">
        <h2 className="text-2xl font-semibold mb-4">Ban List</h2>
        <p className="text-sm mb-2">Select an attribute in your listing to ban it</p>
        {banList.length === 0 && <p>No bans yet</p>}
        <ul className='list-box'>
          {banList.map((ban, index) => (
            <li key={index} className="ban-list-item">{ban.value}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
