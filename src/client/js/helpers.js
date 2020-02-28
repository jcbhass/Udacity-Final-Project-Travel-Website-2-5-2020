import axios from 'axios';

// Creates a new date instance dynamically with JS
const getDate =  () => {
    const d = new Date();
    const today = `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;

    return today;
}

// Gets Skycons info from DarkSky API
const getIcons = (icon, iconID) => {
    const skycons = new Skycons({ color: 'black'})
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();

    return skycons.set(iconID, Skycons[currentIcon]);
}

// https://stackoverflow.com/questions/2735881/adding-images-to-an-html-document-with-javascript
const createImage = (imageSrc) => {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style = "width: 200px; height: 200px";

    return img;
}

// Takes user input to retrieve information on city
const getCityInfo = async (baseURL, cityName, apiKey)=> {
    try {
        const res = await axios.get(`${baseURL}?q=${cityName}&country=us&maxRows=3&${apiKey}`)
        
        return res.data;
    } catch(error) {
        console.log("error", error);
    }
}

// Posts data to server
const postData = async (url, data)=>{
    try{
      const response = await axios.post(url, data);
        console.log('TEST----',response.data)
      return  response.data;
    } catch(error) {
      console.log("error", error);
    } 
  }
  
  export { getDate, getIcons, createImage, getCityInfo, postData }