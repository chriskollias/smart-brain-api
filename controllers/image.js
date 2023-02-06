const USER_ID = "chriskollias500";

// Your PAT (Personal Access Token) is actually just the API key
const PAT = "c71961b6dcbb462fac8ca6c50b7c9665";

const APP_ID = "my-first-application";
const MODEL_ID = "face-detection";
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";


const handleAPICall = (req, res) => {
  const IMAGE_URL = req.body.input;
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

  // NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
  // https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
  // this will default to the latest version_id
  fetch(
    "https://api.clarifai.com/v2/models/" +
      MODEL_ID +
      "/versions/" +
      MODEL_VERSION_ID +
      "/outputs",
    requestOptions
  )
    .then((res) => res.json())
    .then((data) => {
      res.json(data);
    })
    .catch(err => res.status(400).json("unable to work with API"))
}

const handleImage = (req, res, db) => {

	const { id } = req.body;
  db("users").where('id', '=', id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0].entries);
    })
    .catch(err => res.status(400).json("Unable to get entries"))
}

module.exports = {
    handleImage,
    handleAPICall
}
