# @gojiraf/analytics

Modulo para trabajar con Google Analytics y futuros eventos.

Requiere un variable de entorno llamada: REACT_APP_GA_TRACKING

Prod: G-NK20CH00TZ
Staging: G-075T0YMKEE
UAT: G-N5PN4W0JGH

Cuenta con un Hook que exporta dos funciones:

### gaEventTracker

Para enviar eventos a Google 
Recibe dos parámetros; categoría del evento y el evento (ambos string)

### gaSendPageView
Para enviar la vista de una pagina especifica a Google (este último se debe utilizar en views dentro del proyecto)



Ejemplo de Uso:

```
import React from 'react';
import { useGoogleAnalytics } from '@gojiraf/analytics'


const Component = () => {
  const { gaEventTracker, gaSendPageView } = useGoogleAnalytics()

  useEffect(() => {
    gaSendPageView()
  }, [])

  const sendEvent = () => {
    gaEventTracker(Login Page', 'home-page-login-button-moderator')
  }
 
  return (
   <>
   <button 
   onClick={() => sendEvent()}
   />
   </>
  )
}

```

//TODO:
enviar eventos detallados de productos que se compraron, se puede hacer poniendo un evento en la view que se renderiza al terminar la compra!


https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?hl=es#purchase

 const listadoDeProductoVariantesYCantidad = () => {
    // Obtener todos los elementos div con clase "max-h-32"
    const productElements = document.querySelectorAll(".max-h-32");

    // Crear un array para almacenar los productos
    const productList: string[] = [];

    // Iterar sobre cada elemento div
    productElements.forEach((productElement) => {
      // Obtener el precio del producto
      // const priceElement = productElement.querySelector(".font-semibold");
      // const price = priceElement?.textContent?.trim();

      // Obtener el nombre del producto
      const nameElement = productElement.querySelector(".overflow-hidden.text-ellipsis.text-sm.font-medium");
      const name = nameElement?.textContent?.trim();

      // Obtener el elemento span con la clase "lin"
      const linElement = productElement.querySelector(".overflow-hidden.text-ellipsis.text-sm.text-gray-400.font-medium.lin");
      const lin = linElement?.textContent?.trim();

      // Crear un objeto para almacenar los datos del producto
      const product = `[${name} ${lin}]`


      // Agregar el objeto del producto al array productList
      productList.push(product);
    });

    // Retornar la lista de productos
    console.log(productList)
    return productList;
  }