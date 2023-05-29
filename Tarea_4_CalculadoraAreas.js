// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

// We create a language strings object containing all of our strings. 
// The keys for each string will then be referenced in our code
// e.g. requestAttributes.t('WELCOME_MSG')
const languageStrings = {
  'en': {
    'translation': {
      'WELCOME_MSG': 'Welcome! You can say what is the area of a triangle with a base of 10 meters and a height of 10 meters. Or you can ask for help.',
      'HELP_MSG': 'I am a skill that can give you the areas of triangles, rectangles, and circles. Try saying what is the area of a triangle with a base of 10 meters and a height of 10 meters.',
      'GOODBYE_MSG': 'Goodbye! Come back when you have another area question!',
      'ERROR_MSG': 'Sorry, I had trouble doing what you asked. Please try again.',
      'FALLBACK_MSG': 'Sorry, I don\'t understand. Please try again.',
      'CONVERSION_RESULT': 'The area of %s is %s %s.',
      'ASK_MSG': 'If you want to know the area of another shape, try saying what is the area of a circle with a diameter of 10 centimeters. Otherwise, say (goodbye) to end the skill.'
    }
  },
  'es': {
    'translation': {
      'WELCOME_MSG': '¡Bienvenido! Puedes decir calcula el area de un triangulo con una altura de diez metros y una base de diez metros. O puedes pedir ayuda.',
      'HELP_MSG': 'Soy una skill que puede darte áreas de triángulos, rectángulos y círculos. Prueba diciendo cuál es el área de un triángulo con una base de 10 metros y una altura de 10 metros.',
      'GOODBYE_MSG': '¡Adiós! ¡Regresa cuando tengas otra pregunta sobre áreas!',
      'ERROR_MSG': 'Lo siento, tuve problemas para hacer lo que me pediste. Por favor, intenta nuevamente.',
      'FALLBACK_MSG': 'Lo siento, no entiendo. Por favor, intenta nuevamente.',
      'CONVERSION_RESULT': 'El area de %s es %s %s.',
      'ASK_MSG': 'Si quieres saber el área de otra figura, prueba diciendo cual es el area de un circulo con un diametro de 10 centimetros. De lo contrario, di (adiós) para terminar la skill.'
    }
  }
};


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('WELCOME_MSG');
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CalcularAreas = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'CalcularAreas'
    );
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const intent = handlerInput.requestEnvelope.request.intent;
    let resultado = 0.0;
    let tipoUnidad = 'centimetros';
    let tercerNum = parseFloat(intent.slots.tercerNum.value);
    let tipoArea = intent.slots.tipoArea.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    if (isNaN(tercerNum)) {
      tercerNum = 0;
      let primerNum = parseFloat(intent.slots.primerNum.value);
      let segundoNum = parseFloat(intent.slots.segundoNum.value);

      // Realizar el cálculo del área
      const primeraUnidad = intent.slots.primeraUnidad.resolutions.resolutionsPerAuthority[0].values[0].value.name;
      const segundaUnidad = intent.slots.segundaUnidad.resolutions.resolutionsPerAuthority[0].values[0].value.name;

      if (tipoArea === 'rectangulo' || tipoArea === 'rectangle') {
        if (primeraUnidad === 'metros' || primeraUnidad === 'meters' || primeraUnidad === 'm') {
          if (segundaUnidad === 'metros' || segundaUnidad === 'meters' || segundaUnidad === 'm') {
            // Ambos son metros
            tipoUnidad = 'metros';
          } else {
            // Solo el segundo número es en metros, convertir a centímetros
            segundoNum = segundoNum * 100;
          }
        } else if (segundaUnidad === 'metros' || segundaUnidad === 'meters' || segundaUnidad === 'm') {
          // Solo el primer número es en metros, convertir a centímetros
          primerNum = primerNum * 100;
        }
        resultado = primerNum * segundoNum;
      } else if (tipoArea === 'triangulo' || tipoArea === 'triangle') {
        if (primeraUnidad === 'metros' || primeraUnidad === 'meters' || primeraUnidad === 'm') {
          if (segundaUnidad === 'metros' || segundaUnidad === 'meters' || segundaUnidad === 'm') {
            // Ambos son metros
            tipoUnidad = 'metros';
          } else {
            // Solo el segundo número es en metros, convertir a centímetros
            segundoNum = segundoNum * 100;
          }
        } else if (segundaUnidad === 'metros' || segundaUnidad === 'meters' || segundaUnidad === 'm') {
          // Solo el primer número es en metros, convertir a centímetros
          primerNum = primerNum * 100;
        }
        resultado = (primerNum * segundoNum) / 2;
      }
    } else {
      const dimencion = intent.slots.dimencion.resolutions.resolutionsPerAuthority[0].values[0].value.name || "";
      const terceraUnidad = intent.slots.terceraUnidad.resolutions.resolutionsPerAuthority[0].values[0].value.name || "";

      if (tipoArea === 'circulo' || tipoArea === 'circle') {
        if (dimencion === 'diametro' || dimencion === 'diameter') {
          tercerNum = tercerNum / 2;
        }
        if (terceraUnidad === 'metros' || terceraUnidad === 'meters' || terceraUnidad === 'm') {
          tipoUnidad = 'metros';
        }
        resultado = 3.1416 * (tercerNum * tercerNum);
      }
    }

    // Cambiar tipo de unidad dependiendo del lenguaje
    const locale = handlerInput.requestEnvelope.request.locale;

    if (locale === 'en') {
      if (tipoUnidad === 'metros') {
        tipoUnidad = 'meters';
      } else if (tipoUnidad === 'centimetros') {
        tipoUnidad = 'centimeters';
      }
      if (tipoArea === 'rectangulo') {
        tipoArea = 'rectangle';
      } else if (tipoArea === 'triangulo') {
        tipoArea = 'triangle';
      } else if (tipoArea === 'circulo') {
        tipoArea = 'circle';
      }
    } else {
      if (tipoUnidad === 'meters') {
        tipoUnidad = 'metros';
      } else if (tipoUnidad === 'centimeters') {
        tipoUnidad = 'centímetros';
      }
    }

    // Realizar la conversión
    const speechText = requestAttributes.t('CONVERSION_RESULT', tipoArea, resultado, tipoUnidad);
    const pregunta = requestAttributes.t('ASK_MSG');
    return handlerInput.responseBuilder
      .speak(speechText + ' ' + pregunta)
      .getResponse();
  }
};


const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('HELP_MSG');

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('GOODBYE_MSG');

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};

const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('FALLBACK_MSG');

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse();
  }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest';
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const intentName = handlerInput.requestEnvelope.request.intent.name;
    const speechText = requestAttributes.t('REFLECTOR_MSG', intentName);

    return handlerInput.responseBuilder
      .speak(speechText)
      //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
      .getResponse();
  }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const speechText = requestAttributes.t('ERROR_MSG');

    console.log(`~~~~ Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
  process(handlerInput) {
    console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
  }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
  process(handlerInput, response) {
    console.log(`Outgoing response: ${JSON.stringify(response)}`);
  }
};

// This request interceptor will bind a translation function 't' to the requestAttributes.
const LocalizationRequestInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    };
  }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    CalcularAreas,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
  .addErrorHandlers(ErrorHandler)
  .addRequestInterceptors(
    LocalizationRequestInterceptor,
    LoggingRequestInterceptor)
  .addResponseInterceptors(LoggingResponseInterceptor)
  .lambda();
