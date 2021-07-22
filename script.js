const defaultLiffId = "1655423670-X5b8yQrb";
const myLiffId = defaultLiffId;

const initializeLiff = (myLiffId) => {
  liff
    .init({
      liffId: myLiffId,
    })
    .then(() => {
      // start to use LIFF's api
      initializeApp();
    })
    .catch((err) => {
      document.getElementById("liffAppContent").classList.add("hidden");
      document.getElementById("liffInitErrorMessage").classList.remove("hidden");
    });
};
/**
 * Initialize the app by calling functions handling individual app components
 */
const initializeApp = () => {
  if (liff.isInClient()) {
    document.getElementById("liffLogoutButton").classList.toggle("hidden");
  } else {
    document.getElementById("openWindowButton").classList.toggle("hidden");
    document.getElementById("closeWindowButton").classList.toggle("hidden");
  }

  if (liff.isLoggedIn()) {
    document.getElementById("notLogin").classList.toggle("hidden");
    liff
      .getProfile()
      .then((profile) => {
        const name = profile.displayName;
        const img = profile.pictureUrl;
        displayUser(name, img);
      })
      .catch((err) => {
        console.log("error", err);
      });
  } else {
    document.getElementById("liffAppContent").classList.toggle("hidden");
  }
};

const displayUser = (name, img) => {
  document.getElementById("username").innerHTML = name;
  document.getElementById("img-user").src = img;
};

const getData = () => {
  document.getElementById("mie-goreng-quantity").innerHTML = localStorage.getItem("mieGoreng");
  document.getElementById("mie-rebus-quantity").innerHTML = localStorage.getItem("mieRebus");
  document.getElementById("kopi-quantity").innerHTML = localStorage.getItem("kopi");
  document.getElementById("teh-quantity").innerHTML = localStorage.getItem("teh");
  orderQuantity();
  orderPrice();
  liff
    .init({
      liffId: myLiffId, // Use own liffId
    })
    .then(() => {
      initializeApp();
    })
    .catch((err) => {
      // Error happens during initialization
      console.log("Error");
    });
};

const postData = () => {
  var mieGoreng = document.getElementById("mie-goreng-quantity").innerHTML;
  var mieRebus = document.getElementById("mie-rebus-quantity").innerHTML;
  var kopi = document.getElementById("kopi-quantity").innerHTML;
  var teh = document.getElementById("teh-quantity").innerHTML;
  localStorage.setItem("mieGoreng", mieGoreng);
  localStorage.setItem("mieRebus", mieRebus);
  localStorage.setItem("kopi", kopi);
  localStorage.setItem("teh", teh);
};

const add = (data) => {
  document.getElementById(data).innerHTML++;
  orderQuantity();
  orderPrice();
  postData();
};

function minus(data) {
  if (document.getElementById(data).innerHTML > 0) {
    document.getElementById(data).innerHTML--;
  }
  orderQuantity();
  orderPrice();
  postData();
}
const orderQuantity = () => {
  var mieGoreng = document.getElementById("mie-goreng-quantity").innerHTML;
  var mieRebus = document.getElementById("mie-rebus-quantity").innerHTML;
  var kopi = document.getElementById("kopi-quantity").innerHTML;
  var teh = document.getElementById("teh-quantity").innerHTML;
  var orderSummary = [];
  if (mieGoreng > 0) {
    orderSummary.push(mieGoreng + " Mie Goreng");
  }
  if (mieRebus > 0) {
    orderSummary.push(" " + mieRebus + " Mie Rebus");
  }
  if (kopi > 0) {
    orderSummary.push(" " + kopi + " Kopi");
  }
  if (teh > 0) {
    orderSummary.push(" " + teh + " Teh");
  }
  document.getElementById("total").innerHTML = orderSummary;
};

const orderPrice = () => {
  var mieGoreng = document.getElementById("mie-goreng-quantity").innerHTML;
  var mieRebus = document.getElementById("mie-rebus-quantity").innerHTML;
  var kopi = document.getElementById("kopi-quantity").innerHTML;
  var teh = document.getElementById("teh-quantity").innerHTML;
  document.getElementById("orderPrice").innerHTML = "Rp" + (mieGoreng * 10000 + mieRebus * 20000 + kopi * 15000 + teh * 25000);
};

document.getElementById("sendMessageButton").addEventListener("click", function () {
  var menu = [];
  menu[0] = document.getElementById("mie-goreng-quantity").innerHTML + "Mie Goreng\n";
  menu[1] = document.getElementById("mie-rebus-quantity").innerHTML + " Mie Rebus\n";
  menu[2] = document.getElementById("kopi-quantity").innerHTML + " Kopi\n";
  menu[3] = document.getElementById("teh-quantity").innerHTML + " Teh\n";
  var message = [];
  for (var i = 0; i < 4; i++) {
    if (menu[i][0] > 0) {
      message.push(menu[i]);
    }
  }
  var username = document.getElementById("username").innerHTML;
  var message = "Hai " + username + ",\n\nTerima kasih telah berkunjung, berikut pesanannya:\n\n";
  for (var i = 0; i < message.length; i++) {
    message += message[i];
  }
  message += "\nPesanan Anda akan segera disiapkan.\n\nMohon ditunggu ya!";
  if (!liff.isInClient()) {
    sendAlertIfNotInClient();
  } else {
    liff
      .sendMessages([
        {
          type: "text",
          text: message,
        },
      ])
      .then(function () {
        window.alert("Ini adalah pesan dari fitur Send Message");
      })
      .catch(function (error) {
        window.alert("Error sending message: " + error);
      });
  }
});

document.getElementById("openWindowButton").addEventListener("click", function () {
  liff.openWindow({
    url: "https://warunk-sanskuy.herokuapp.com/",
    external: true,
  });
});

document.getElementById("closeWindowButton").addEventListener("click", function () {
  if (!liff.isInClient()) {
    sendAlertIfNotInClient();
  } else {
    liff.closeWindow();
  }
});

document.getElementById("liffLoginButton").addEventListener("click", function () {
  if (!liff.isLoggedIn()) {
    liff.login();
  }
});

document.getElementById("liffLogoutButton").addEventListener("click", function () {
  if (liff.isLoggedIn()) {
    liff.logout();
    window.location.reload();
  }
});

const sendAlertIfNotInClient = () => {
  alert("Kamu harus buka lewat aplikasi line untuk memesan.");
};
