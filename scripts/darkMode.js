const darkMode = document.querySelector(".darkMode");  //se captura la clase del boton
const colorBlack = document.body;

darkMode.addEventListener("click", function(){
  colorBlack.classList.toggle("dark_mode");

  let theme;
  
  if (colorBlack.classList.contains("dark_mode")){

    theme = "Dark";
    darkMode.textContent = "Light mode";

  } else{

    theme = "Light";
    darkMode.textContent = "Dark mode";

  }

  //Guardar en el localStorage

  localStorage.setItem("PageTheme", JSON.stringify(theme));


})

let getTheme = JSON.parse(localStorage.getItem("PageTheme"));

if (getTheme === "Dark") {
  document.body.classList = "dark_mode";
  darkMode.textContent = "Light mode";
}