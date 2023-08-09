import './App.css';
import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg'

//index.js file
const setupClarifai = (imgUrl) => {
  const PAT = 'a573c099631f4d91844a1a849d76ca39';
  const USER_ID = 'vicki_100';
  const APP_ID = 'my-first-application-vr0ve';
  const MODEL_ID = 'face-detection';
  const IMAGE_URL = imgUrl;

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  return requestOptions;
  /*
  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result.outputs[0].data.regions[0].region_info.bounding_box))
      .catch(error => console.log('error', error)); */
};


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageurl: '',
      box: {},
    }
  };

  calFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftcol: clarifaiFace.left_col * width,
      toprow: clarifaiFace.top_row * height,
      rightcol: width - (clarifaiFace.right_col * width),
      bottomrow: height - (clarifaiFace.bottom_row * height),
    };
  };

  displayFacebox = (box) => {
    console.log(box);
    this.setState({box: box});

  };

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value})
  };

  onSubmit = () => {
    console.log('click');
    this.setState({imageurl: this.state.input});
    let requestOptions = setupClarifai(this.state.input);
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", requestOptions)
      .then(response => response.json())
      .then(result => this.displayFacebox(this.calFaceLocation(result)))
      .catch(error => console.log('error', error));
  };

  render() {
  return (
    <div className="App">
      <ParticlesBg type="color" bg={true} className='particles'/>
      <Navigation />
      <Logo />
      <Rank />
      <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
      <FaceRecognition imageurl={this.state.imageurl} box={this.state.box}/>
    </div>
  );
}
}

export default App;
