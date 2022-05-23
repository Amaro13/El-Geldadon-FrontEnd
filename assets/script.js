//FRONT-END
const baseUrl = "http://localhost:3001/palets";

async function findAllPalets() {
  const response = await fetch(`${baseUrl}/all-palets`);

  const palets = await response.json();
  palets.forEach((palet) => {
    document.getElementById("paletList").insertAdjacentHTML(
      "beforeend",
      `<div class="PaletListItem" id="PaletListItem_${palet.id}">
        <div>
            <div class="PaletListItem__flavor">${palet.flavor}</div>
            <div class="PaletListItem__price">R$ ${palet.price.toFixed(2)}</div>
            <div class="PaletListItem__description">${palet.description}</div>

            <div class="PaletListItem__actions Actions">
              <button class="Actions__edit btn" onclick="openModal(${
                palet.id
              })">Edit</button> 
              <button class="Actions__delete btn" onclick="openDeleteModal(${
                palet.id
              })">Delete</button> 
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
  const id = document.getElementById("idPalet").value;

  const response = await fetch(`${baseUrl}/palet/${id}`);

  const palet = await response.json();

  const ChoosenPaletDiv = document.getElementById("choosenpalet");

  ChoosenPaletDiv.innerHTML = `<div class="PaletCardItem">
    <div>
      <div class="PaletCardItem__flavor">${palet.flavor}</div>
      <div class="PaletCardItem__price">R$ ${palet.price.toFixed(2)}</div>
      <div class="PaletCardItem__description">${palet.description}</div>
    </div>
      <img class="PaletCardItem__photo" src=${
        palet.photo
      } alt=${`Palet of ${palet.flavor}`} />
  </div>`;
};

async function openModal(id) {
  document.querySelector(".modal-overlay").style.display = "flex";
  if (id != null) {
    document.querySelector("#title-header-modal").innerText = "Update a Palet";
    document.querySelector("#button-form-modal").innerText = "Update";

    const response = await fetch(`${baseUrl}/palet/${id}`);
    const palet = await response.json();

    document.querySelector("#flavor").value = palet.flavor;
    document.querySelector("#price").value = palet.price;
    document.querySelector("#description").value = palet.description;
    document.querySelector("#photo").value = palet.photo;
    document.querySelector("#id").value = palet.id;
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

async function createPalet() {
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

  const EditModeActivate = id > 0;

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
  const html = `
  <div class="PaletListItem" id="PaletListItem_${newPalet.id}">
    <div>
        <div class="PaletListItem__flavor">${newPalet.flavor}</div>
        <div class="PaletListItem__price">R$ ${newPalet.price}</div>
        <div class="PaletListItem__description">${newPalet.description}</div>

        <div class="PaletListItem__actions Actions">
          <button class="Actions__edit btn" onclick="openModal(${newPalet.id})">Edit</button> 
          <button class="Actions__delete btn" onclick="openDeleteModal(${newPalet.id})">Delete</button> 
        </div>
    </div>
    <img class="PaletListItem__photo" src="${newPalet.photo}" alt="Palet of ${newPalet.flavor}" />
  </div>`;

  if (EditModeActivate) {
    document.getElementById(`PaletListItem_${id}`).outerHTML = html;
  } else {
    document.getElementById("paletList").insertAdjacentHTML("beforeend", html);
  }
  closeModal();
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
  alert(result.message);

  document.getElementById("paletList").innerHTML = "";

  closeDeleteModal();
  findAllPalets();
}
