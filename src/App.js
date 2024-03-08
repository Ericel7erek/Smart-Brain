import React, { Component } from "react";
import "./App.css";
import Nav from "./Components/Navigation/Navigation";
import "tachyons";
import Logo from "./Components/Logo/Logo";
import ImageLinkForm from "./Components/ImageLinkForm/ImageLinkForm";
import Rank from "./Components/Rank/Rank";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import FaceRecognition from "./Components/FaceRecognition/FaceRecognition";
import SignIn from "./Components/SignIn/SignIn";
import Register from "./Components/Register/Register";

class App extends Component {
  constructor() {
    super();
    this.state = {
      init: false,
      input: "",
      imageUrl: "",
      box: [],
      route: "SignIn",
      isSignedIn: false,
    };

    this.particlesOptions = {
      background: {},
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
          resize: true,
        },
        modes: {
          push: {
            quantity: 5,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: "#ffffff",
        },
        links: {
          color: "#ffffff",
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: 6,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 250,
          },
          value: 200,
        },
        opacity: {
          value: 0.5,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: {
            min: 1,
            max: 5,
          },
        },
      },
      detectRetina: true,
    };

    this.PAT = "e6d46d5741c3422fbe02a8cda36ea295";
    this.USER_ID = "ericel7erek";
    this.APP_ID = "my-first-application-0kuz0s";
    this.MODEL_ID = "face-detection";
    this.MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";
  }
  calculateLocation = (data) => {
    const image = document.getElementById("inputImage");
    const width = image.width;
    const height = image.height;
    console.log(width, height);
    return data.outputs[0].data.regions.map((face) => {
      const clarifaiFace = face.region_info.bounding_box;
      console.log(clarifaiFace);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    const IMAGE_URL = this.state.input;
    const raw = JSON.stringify({
      user_app_id: {
        user_id: this.USER_ID,
        app_id: this.APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + this.PAT,
      },
      body: raw,
    };

    fetch(
      "https://api.clarifai.com/v2/models/" +
        this.MODEL_ID +
        "/versions/" +
        this.MODEL_VERSION_ID +
        "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => this.displayFaceBox(this.calculateLocation(response)))
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  };

  componentDidMount() {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      this.setState({ init: true });
    });
    console.log("initialized");
  }
onRouteChange = (route) => {
  if (route === 'SignOut'){
    this.setState({ isSignedIn: false });
  }
  else if (route === "home") {
    this.setState({ isSignedIn: true });
  }
  {this.setState({route: route})}
}

  render() {
    const { init, imageUrl, box, route, isSignedIn } = this.state;

    return (
      <div className="App">
        {init && (
          <Particles
            className="Particles"
            id="tsparticles"
            options={this.particlesOptions}
          />
        )}
        <Nav isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        { route === "home" ?
        <><Logo /><Rank /><ImageLinkForm
        onInputChange={this.onInputChange}
        onButtonSubmit={this.onButtonSubmit}
        onSubmitReset={this.onSubmitReset} /><FaceRecognition box={box} imageUrl={imageUrl} /></>

        
        : (route === "SignIn"|| "SignOut")?
        <SignIn onRouteChange={this.onRouteChange}/>
        : <Register onRouteChange={this.onRouteChange} />
        }
      </div>
    );
  }
}

export default App;
