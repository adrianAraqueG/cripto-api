const formulario = document.querySelector('#formulario');
const moneda = document.querySelector('#moneda');
const criptomonedaSelect = document.querySelector('#criptomonedas');
const resultado = document.querySelector('#resultado');

const objResultado = {
    moneda: '',
    criptomoneda: ''
};

const monedasLocales = [
    {name: 'USD', fullname: 'Dólar americano'},
    {name: 'COP', fullname: 'Peso Colombiano'},
    {name: 'MXN', fullname: 'Peso Mexicano'},
    {name: 'EUR', fullname: 'Euros'},
];

obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
})

window.onload = ()=>{
    buscarCriptomonedas();
    llenarMonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedaSelect.addEventListener('change', leerValor);
    moneda.addEventListener('change', leerValor);
}

function buscarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then(resultado => resultado.json() )
        .then(respuesta => mapearCriptomonedas(respuesta.Data) )
        // .then( criptomonedas => mapearCriptomonedas(criptomonedas))
        .catch( error => console.log(error));
}

function mapearCriptomonedas(datos){

    datos.forEach( dato =>{
        const { FullName, Name } = dato.CoinInfo;

        const opcion = document.createElement('option');
        opcion.value = Name;
        opcion.textContent = FullName;

        criptomonedaSelect.appendChild(opcion);
    })
}

function leerValor(e){
    objResultado[e.target.name] = e.target.value;
}

function submitFormulario(e){
    e.preventDefault();
    const {moneda, criptomoneda} = objResultado;

    if(moneda === '' || criptomoneda === ''){

        return mostrarAlerta('Todos los campos son obligatorios', formulario);
    }

    consultarAPI();
}

function mostrarAlerta(msj, div){
    const alertaExiste = document.querySelector('div .error');

    if(!alertaExiste){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');
        
        divMensaje.textContent = msj;

        div.appendChild(divMensaje);

        setTimeout( () => {
            divMensaje.remove();
        }, 3000);
    }
    
}

async function consultarAPI(){
    const { moneda, criptomoneda} = objResultado;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    try{
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();

        mostrarInfo(resultado.DISPLAY[criptomoneda][moneda]);
    }catch(error){
        console.log(error);
        limpiarHTML();
        mostrarAlerta('Ocurrió un error al realizar la búsqueda', resultado);
    }

}

function mostrarInfo(cotizacion){
    limpiarHTML();

    const  { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;


    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio más alto del día: <span>${HIGHDAY}</span> </p>`;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio más bajo del día: <span>${LOWDAY}</span> </p>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `<p>Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `<p>Última Actualización: <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function llenarMonedas(){
    monedasLocales.forEach( coin => {
        const {name, fullname} = coin;
        const opcionMoneda = document.createElement('option');
        opcionMoneda.textContent = fullname;
        opcionMoneda.value = name;

        moneda.appendChild(opcionMoneda);
    });
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>    
    `;

    resultado.appendChild(divSpinner);
}