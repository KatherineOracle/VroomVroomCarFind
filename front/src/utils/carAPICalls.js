let api_url = "./api";

export const carGet = async (id) => {
  const requestOptions = {
    method: "GET",
  };

  return fetch(api_url + "/" + id, requestOptions)
    .then((res) => {
      return res.json();
    })
    .catch(function (error) {
      console.log(error);
      return { error: "Could not get car" };
    });
};

export async function carPut(id, formData) {
  const requestOptions = {
    method: "PUT",
    body: formData,
  };
  const response = await fetch(api_url + "/" + id, requestOptions)
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.log(error);
      return { error: error };
    });

  return response;
}

export async function carPost(formData) {
  const requestOptions = {
    method: "POST",
    body: formData,
  };
  const response = await fetch(api_url, requestOptions)
    .then((res) => {
      return res.json();
    })
    .catch((error) => {
      console.log(error);
      return { error: error };
    });

  return response;
}

export async function carDelete(id) {
  const requestOptions = {
    method: "DELETE"
  };
  const response = await fetch(api_url+ "/" + id, requestOptions)
    .then((res) => {
      return res.json();
    })
    .catch(function (error) {
      console.log(error);
      return { error: "Could not delete." };
    });

    return response;
}
