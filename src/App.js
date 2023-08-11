import './App.css';
import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
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

const initialState = {
  input: '',
  imageurl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  };

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    }})
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
    this.setState({box: box});

  };

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  };

  onSubmit = () => {
    this.setState({imageurl: this.state.input});
    let requestOptions = setupClarifai(this.state.input);
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        }
        this.displayFacebox(this.calFaceLocation(result))})
      .catch(error => console.log('error', error));
  };

  onRouteChange = (route) => {
    if (route === 'home') {
      this.setState({isSignedIn: true})
    } else {
      this.setState(initialState)
    }
    this.setState({route: route});
  };

  render() {
    const {isSignedIn, imageurl, box} = this.state;
  return (
    <div className="App">
      <ParticlesBg type="color" bg={true} className='particles'/>
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
      <Logo />
      { this.state.route === 'home' ?
      <div>
        <Rank name={this.state.user.name} entries={this.state.user.entries}/>
        <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
        <FaceRecognition imageurl={imageurl} box={box}/>
      </div>
      : ( this.state.route === 'signin' ? 
      <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> : 
      <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>)
      }
    </div>
  );
}
}

export default App;
