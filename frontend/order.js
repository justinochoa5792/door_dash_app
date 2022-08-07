window.menuItems = 0;
const clothingItem = document.getElementsByClassName("clothing");
const clothingTotal = document.getElementById("price");
const orderTotal = document.getElementById("total");

const street = document.getElementById("street");
const city = document.getElementById("city");
const zipcode = document.getElementById("zipcode");
const fname = document.getElementById("name");
const lastname = document.getElementById("lastname");
const phonenumber = document.getElementById("phonenumber");

async function callFeeApi({ target }) {
  if (target.className === "clothing" && target.checked) {
    window.menuItems += parseInt(target.value);
  } else if (target.className === "clothing" && !target.checked) {
    window.menuItems -= parseInt(target.value);
  }
  let response = await getFee();
  if (response) {
    window.responseFee = response.data.fee;
    orderTotal.textContent = `$${(
      (Number(window.menuItems) + response.data.fee) /
      100
    ).toFixed(2)}`;
  } else {
    orderTotal.textContent = `$${(Number(window.menuItems) / 100).toFixed(2)}`;
  }

  clothingTotal.textContent = `$${(window.menuItems / 100).toFixed(2)}`;
}

for (const clothing of clothingItem) {
  clothing.addEventListener("click", callFeeApi);
}

street.addEventListener("focusout", callFeeApi);
city.addEventListener("focusout", callFeeApi);
zipcode.addEventListener("focusout", callFeeApi);
fname.addEventListener("focusout", callFeeApi);
lastname.addEventListener("focusout", callFeeApi);
phonenumber.addEventListener("focusout", callFeeApi);
