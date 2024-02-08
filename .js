class App extends Component {
  constructor() {
    super();
    this.state = {
      init: false,
      input: "",
      imageUrl: "",
      box: {},
    };
  }
}
calculateLocation = (data) => {
  const Clarifai = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById("inputimage");
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    left_col: Clarifai.left_col * width,
    top_row: Clarifai.top_row * height,
    right_col: width - Clarifai.right_col * width,
    bottom_row: height - Clarifai.bottom_row * height,
  };
};

displaybox = (box) => {
  this.setState({ box: box });
};

onInputChange = (event) => {
  this.setState({ input: event.target.value });
};

onButtonSubmit = () => {
  this.setState({ imageUrl: this.state.input });
  fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    requestOptions
  )
    .then((response) => this.displaybox(this.calculateLocation(response.json)))
    .then((result) => {
      const regions = result.outputs[0].data.regions;

      regions.forEach((region) => {
        // Accessing and rounding the bounding box values
        const boundingBox = region.region_info.bounding_box;
        const topRow = boundingBox.top_row.toFixed(3);
        const leftCol = boundingBox.left_col.toFixed(3);
        const bottomRow = boundingBox.bottom_row.toFixed(3);
        const rightCol = boundingBox.right_col.toFixed(3);

        region.data.concepts.forEach((concept) => {
          // Accessing and rounding the concept value
          const name = concept.name;
          const value = concept.value.toFixed(4);

          console.log(
            `${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`
          );
        });

        // Update the bounding box
      });
    })
    .catch((error) => console.log("error", error));
};
componentDidMount = () => {
  initParticlesEngine(async (engine) => {
    await loadSlim(engine);
  }).then(() => {
    this.setState({ isInitialized: true });
  });
  console.log("initialized");
};

const PAT = "e6d46d5741c3422fbe02a8cda36ea295";
const USER_ID = "ericel7erek";
const APP_ID = "my-first-application-0kuz0s";
const MODEL_ID = "general-image-detection";
const MODEL_VERSION_ID = "1580bb1932594c93b7e2e04456af7c6f";
const IMAGE_URL = input;

const raw = JSON.stringify({
  user_app_id: {
    user_id: USER_ID,
    app_id: APP_ID,
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
    Authorization: "Key " + PAT,
  },
  body: raw,
};

render = () => {
  const { imageUrl, box } = this.state;
  return (
    <div className="App">
      {init && (
        <Particles
          className="Particles"
          id="tsparticles"
          options={particlesOptions}
        />
      )}
      <Nav />
      <Logo />
      <Rank />
      <ImageLinkForm
        onInputChange={onInputChange}
        onButtonSubmit={onButtonSubmit}
      />
      <FaceRecognition box={box} imageUrl={imageUrl} />
    </div>
  );
};

export default App;
