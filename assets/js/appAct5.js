const particle     = new Particle();
// Crea una nueva instancia de la clase Particle, que se utiliza para interactuar con la API de Particle.

const input        = document.getElementById('toggle');
// Obtiene la referencia al elemento HTML con el id 'toggle', que es un input tipo checkbox (interruptor).

const functionName = 'led';
// Define el nombre de la función que se va a llamar en el dispositivo Particle, en este caso, 'led'.

async function login() {
  try {
    const data = await particle.login({ username: credentials.user, password: credentials.password });
    // Intenta iniciar sesión en Particle con las credenciales proporcionadas (usuario y contraseña).
    return data.body.access_token;
    // Si la autenticación es exitosa, devuelve el token de acceso, necesario para hacer llamadas autenticadas a la API.
  } catch (err) {
    console.log('Could not log in.', err);
    // Si ocurre un error durante el inicio de sesión, se muestra un mensaje en la consola.
    throw err; 
    // Lanza el error para que pueda ser manejado por el código que llame a esta función.
  }
}

input.addEventListener('change', async () => {
  // Agrega un evento que se activa cuando el estado del checkbox (interruptor) cambia.
  const token = await login();
  // Llama a la función de inicio de sesión para obtener el token de acceso antes de realizar cualquier operación con Particle.
  const isChecked = input.checked;
  // Verifica si el checkbox está activado (true) o desactivado (false).
  const value = isChecked ? '1' : '0';
  // Asigna el valor '1' si el checkbox está activado o '0' si está desactivado. Este valor se enviará al dispositivo.

  try {    
    await particle.callFunction({ 
      deviceId: deviceId, 
      // Especifica el ID del dispositivo en el cual se va a ejecutar la función.
      name: functionName,
      // Indica el nombre de la función que se va a llamar en el dispositivo, en este caso, 'led'.
      argument: value, 
      // Pasa el argumento '1' o '0' a la función, según el estado del interruptor.
      auth: token,
      // Proporciona el token de acceso necesario para autenticar la llamada a la API.
    });
  } catch (err) {
    console.log('Error occurred while calling function:', err);
    // Si ocurre un error durante la llamada a la función, se muestra un mensaje en la consola.
  }
});