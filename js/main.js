// navbar functionality

document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  var instances = M.Sidenav.init(elems, {
    edge: "left",
    draggable: true,
    inDuration: 250,
    outDuration: 200,
    onOpenStart: null,
    onOpenEnd: null,
    onCloseStart: null,
    onCloseEnd: null,
    preventScrolling: false,
  });
});

if (location.pathname.includes("index")) {
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 500) {
      $(".btn-chat").css("transform", "translateX(0%)");
    } else {
      $(".btn-chat").css("transform", "translateX(200%)");
    }
  });
  $(window).scroll(function () {
    if ($(window).scrollTop() >= 500) {
      $("nav").css("background", "white");
      $(".link").css("color", "black");
      $("#sidenav").css("color", "black");
    } else {
      $("nav").css("background", "transparent");
      $(".link").css("color", "white");
      $("#sidenav").css("color", "white");
    }
  });

  // chat implementation
  function openChat() {
    document.getElementById("chatbox").style.display = "flex";
    document.getElementById("chatbox").style.flexDirection = "column";
    document.getElementById("chatbox").style.position = "fixed";
    $(".btn-chat").hide();
  }
  function closeChat() {
    document.getElementById("chatbox").style.display = "none";
    $(".btn-chat").show();
  }
  $("form").submit(function (e) {
    var textarea = document.querySelector("textarea");
    textarea.value = "";
    e.preventDefault();
    alert("Hemos recibido tu consulta! Gracias!");
  });
}

// json render

fetch("https://apipetshop.herokuapp.com/api/articulos")
  .then((res) => res.json())
  .then((data) => programa(data));

function programa(data) {
  if (location.pathname === "/pages/farmacia.html") {
    carrito(data, "Medicamento");
    login();
  } else if (location.pathname === "/pages/juguetes.html") {
    carrito(data, "Juguete");
    login();
  } else if (location.pathname === "/pages/contacto.html") {
    contacto();
    login();
  } else if (location.pathname === "/index.html") {
    login();
  }
}

