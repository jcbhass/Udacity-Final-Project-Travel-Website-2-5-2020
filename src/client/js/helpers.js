import axios from 'axios';

function createImage(imageSrc) {
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
        // appropriately handle the error
    }
}

function getName() {
    return 'Jimoh';
}
  
  export { createImage, getZipCode, getName }