function setCookie(nombre, valor) {
    document.cookie = nombre + "=" + valor + ";";
  }
  
  // Uso de la función
  if(!window.location.href.replace(window.location.origin,"").includes("/rt/")){
    setCookie("origin", window.location.href.replace(window.location.origin,""));
  }else{
    alert(1)
  }