function carrito(data, tipo) {
  let items = data.response;
  let arrayFiltrado = items.filter((item) => item.tipo === tipo);
  // variables

  const cartItems = document.querySelector(".cart-items");
  const cartContent = document.querySelector(".cart-content");
  const productsDOM = document.querySelector(".products-center");

  arrayFiltrado.forEach((o, i) => (o.id = i + 1));

  let cart = [];

  // display products
  let id = 0;
  function displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `
                      <article class="product">
                    <div class="img-container">
                        <a class="modal-trigger" href="#modal${(id += 1)}"><img class="product-img" src="${
        product.imagen
      }"></a>
                        <button class="carrito-btn" id=${id}><i class="fas fa-shopping-cart"></i>Agregar al
                            carrito</button>
                    </div>
                    <h4>${product.nombre}</h4>
                    <h5>$ ${product.precio}</h5>
                    <h6 class="ultimas">Últimas unidades !!!</h6>
                    
                    <div id="modal${id}" class="modal">
                      <div class="modal-content">
                        <h4>${product.nombre}</h4>
                        <img class="product-img modal-img" src="${
                          product.imagen
                        }">
                        <p>${product.descripcion}</p>
                      </div>
                    </div>

                </article>
      `;
    });
    productsDOM.innerHTML = result;
    let ultimas = document.getElementsByClassName("ultimas");

    for (let i = 0; i < ultimas.length; i++) {
      if (products[i].stock > 5) {
        ultimas[i].style.visibility = "hidden";
      }
    }
  }

  displayProducts(arrayFiltrado);

  $(document).ready(function () {
    $(".modal").modal();
  });

  // local storage

  localStorage.setItem("products", JSON.stringify(arrayFiltrado));

  const agregarBtns = [...document.querySelectorAll(".carrito-btn")];
  let result = "";
  let inCart = cart.find((element) => element.id === id);

  agregarBtns.forEach((agregarBtns) => {
    if (inCart) {
      agregarBtns.innerText = "en el carrito";
      button.disabled = true;
    }
    agregarBtns.addEventListener("click", (event) => {
      let idBtn = agregarBtns.id; // objeto con propiedades
      event.target.innerText = "en el carrito";
      event.target.disabled = true;
      let products = JSON.parse(localStorage.getItem("products"));
      let cartItem = { ...products[idBtn - 1], amount: 1 };
      cart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(cart));
      let cartLocalStorage = JSON.parse(localStorage.getItem("cart"));

      cartItems.innerText = cart.length;
      result += `<div class="cart-content">
        <!-- cart item -->
        <div class="cart-item">
        <img src="${cartItem.imagen}" alt="producto">
        <div>
        <h4>${cartItem.nombre}</h4>
        <h5>$ ${cartItem.precio}</h5>
        <span class="remove-item" id="${idBtn}">Eliminar</span>
        </div>
        <div>
        <div><i class="fas fa-chevron-up" id="chevronUp${idBtn}"></i></div>
        <p class="item-amount" id="${idBtn}">${cartItem.amount}</p>
        <div><i class="fas fa-chevron-down" id="chevronDown${idBtn}"></i></div>
        </div>
        </div>
        <!--  end cart item -->
        </div>`;

      cartContent.innerHTML =
        result +
        `<div class="cart-footer">
      <h3>Total : $<span class="cart-total"></span></h3>
      <button class="clear-cart banner-btn" id="clearCartBtn">Vaciar carrito</button>
      </div>`;

      setCartValues(cart);

      document
        .querySelector("#clearCartBtn")
        .addEventListener("click", function () {
          result = ``;
          for (let i = 0; i < cart.length; i++) {
            activateElement(document.getElementById(cart[i].id));
          }
          cart = [];
          cartItems.innerText = cart.length;
          cartContent.innerHTML = "Carrito vacío";
          agregarBtns.innerHTML = `<i class="fas fa-shopping-cart"></i>Agregar al carrito`;
        });

      let chevronUp = document.getElementsByClassName("fa-chevron-up");
      let chevronDown = document.getElementsByClassName("fa-chevron-down");
      if (chevronUp) {
        for (let i = 0; i < chevronUp.length; i++) {
          initialAmount = 1;
          chevronUp[i].addEventListener("click", function () {
            initialAmount += 1;
            let amount = document.querySelector(".item-amount");
            amount.innerText = initialAmount;
            cart.forEach((element) => {
              element.amount += 1;
            });

            let total = 0;
            for (let i = 0; i < cart.length; i++) {
              total += cart[i].precio * cart[i].amount;
              document.querySelector(".cart-total").innerText = total;
            }
          });
        }
      }
      if (chevronDown) {
        for (let i = 0; i < chevronDown.length; i++) {
          initialAmount = 1;
          chevronDown[i].addEventListener("click", function () {
            if (initialAmount > 1) {
              initialAmount -= 1;
              let amount = document.querySelector(".item-amount");
              amount.innerText = initialAmount;
              cart.forEach((element) => {
                element.amount -= 1;
              });
              for (let i = 0; i < cart.length; i++) {
                total = cart[i].precio * cart[i].amount;
                document.querySelector(".cart-total").innerText = total;
              }
            }
          });
        }
      }
    });
  });

  function activateElement(element) {
    element.innerHTML = `<i class="fas fa-shopping-cart"></i>Agregar al carrito`;
    element.disabled = false;
  }

  document.querySelector(".carrito").addEventListener("click", function () {
    document.querySelector(".cart-overlay").className =
      "cart-overlay transparentBcg";
    document.querySelector(".cart-overlay").style.opacity = 1;
    document.querySelector(".cart").className = "cart showCart";
  });
  document.querySelector(".close-cart").addEventListener("click", function () {
    document.querySelector(".cart-overlay").className = "cart-overlay";
    document.querySelector(".cart-overlay").style.opacity = 0;
    document.querySelector(".cart").className = "cart";
  });
}

