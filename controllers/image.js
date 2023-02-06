const USER_ID = process.env.CLARIFAI_USER_ID;

// Your PAT (Personal Access Token) is actually just the API key
const PAT = process.env.CLARIFAI_API_KEY;

const APP_ID = process.env.CLARIFAI_APP_ID;
const MODEL_ID = process.env.CLARIFAI_MODEL_ID;
const MODEL_VERSION_ID = process.env.CLARIFAI_MODEL_VERSION_ID;


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
