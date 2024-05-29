document.getElementById("selectButton").addEventListener("click", function () {
  const action = document.getElementById("action").value;
  if (action === "view") {
    viewRBNumber();
  } else {
    showUpdateForm();
  }
});

document
  .getElementById("updateYesButton")
  .addEventListener("click", function () {
    showUpdateForm();
  });

document
  .getElementById("updateNoButton")
  .addEventListener("click", function () {
    document.getElementById("viewForm").style.display = "none";
    document.getElementById("selectionForm").style.display = "block";
  });

document
  .getElementById("updateButton")
  .addEventListener("click", async function () {
    const variableValue = document.getElementById("variableValue").value;

    const tokenServiceUrl =
      "YOUR TOKEN SERVICE URL"; // Replace with your Cloud Function URL
    const tokenName = "YOUR_TOKEN_NAME"; // Replace with your token name
    const tokenPassphrase = "YOUR-PASSPHRASE"; // Replace with your secret token passphrase

    try {
      // Fetch the access token from the token service
      console.log("Fetching access token...");
      const tokenResponse = await fetch(
        `${tokenServiceUrl}?name=${tokenName}`,
        {
          method: "GET",
          headers: {
            "x-token-passphrase": tokenPassphrase,
          },
        }
      );

      const tokenData = await tokenResponse.json();
      console.log("Token response:", tokenData);

      if (tokenResponse.status !== 200) {
        throw new Error(tokenData.message);
      }

      const token = tokenData.token;
      if (!token) {
        throw new Error("Access Token Not Found");
      }

      // Prepare the data to be sent in the PUT request
      const data = {
        active: true,
        agentEditable: false,
        agentViewable: false,
        defaultValue: variableValue, // Set the variable value here
        id: "YOUR_GLOBAL_VARIABLE_ID", // This should be set to the ID of the variable you want to update
        name: "VARIABLE_NAME", // Set the variable name here
        reportable: false,
        variableType: "String",
        sensitive: false
      };

      // Prepare the request options
      const options = {
        method: "PUT",
        url: "https://api.wxcc-eu2.cisco.com/organization/YOUR-ORG-ID/cad-variable/YOUR_GLOBAL_VARIABLE_ID", // Update with your organization and variable IDs
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: data,
      };

      // Make the PUT request using Axios
      axios
        .request(options)
        .then(function (response) {
          document.getElementById("responseMessage").innerHTML =
            '<i class="fas fa-check-circle icon" style="color: green;"></i> Phone Number updated successfully!';
          document.getElementById("responseMessage").classList.add("show");
          console.log(response.data);
        })
        .catch(function (error) {
          document.getElementById("responseMessage").innerHTML =
            '<i class="fas fa-times-circle icon" style="color: red;"></i> Error updating Phone Number: ' +
            error.message;
          document.getElementById("responseMessage").classList.add("show");
          console.error(error);
        });
    } catch (error) {
      document.getElementById("responseMessage").innerHTML =
        '<i class="fas fa-times-circle icon" style="color: red;"></i> Error: ' +
        error.message;
      document.getElementById("responseMessage").classList.add("show");
    }
  });

async function viewRBNumber() {
  const tokenServiceUrl =
    "YOUR_TOKEN_SERVICE_URL"; // Replace with your Cloud Function URL
  const tokenName = "YOUR_TOKEN"; // Replace with your token name
  const tokenPassphrase = "YOUR_PASSPHRASE"; // Replace with your secret token passphrase

  try {
    // Fetch the access token from the token service
    console.log("Fetching access token...");
    const tokenResponse = await fetch(`${tokenServiceUrl}?name=${tokenName}`, {
      method: "GET",
      headers: {
        "x-token-passphrase": tokenPassphrase,
      },
    });

    const tokenData = await tokenResponse.json();
    console.log("Token response:", tokenData);

    if (tokenResponse.status !== 200) {
      throw new Error(tokenData.message);
    }

    const token = tokenData.token;
    if (!token) {
      throw new Error("Access Token Not Found");
    }

    // Prepare the request options
    const options = {
      method: "GET",
      url: "https://api.wxcc-eu2.cisco.com/organization/YOUR_ORG_ID/cad-variable/YOUR_GLOBAL_VARIABLE_ID", // Update with your organization and variable IDs
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

     // Make the GET request using Axios
        axios.request(options).then(function(response) {
            const rbNumber = response.data.defaultValue;
            document.getElementById('rbNumber').innerText = `Current RB Number - ${rbNumber}`;
            document.getElementById('viewForm').style.display = 'block';
            document.getElementById('selectionForm').style.display = 'none';
            console.log(response.data);
        }).catch(function(error) {
            document.getElementById('responseMessage').innerHTML = '<i class="fas fa-times-circle icon" style="color: red;"></i> Error fetching RB number: ' + error.message;
            document.getElementById('responseMessage').classList.add('show');
            console.error(error);
        });
    } catch (error) {
        document.getElementById('responseMessage').innerHTML = '<i class="fas fa-times-circle icon" style="color: red;"></i> Error: ' + error.message;
        document.getElementById('responseMessage').classList.add('show');
    }
}


function showUpdateForm() {
  document.getElementById("updateForm").style.display = "block";
  document.getElementById("viewForm").style.display = "none";
  document.getElementById("selectionForm").style.display = "none";
}