function contacto() {
  $(document).ready(function () {
    $("select").formSelect();
  });

  $(document).ready(function () {
    $("input.autocomplete").autocomplete({
      data: {
        Schnauzer:
          "https://rlv.zcache.com/cartoon_giant_standard_miniature_schnauzer_cutout-rf22ed2d8263c46ebbe2e3c9add31770e_x7sai_8byvr_540.jpg",
        "Golden Retriever":
          "https://rlv.zcache.com/cartoon_golden_retriever_statuette-rf0a0aa2d557a484abf3916cdebb076a8_x7sai_8byvr_540.jpg",
        Pointer:
          "https://cdn.friendlystock.com/wp-content/uploads/2020/03/6-playful-pointer-cartoon-clipart.jpg",
        "Alaskan Malamute":
          "https://rlv.zcache.com/cartoon_siberian_husky_alaskan_malamute_cutout-rb8323d2f37ad4624bb4cd6fe72bcf1b7_x7sai_8byvr_540.jpg",
        "Bichón frisé":
          "https://rlv.zcache.com/cartoon_bichon_frise_cutout-re9168b0152c54d1da80eb9884eac878a_x7sai_8byvr_540.jpg",
        "Border Collie":
          "https://rlv.zcache.com/cartoon_border_collie_statuette-r22f4109cad884cdba70d240c3c9f14f0_x7sai_8byvr_540.jpg",
        Collie:
          "https://rlv.zcache.com/cartoon_shetland_sheepdog_collie_statuette-r3436a81d740f48309fe019bc53e5a65d_x7sai_8byvr_540.jpg",
        Husky:
          "https://rlv.zcache.com/cartoon_siberian_husky_alaskan_malamute_cutout-rb8323d2f37ad4624bb4cd6fe72bcf1b7_x7sai_8byvr_540.jpg",
        Doberman:
          "https://rlv.zcache.com/cartoon_doberman_pinscher_pointy_ears_statuette-rc1ae07f5199d4ae2a886a3527ae8243d_x7sai_8byvr_540.jpg",
        "Jack Russell":
          "https://rlv.zcache.com/cartoon_jack_russell_terrier_cutout-r63987237b1054283bb84579854844275_x7sai_8byvr_540.jpg",
        "San Bernardo":
          "https://rlv.zcache.com/cartoon_saint_bernard_cutout-rff002df7fd364e108984eebb4caa8e51_x7sai_8byvr_540.jpg",
        "Akita Inu":
          "https://rlv.zcache.com/cartoon_akita_inu_shiba_inu_statuette-r7dc883784ae345d6aca816eae27e5c92_x7sai_8byvr_540.jpg",
        Galgo:
          "https://rlv.zcache.com/cartoon_greyhound_whippet_italian_greyhound_statuette-ra658488600f54c8d9a9d0fef09899e01_x7sai_8byvr_540.jpg",
        "Pastor Alemán":
          "https://rlv.zcache.com/cartoon_german_shepherd_cutout-rf0cca0b30a32457aa8bd0f8817ab3647_x7sai_8byvr_540.jpg",
        "Gran Danés":
          "https://rlv.zcache.com/cartoon_great_dane_statuette-re283aea695554ef28c7ec76fbbea26cc_x7sai_8byvr_540.jpg",
        Poodle:
          "https://rlv.zcache.com/cartoon_standard_miniature_toy_poodle_puppy_cut_cutout-r96d7b1cf046c4d4992e476e5c7a30fbb_x7sai_8byvr_540.jpg",
        Beagle:
          "https://rlv.zcache.com/cartoon_beagle_statuette-recac2d67b03942cb9a07bf21c5ea991f_x7sai_8byvr_540.jpg",
        Labrador:
          "https://rlv.zcache.com/cartoon_labrador_retriever_cutout-rabf81ee58e01490a87b253e17f5069ee_x7sai_8byvr_540.jpg",
        Chihuahua:
          "https://rlv.zcache.com/cartoon_chihuahua_long_coat_cutout-rf15e1d3c2ee6449f9e65002d1df2ada3_x7sai_8byvr_540.jpg",
        Salchicha:
          "https://rlv.zcache.com/cartoon_dachshund_smooth_coat_statuette-rbf203457fcdc41e1a2f415b26230b858_x7sai_8byvr_540.jpg",
        "Bulldog Francés":
          "https://rlv.zcache.com/cartoon_french_bulldog_cutout-r5686689c8fa540a09ae706e77a301f60_x7sai_8byvr_540.jpg",
        Corgi:
          "https://rlv.zcache.com/cartoon_pembroke_welsh_corgi_cutout-rcc661f40d4914229b8064bd2ec583e3c_x7sai_8byvr_540.jpg",
        Rottweiler:
          "https://rlv.zcache.com/cartoon_rottweiler_statuette-rd1e5899e907a41d7bc1361678d4cc806_x7sai_8byvr_540.jpg",
        "Bull Terrier":
          "https://rlv.zcache.com/cartoon_staffordshire_bull_terrier_statuette-r2260eba3c7a84fc1abeff1d72664d663_x7sai_8byvr_540.jpg",
        "Chow Chow": "../assets/chow-chow-cartoon.png",
        "Boyero de Berna":
          "https://rlv.zcache.com/cartoon_bernese_mountain_dog_cutout-r91d8e0a735c541da9b8627f042c42d3c_x7sai_8byvr_540.jpg",
        Dálmata:
          "https://rlv.zcache.com/cartoon_dalmatian_cutout-r9c19e476ec344850b1a0450e493f6613_x7sai_8byvr_540.jpg",
        Pug:
          "https://rlv.zcache.com/cartoon_pug_statuette-r079a951ae4114b698e62ad43be261041_x7sai_8byvr_540.jpg",
        Cocker:
          "https://rlv.zcache.com/cartoon_american_cocker_spaniel_statuette-r03de54a32fe0421ba6378d502f8c5c48_x7sai_8byvr_540.jpg",
        "Shar Pei":
          "https://rlv.zcache.com/cartoon_shar_pei_statuette-r2e499d1737c24899ac84b612998508bd_x7sai_8byvr_540.jpg",
        Mastiff:
          "https://rlv.zcache.com/cartoon_neapolitan_mastiff_cutout-rc873beb1e6ac4904ac0cd65bd8a8bc7a_x7sai_8byvr_540.jpg",
        Boxer:
          "https://rlv.zcache.com/cartoon_boxer_statuette-r511bd73442e6416fa5c09ac0c2765b17_x7sai_8byvr_540.jpg",
        Pomerania:
          "https://rlv.zcache.com/cartoon_pomeranian_cutout-r5985adfaddca4855a073d914402d76ea_x7sai_8byvr_540.jpg",
      },
    });
  });

  document.getElementById("submit").addEventListener("click", (e) => {
    if (
      document.getElementsByTagName("input")[0].value &&
      document.getElementsByTagName("input")[1].value &&
      document.getElementsByTagName("input")[2].value
    ) {
      e.preventDefault();
      alert("¡Recibimos el formulario! ¡Gracias!");
      for (let i = 0; i < 4; i++) {
        document.getElementsByTagName("input")[i].value = "";
        console.log(document.getElementsByTagName("input")[i].style);
      }
    }
  });
}

