document.addEventListener("DOMContentLoaded", () => {
  const imageForm = document.querySelector("#imageForm");
  const imageInput = document.querySelector("#imageInput");

  imageForm.addEventListener("submit", async event => {
    event.preventDefault();
    const file = imageInput.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    // Get secure URL from your server
    const { url } = await fetch("/s3Url").then(res => res.json());
    console.log(url);

    // Extract the URL and upload the image directly to the S3 bucket
    const uploadUrl = url.split('?')[0];
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": file.type // Set the Content-Type to the file's MIME type
      },
      body: file
    });

    // Construct the image URL without query parameters
    const imageUrl = uploadUrl;
    console.log(imageUrl);

    // Post request to your server to store any extra data
    await fetch("/storeImageData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ imageUrl, extraData: "Your extra data here" })
    });

    // Display the uploaded image
    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = "Uploaded Image";
    document.body.appendChild(img);
  });
});
