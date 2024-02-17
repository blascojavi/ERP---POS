var lineDataArray = [];
var transactionsData;

async function findLastTicket() {
        try {
                
            const response = await fetch('bbdd-JSON/transactions.json');
            transactionsData = await response.json();
    
            // Ordenar los tickets por número de ticket en orden descendente
            transactionsData.transactions.sort((a, b) => b.ticketNumber - a.ticketNumber);
    
            // Obtener el primer ticket (que es el último después de ordenar)
            const lastTicket = transactionsData.transactions[0];
            
            document.getElementById('numTicket').textContent =   lastTicket.ticketNumber + 1
            //console.log(lastTicket.ticketNumber)

            // Verificar si el ticket está abierto
            if (lastTicket && lastTicket.transactionOpen === "N") {
                console.log("Último ticket cerrado:", lastTicket);
            } else {
                console.log("No hay un último ticket cerrado.");
            }
        } catch (error) {
            console.error("Error al cargar el archivo transactions.json: " + error);
        }
    }
    findLastTicket()

let dateFormatted = ''

function updateDate() {
    // Obtiene la fecha y hora actual
    const dateCurrent = new Date();
    // Formatea la fecha como dd/mm/yyyy
    let day = dateCurrent.getDate();
    let month = dateCurrent.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    let year = dateCurrent.getFullYear();
    let hour = dateCurrent.getHours();
    let minute = dateCurrent.getMinutes();
    let seconds = dateCurrent.getSeconds();
    // Añade un cero delante si el día o el mes es menor que 10
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute; // si tiene un 0 delante lo pone, porque por defecto lo elimina 
    seconds = seconds < 10 ? '0' + seconds : seconds;
    // Construye la cadena de la fecha y hora
    const dateFormatted = hour + ' : ' + minute +' : '+ seconds +' '+ ' - ' + day + '/' + month + '/' + year;
    // Muestra la fecha en el elemento con id "fecha"
    document.getElementById('date').textContent = dateFormatted;
    //console.log(hour + ':' + minute +':'+ seconds)
}

// Llama a la función inicialmente
updateDate();

// Actualiza la fecha cada 60 segundos
setInterval(updateDate, 10); // 60 segundos = 60000 milisegundos



        //obtenemos el cliente desde la bbdd (PENDIENTE  DE CREAR LA BBDD)
//document.getElementById('client').textContent='id Cliente desde BBDD'

        //obtenemos el ticket 
//let ticketTotal = '1234'; //obtenemos el siguiente ticket + 1 de la bbdd para dar el nuevo
//let total = '125,50'; // sumaremos los importes de cada linea del ticket para dar el total


//document.getElementById('numTicket').textContent = 'Ticket: ' + ticketTotal
//document.getElementById('sumTotal').textContent = 'Total ticket: ' + "var ticketImport" + " €"


 // datos de la linea del ticket
 //const priceProductLine = '125,27';
//document.getElementById('code').textContent = '123456'
//document.getElementById('description').textContent = 'Descripcion del producto'
//document.getElementById('price').textContent = priceProductLine + ' €'

// Define una función para cargar los clientes desde el archivo JSON
async function loadCustomers() {
    try {
        // Ruta al archivo JSON de clientes
        const customersURL = 'bbdd-JSON/customers.json';

        // Realiza la solicitud para obtener los datos del archivo JSON
        const response = await fetch(customersURL);
        const customersData = await response.json();

        // Obtiene el elemento select por su ID
        var clientSelect = document.getElementById('client');

        // Recorre los clientes y agrega opciones al select
        customersData.customers.forEach(customer => {
            var option = document.createElement('option');
            option.value = customer.id;
            option.text = customer.name;
            clientSelect.add(option); 
        });

    } catch (error) {
        console.error("Error al cargar el archivo customers.json: " + error);
    }
}