function login() {
  $(document).ready(function () {
    $(".modal").modal();
  });

  let form = "";
  form += `
    <div id="modalLogin" class="modal">
    <div class="modal-content">
  
  <div id="login-page" class="row">
    <div class="col s12 z-depth-6 card-panel">
      <form class="login-form">
        <div class="row">
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">mail_outline</i>
            <input class="validate" id="email" type="email">
            <label for="email" data-error="wrong" data-success="right">Email</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <i class="material-icons prefix">lock_outline</i>
            <input id="password" type="password">
            <label for="password">Contraseña</label>
          </div>
        </div>
        <div class="row">          
          <div class="input-field col s12 m12 l12  login-text">
            <label for="remember-me">
                <input type="checkbox" class="filled-in" id="remember-me" />
                <span>Recordarme</span>
            </label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <a href="#" class="btn waves-effect waves-light col s12">Login</a>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s6 m6 l6">
            <p class="margin medium-small"><a href="#">Registrarme</a></p>
          </div>
          <div class="input-field col s6 m6 l6">
              <p class="margin center-align medium-small"><a href="#">Olvidé la contraseña</a></p>
          </div>          
        </div>

      </form>
    </div></div></div>`;

  document.getElementById("loginform").innerHTML = form;
}

function setCartValues(cart) {
  const cartItems = document.querySelector(".cart-items");
  const cartTotal = document.querySelector(".cart-total");
  let tempTotal = 0;
  let itemsTotal = 0;
  cart.map((item) => {
    tempTotal += item.precio * item.amount;
    itemsTotal += item.amount;
  });
  cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  cartItems.innerText = itemsTotal;
}
