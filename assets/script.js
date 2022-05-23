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
              <button class="Actions__delete btn">Delete</button> 
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

function openModalRegister() {
  document.querySelector(".modal-overlay").style.display = "flex";
}

function closeModalRegister() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.querySelector("#flavor").value = "";
  document.querySelector("#price").value = 0;
  document.querySelector("#description").value = "";
  document.querySelector("#photo").value = "";
}

async function createPalet() {
  const flavor = document.querySelector("#flavor").value;
  const price = Number(document.querySelector("#price").value);
  const description = document.querySelector("#description").value;
  const photo = document.querySelector("#photo").value;

  const palet = {
    flavor,
    price,
    description,
    photo,
  };

  const response = await fetch(baseUrl + "/create", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(palet),
  });

  const newPalet = await response.json();
  const html = `<div class="PaletListItem">
  <div>
      <div class="PaletListItem__flavor">${newPalet.flavor}</div>
      <div class="PaletListItem__price">R$ ${newPalet.price.toFixed(2)}</div>
      <div class="PaletListItem__description">${newPalet.description}</div>
    </div>
      <img class="PaletListItem__photo" src=${
        newPalet.photo
      } alt=${`Palet de ${newPalet.flavor}`} />
  </div>`;

  document.getElementById("paletList").insertAdjacentHTML("beforeend", html);

  closeModalRegister();
}
