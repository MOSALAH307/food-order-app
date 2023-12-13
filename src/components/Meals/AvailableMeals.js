import React, { useEffect, useState } from "react";
import classes from './AvailableMeals.module.css';
import MealItem from "./MealIteam/MealItem";
import Card from "../UI/Card";

const AvailableMeals = () => {

  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  useEffect(() => 
  {
    const fetchMeals = async () => {
      const response = await fetch('https://food-oreder-app-13586-default-rtdb.firebaseio.com/meals.json');

      if (!response.ok) {
        throw new Error ('Something went wrong!!!');
      }

      const data = await response.json();
  
      let loadedMeals = [];
  
      for(const key in data) {
        loadedMeals.push({
          id: key,
          name: data[key].name,
          description: data[key].description,
          price: data[key].price
        })
      }
      setMeals(loadedMeals);
      setIsLoading(false);
    };

    fetchMeals().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });

  },[])

  if (httpError) {
      return(
        <section className={classes.error}>
          <h1>{httpError}</h1>
        </section>
      );
    }

  if (isLoading) {
    return(
      <section className={classes.loading}>
        <h1>Loading...</h1>
      </section>
    ); 
  }

  const mealsList = meals.map(meal => 
    <MealItem 
    key={meal.id}
    id={meal.id} 
    name={meal.name}
    desc={meal.description}
    price={meal.price}
    />
    )

  return (
    <section className={classes.meals}>
      <Card >
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
}

export default AvailableMeals;