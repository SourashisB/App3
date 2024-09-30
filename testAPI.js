var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
    "key": "89qz2rpqbf30b5",
    "prompt": "green monster",
    "negative_prompt": "bad quality",
    "init_image": "https://modelslab-test-sour.s3.ap-southeast-2.amazonaws.com/uploads/istockphoto-1305617060-612x612.jpg",
    "width": "512",
    "height": "512",
    "samples": "1",
    "temp": false,
    "safety_checker": false,
    "strength":0.5,
    "seed": null,
    "webhook": null,
    "track_id": null
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://modelslab.com/api/v1/enterprise/realtime/img2img", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));