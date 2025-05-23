import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import Product from "./Product";

export default function Highlights({ data }) {

  const [previews, setPreviews] = useState([]);

  useEffect(() => {

    fetch(`${process.env.REACT_APP_API_URL}/products/active`)
      .then(res => res.json())
      .then(apiData => {

        const numbers = [];
        const products = [];

        const generateRandomNums = () => {
          let randomNum = Math.floor(Math.random() * apiData.length);

          if (numbers.indexOf(randomNum) === -1) {
            numbers.push(randomNum);
          } else {
            generateRandomNums();
          }
        }


        for (let i = 0; i < 5; i++) {
          generateRandomNums();

          if (apiData[numbers[i]]) { // Check if apiData[numbers[i]] is defined
            products.push(
              <Product
                data={apiData[numbers[i]]}
                key={apiData[numbers[i]]._id}
                breakPoint={2}
              />
            );
          }
        }

        setPreviews(products);

      });

  }, []);

  return (
    <CardGroup className="d-flex justify-content-between p-5">
      {previews}
    </CardGroup>
  );

}
