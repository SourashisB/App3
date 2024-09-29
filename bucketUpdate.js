var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "key": "89qz2rpqbf30b5",
  "deploy_type": "realtime",
  "public_url": "https://modelslab-test-sour.s3.ap-southeast-2.amazonaws.com/",
  "region_name": "ap-southeast-2",
  "endpoint_url": "https://modelslab-test-sour.s3.amazonaws.com",
  "aws_access_key_id": "AKIAXQIP742O6UIW3NN2",
  "aws_secret_access_key": "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",
  "image_directory": "modelslab"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://modelslab.com/api/v1/enterprise/update_s3", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  