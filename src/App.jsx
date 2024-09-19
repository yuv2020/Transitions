// ImageEffects.js
import React, { useState,useEffect } from 'react';
import './App.css'; 
import image1 from './arindam_intense_anaglyph1.jpg';
import image2 from './arindam_intense_anaglyph2.jpg';
import image3 from './arindam_intense_anaglyph2.jpg';
import image4 from './arindam_intense_anaglyph4.jpg';
import image5 from './arindam_intense_anaglyph5.jpg';
import image6 from './arindam_intense_anaglyph6.jpg';
import image7 from './arindam_intense_anaglyph7.jpg';
import image8 from './arindam_intense_anaglyph8.jpg';
import image9 from './arindam_intense_anaglyph9.jpg';
import image10 from './arindam_intense_anaglyph10.jpg';
import abiv from './abiv.png'

const ImageEffects = () => {
    const [effect, setEffect] = useState('bookout-zoom-out');
    const [isMosaic, setIsMosaic] = useState(true); 
    const [count,setcount]=useState(0);
const imgdictionary={
    'image1':image1,
    'image2':image2,
    'image3':image3,
    'image4':image4,
    'image5':image5,
    'image6':image6,
    'image7':image7,
    'image8':image8,
    'image9':image9,
    'image10':image10
}
const [img1,setimg1]=useState(abiv)
const effects=['zoom-in','grayscaleToColor','zoom-out','side-up','slide-down','bounce','rotate-3d','glitch','unmosaic']
useEffect(()=>{
    setInterval(()=>{
        let randomNumber = Math.floor(Math.random() * 10) + 1;
        let randomNumber2 = Math.floor(Math.random() * effects.length);
        if(count!=0)
        setimg1(imgdictionary[`image${randomNumber}`]);
    if(count==0)setEffect('bookout')
    else
        setEffect(effects[randomNumber2]);
        setcount(count+1);
        if(count!=1)
        setTimeout(() => setEffect(''), 5000);
    },10000)
})

    return (
        <div className="image-effects-container">
            <div className={`image-container ${effect} `}style={{background:image1}}>
                <img
                    src={img1} 
                    alt="Sample"
                />
            </div>
        </div>
    );
};

export default ImageEffects;
