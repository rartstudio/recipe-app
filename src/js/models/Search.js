import axios from 'axios';

export default class Search {
    constructor(query){
        this.query = query;
    }

    // this is how we use in regular function
    // async function getResults(query){
    //     //using proxy
    //     //const proxy = 'https://cors-anywhere.herokuapp.com/';
    //     //const key = 'key api paste here';
    //     //const res = await axios(`api link paste here');

    //     try{
    //         const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${query}`);
    //         //const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
    //         const recipes = res.data.recipes;
    //         console.log(recipes);
    //     }
    //     catch (error){
    //         alert(error);
    //     }

    // }
    // getResults('');

    async getResults(){
        //using proxy
        //const proxy = 'https://cors-anywhere.herokuapp.com/';
        //const key = 'key api paste here';
        //const res = await axios(`api link paste here');
    
        try{

            //api link
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            
            //get data from api
            this.result = res.data.recipes;
            // console.log(res);
        }
        catch (error){
            alert(error);
        }
    
    }
}

