/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const languageFacts = {
  java: [
    "Java es un lenguaje de programación creado por James Gosling y su equipo en Sun Microsystems en la década de 1990.",
    "Java se diseñó para ser un lenguaje de programación portátil, lo que significa que los programas escritos en Java pueden ejecutarse en diferentes plataformas sin necesidad de reescribir el código fuente.",
    "Es ampliamente utilizado en el desarrollo de aplicaciones empresariales, aplicaciones móviles Android y sistemas embebidos.",
    "Java es un lenguaje orientado a objetos con una sintaxis similar a C++, pero con un enfoque en la simplicidad y la seguridad del código."
  ],
  javascript: [
    "JavaScript fue desarrollado en solo 10 días por Brendan Eich en 1995 para agregar interactividad a las páginas web.",
    "A pesar de su nombre similar, JavaScript no está relacionado directamente con el lenguaje de programación Java.",
    "Es uno de los lenguajes más populares en la actualidad y se utiliza tanto en el frontend como en el backend del desarrollo web."
  ],
  php: [
    "PHP es un lenguaje de programación del lado del servidor ampliamente utilizado para el desarrollo web.",
    "PHP se destaca por su capacidad de interactuar con bases de datos, lo que lo convierte en una opción popular para construir aplicaciones web dinámicas y sitios con contenido dinámico.",
    "Es un lenguaje fácil de aprender y cuenta con una gran cantidad de recursos y documentación disponibles para los desarrolladores."
  ],
  c: [
    "C es un lenguaje de programación de propósito general que ha influido en el desarrollo de muchos otros lenguajes.",
    "Es un lenguaje de programación de nivel medio, lo que significa que proporciona un equilibrio entre la programación de bajo nivel y la programación de alto nivel.",
    "C es ampliamente utilizado en el desarrollo de sistemas operativos, compiladores, controladores de dispositivos y otros programas de software de bajo nivel.",
    "Es conocido por su eficiencia y capacidad de manipular directamente la memoria del sistema, lo que brinda un control preciso sobre el hardware y los recursos del sistema."
  ],
  python: [
    "Python es un lenguaje de programación interpretado, de alto nivel y multiparadigma.",
    "Es conocido por su sintaxis clara y legible, lo que facilita su aprendizaje y comprensión.",
    "Python se destaca en el desarrollo de aplicaciones web, análisis de datos, inteligencia artificial y automatización de tareas.",
    "Una de las ventajas de Python es su amplia colección de bibliotecas y frameworks, como Django y Flask, que aceleran el desarrollo de aplicaciones y promueven la reutilización de código."
  ]
};
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Hola, bienvenido a curiosidades de lenguajes de programacion, prueba diciendo (hablame de "nombre sobre leguaje")';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const CustomLanguageIntentHandler = {
    canHandle(handlerInput) {
        return (
            Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            Alexa.getIntentName(handlerInput.requestEnvelope) === "CustomLanguageIntent"
        );
    },
    handle(handlerInput) {
        const { language } = handlerInput.requestEnvelope.request.intent.slots;
        let response;
        let pregunta;
        if (language && languageFacts[language.value]) {
          response =languageFacts[language.value][Math.floor(Math.random() * languageFacts[language.value].length)];
          pregunta = '¿Quieres saber curiosidades de otro lenguaje? prueba diciendo (prueba java) de no ser asi di (adios) para terminar la skill';
        } else {
          response = "No tengo información sobre el lenguaje que has mencionado, prueba con otro";
        }
        return handlerInput.responseBuilder
        //.speak(response)
        .speak(response + ' ' + pregunta)
          .reprompt(response)
          .getResponse();
    },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Puedo darte datos curiosos de lenguajes de programacion, prueba diciendo (hablame sobre java) ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Espero tengas un lindo dia';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {// no reconoce el comando
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'No tengo conocimientos sobre lo que me has comentado, prueba diciendo prueba java.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        CustomLanguageIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();