// Función para agregar una nueva línea al ticket
async function newLine(productCode) {
    try {
        var response = await fetch('bbdd-JSON/products.json');
        var productos = await response.json();

        var productoEncontrado = productos.products.find(function (producto) {
            return producto.id == productCode;
        });

        if (productoEncontrado) {
            var codigo = productoEncontrado.id;
            var descripcion = productoEncontrado.description;
            var precio = productoEncontrado.price;

            var newLine = document.createElement("div");
            newLine.className = "productDetails"; // Agrega la clase productDetails

            var codeElement = document.createElement("div");
            codeElement.className = "detail";
            codeElement.textContent =  codigo;
            codeElement.id = "code";

            var descriptionElement = document.createElement("div");
            descriptionElement.className = "detail";
            descriptionElement.textContent = descripcion;
            descriptionElement.id = "description";

            var priceElement = document.createElement("div");
            priceElement.className = "detail";
            priceElement.textContent =  precio + ' €';
            priceElement.id = "price";

            newLine.appendChild(codeElement);
            newLine.appendChild(descriptionElement);
            newLine.appendChild(priceElement);

            var productLineDiv = document.getElementById("product-line");
            productLineDiv.appendChild(newLine);

            var brElement = document.createElement("br");
            productLineDiv.appendChild(brElement);

            // Obtén el elemento divTicketLines
            var divTicketLines = document.getElementById("divTicketLines");

            // Haz scroll hacia abajo para mostrar la última línea añadida
            divTicketLines.scrollTop = divTicketLines.scrollHeight;

            // Crear un objeto con los datos de la línea
            var lineData = {
                codigo: codigo,
                descripcion: descripcion,
                precio: precio
            };
            // Agregar el objeto al array de la línea para guardarlo en el ticket
            lineDataArray.push(lineData);
        } else {
            alert("Producto no encontrado");
        }
    } catch (error) {
        alert("Error al cargar el archivo products.json: " + error);
    }
    console.log(lineDataArray);
    sumLine();
}

    
   // Función para cargar el último ticket abierto
   async function loadLastOpenTicket() {
        try {
            var response = await fetch('bbdd-JSON/transactions.json');
            var transactionsData = await response.json();
            console.log("transactionsData:", transactionsData);
    
            var lastOpenTicket = transactionsData.transactions.find(ticket => ticket.transactionOpen === "S");
            console.log("lastOpenTicket:", lastOpenTicket);
    
            if (lastOpenTicket) {
                lastOpenTicket.products.forEach(product => {
                    for (let i = 0; i < product.quantity; i++) {
                        newLine(product.productId);
                    }
                document.getElementById('numTicket').textContent = lastOpenTicket.ticketNumber
                });
        
        
            }
        } catch (error) {
            console.error("Error al cargar el archivo transactions.json: " + error);
        }
    }
    

    function sumLine() {
        // Inicializar la variable para almacenar la suma de precios
        var totalPrecio = 0;
    
        // Recorrer el array y sumar los precios
        for (var i = 0; i < lineDataArray.length; i++) {
            totalPrecio += lineDataArray[i].precio;
            console.log("precio");
        }
    
        // Asignar la suma al contenido del elemento con id='sumTotal'
        document.getElementById('sumTotal').textContent = totalPrecio.toFixed(2) + " €"; // mostrar dos decimales
        console.log("total: " + totalPrecio);
    }

    async function recordTicket() {
        try {
            // Obtiene la fecha y hora actual
            const dateCurrent = new Date();
            const dateFormatted = `${dateCurrent.getHours()}:${dateCurrent.getMinutes()}:${dateCurrent.getSeconds()} - ${dateCurrent.getDate()}/${dateCurrent.getMonth() + 1}/${dateCurrent.getFullYear()}`;
    
            let numTicketRecord = document.getElementById('numTicket').textContent;
            let clientSelect = document.getElementById('client');
            let selectedClientId = clientSelect.value;
    
            // Crear o modificar el ticket con el número de ticket actual
            let existingTicketIndex = transactionsData.transactions.findIndex(ticket => ticket.ticketNumber === parseInt(numTicketRecord));
    
            if (existingTicketIndex !== -1) {
                // Si ya existe un ticket con el número actual, modifica sus datos
                let existingTicket = transactionsData.transactions[existingTicketIndex];
                existingTicket.clientId = parseInt(selectedClientId);
                existingTicket.data = dateFormatted;
                existingTicket.hour = '';
                existingTicket.transactionOpen = "N";
                existingTicket.products = lineDataArray.map(line => ({
                    productId: line.codigo,
                    quantity: 1, // Ajustar según necesidades
                    priceUnit: line.precio,
                    description: line.descripcion
                }));
                existingTicket.total = lineDataArray.reduce((total, line) => total + line.precio, 0);
            } else {
                // Si no existe un ticket con el número actual, crea un nuevo ticket
                let newTicket = {
                    ticketNumber: parseInt(numTicketRecord),
                    clientId: parseInt(selectedClientId),
                    data: dateFormatted,
                    hour: '',
                    transactionOpen: "N",
                    products: lineDataArray.map(line => ({
                        productId: line.codigo,
                        quantity: 1, // Ajustar según necesidades
                        priceUnit: line.precio,
                        description: line.descripcion
                    })),
                    total: lineDataArray.reduce((total, line) => total + line.precio, 0)
                };
    
                transactionsData.transactions.push(newTicket);
            }
    
            // Actualizar el archivo transactions.json con los nuevos datos
            // ... (código para guardar transactionsData en el archivo)
    
            // Limpiar el array de datos de línea después de grabar
            lineDataArray = [];
        } catch (error) {
            console.error("Error al ejecutar recordTicket: " + error);
        }
    }
    
    

    
// Obtén una referencia al botón por su ID
var btnGrabarTicket = document.getElementById('btnGrabarTicket');


// Agregamos un event listener para el evento de clic
btnGrabarTicket.addEventListener('click', function() {
    // Llama a la función recordTicket cuando se hace clic en el botón
    recordTicket();
});



window.addEventListener('load', function () {
    findLastTicket(); // Llamada para cargar los datos del último ticket al inicio
    loadCustomers();   // Llamada para cargar los clientes al inicio
    loadLastOpenTicket();  // Llamada para cargar el último ticket abierto al inicio

});