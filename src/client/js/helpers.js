import axios from 'axios';

// Create a new date instance dynamically with JS
const getDate =  () => {
    const d = new Date();
    const today = `${d.getMonth()+1}.${d.getDate()}.${d.getFullYear()}`;

    return today;
}

//Skycon
const setIcons = (icon, iconID) => {
    const skycons = new Skycons({ color: 'black'})
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();

    return skycons.set(iconID, Skycons[currentIcon]);
}

// https://stackoverflow.com/questions/2735881/adding-images-to-an-html-document-with-javascript
const createImage = (imageSrc) => {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.style = "width: 300px; height: 300px";

    return img;
}

const getZipCode = async (baseURL, zipCode, apiKey)=> {
    try {
        const res = await axios.get(baseURL+zipCode+apiKey);
        return res.data;
    } catch(error) {
        console.log("error", error);
    }
}

// Async POST
const postData = async ( url, data)=>{
    try{
      const response = await axios.post(url, data);

      return  response.data;
    } catch(error) {
      console.log("error", error);
    } 
  }
  
  export { getDate, setIcons, createImage, getZipCode, postData }