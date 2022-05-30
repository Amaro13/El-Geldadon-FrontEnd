//FRONT-END
const baseUrl = "http://localhost:3001/palets";
const msgAlert = document.querySelector(".msg-alert");
async function findAllPalets() {
  const response = await fetch(`${baseUrl}/all-palets`);
  const palets = await response.json();
  palets.forEach((palet) => {
    document.getElementById("paletList").insertAdjacentHTML(
      "beforeend",
      `<div class="PaletListItem" id="PaletListItem_'${palet._id}'">
        <div>
            <div class="PaletListItem__flavor">${palet.flavor}</div>
            <div class="PaletListItem__price">R$ ${palet.price.toFixed(2)}</div>
            <div class="PaletListItem__description">${palet.description}</div>

            <div class="PaletListItem__actions Actions">
              <button class="Actions__edit btn" onclick="openModal('${
                palet._id
              }')">Edit</button> 
              <button class="Actions__delete btn" onclick="openDeleteModal('${
                palet._id
              }')">Delete</button> 
            </div>

          </div>
            <img class="PaletListItem__photo" src=${
              palet.photo
            } alt=${`Palet de ${palet.flavor}`} />
        </div>`
    );
  });
}

findAllPalets();

const findPaletById = async () => {
  const input = document.getElementById("search-input").value;
  const paletsorigin = await fetch(`${baseUrl}/all-palets`);
  const allpalets = await paletsorigin.json();
  const selectedpalet = allpalets.find((elem) => elem.flavor == input);
  const id = selectedpalet._id;

  if (id == "" || id == undefined) {
    localStorage.setItem("message", "Insert palet to search");
    localStorage.setItem("type", "danger");

    showMessageAlert();
  }
  const response = await fetch(`${baseUrl}/palet/${id}`);

  const palet = await response.json();
  console.log(palet.message);

  if (palet.message != undefined) {
    localStorage.setItem("message", palet.message);
    localStorage.setItem("type", "danger");

    showMessageAlert();
  } else {
    localStorage.setItem("message", "Success");
    localStorage.setItem("type", "success");

    showMessageAlert();
  }

  document.querySelector(".list-all").style.display = "block";
  document.querySelector(".PaletList").style.display = "none";

  const ChoosenPaletDiv = document.getElementById("choosenpalet");
  ChoosenPaletDiv.innerHTML = `<div class="PaletCardItem">
    <div>
      <div class="PaletCardItem__flavor">${palet.flavor}</div>
      <div class="PaletCardItem__price">R$ ${palet.price.toFixed(2)}</div>
      <div class="PaletCardItem__description">${palet.description}</div>

      <div class="PaletListItem__actions Actions">
          <button class="Actions__edit btn" onclick="openModal('${
            palet._id
          }')">Edit</button> 
          <button class="Actions__delete btn" onclick="openDeleteModal('${
            palet._id
          }')">Delete</button> 
      </div>
      
    </div>
      <img class="PaletCardItem__photo" src=${
        palet.photo
      } alt=${`Palet of ${palet.flavor}`} />
  </div>`;
};

async function openModal(id = "") {
  document.querySelector(".modal-overlay").style.display = "flex";
  if (id != "") {
    document.querySelector("#title-header-modal").innerText = "Update a Palet";
    document.querySelector("#button-form-modal").innerText = "Update";

    const response = await fetch(`${baseUrl}/palet/${id}`);
    const palet = await response.json();

    document.querySelector("#flavor").value = palet.flavor;
    document.querySelector("#price").value = palet.price;
    document.querySelector("#description").value = palet.description;
    document.querySelector("#photo").value = palet.photo;
    document.querySelector("#id").value = palet._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Register a Palet";
    document.querySelector("#button-form-modal").innerText = "Register";
  }

  document.querySelector(".modal-overlay").style.display = "flex";
}

function closeModal() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.querySelector("#flavor").value = "";
  document.querySelector("#price").value = 0;
  document.querySelector("#description").value = "";
  document.querySelector("#photo").value = "";
}

async function submitPalet() {
  const id = document.getElementById("id").value;
  const flavor = document.querySelector("#flavor").value;
  const price = Number(document.querySelector("#price").value);
  const description = document.querySelector("#description").value;
  const photo = document.querySelector("#photo").value;

  const palet = {
    id,
    flavor,
    price,
    description,
    photo,
  };
  // console.log(palet);
  const EditModeActivate = id != "";

  const endpoint = baseUrl + (EditModeActivate ? `/update/${id}` : "/create");

  const response = await fetch(endpoint, {
    method: EditModeActivate ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(palet),
  });

  const newPalet = await response.json();
  // document.location.reload(true);
  if (newPalet.message != undefined) {
    localStorage.setItem("message", newPalet.message);
    localStorage.setItem("type", "danger");
    showMessageAlert();
    return;
  }

  if (EditModeActivate) {
    localStorage.setItem("message", "Palet sucessfully updated");
    localStorage.setItem("type", "success");
  } else {
    localStorage.setItem("message", "Palet sucessfully created");
    localStorage.setItem("type", "success");
  }
  closeModal();
  document.location.reload(true);
}

function openDeleteModal(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnYes = document.querySelector(".btn_delete_yes");

  btnYes.addEventListener("click", function () {
    deletePalet(`${id}`);
  });
}

function closeDeleteModal() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deletePalet(id) {
  const response = await fetch(`${baseUrl}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });

  const result = await response.json();
  // alert(result.message);

  document.getElementById("paletList").innerHTML = "";

  localStorage.setItem("message", result.message);
  localStorage.setItem("type", "success");

  closeDeleteModal();
  // findAllPalets();
  document.location.reload(true);
}

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}

function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}
showMessageAlert();
