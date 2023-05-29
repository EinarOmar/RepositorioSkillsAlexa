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
      'WELCOME_MSG': 'Welcome! You can say Hello or Help. What would you like to convert? For example, try saying convert 10 centimeters to meters.',
      'HELP_MSG': 'You can greet me! How can I assist you?',
      'GOODBYE_MSG': 'Goodbye!',
      'ERROR_MSG': 'Sorry, I had trouble doing what you asked. Please try again.',
      'FALLBACK_MSG': 'Sorry, I don\'t understand. Please try again.',
      'CONVERSION_RESULT': 'The result of converting %s %s to %s is %s.',
      'ASK_MSG':'If you want to convert another unit try saying "convert 1000 meters to kilometers" otherwise say (goodbye) to end the skill'
    }
  },
  'es': {
    'translation': {
      'WELCOME_MSG': '¡Bienvenido! Puedes decir Hola o Ayuda. ¿Qué te gustaría convertir? Por ejemplo, prueba diciendo convierte 10 centímetros a metros.',
      'HELP_MSG': '¡Puedes saludarme! ¿En qué puedo ayudarte?',
      'GOODBYE_MSG': '¡Adiós!',
      'ERROR_MSG': 'Lo siento, tuve problemas para hacer lo que me pediste. Por favor, intenta nuevamente.',
      'FALLBACK_MSG': 'Lo siento, no entiendo. Por favor, intenta nuevamente.',
      'CONVERSION_RESULT': 'El resultado de convertir %s %s a %s es %s.',
      'ASK_MSG':'Si quieres convertir otra unidad prueba diciendo "convertir 1000 metros a kilometros" de no ser asi di (adios) para terminar la skill'
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

const CONVERSION_FACTORS_ES = {
  'centimetros': {
    'metros': 0.01,
    'kilometros': 0.00001,
    'pulgadas': 0.393701,
    'pies': 0.0328084
  },
  'metros': {
    'centimetros': 100,
    'kilometros': 0.001,
    'pulgadas': 39.3701,
    'pies': 3.28084
  },
  'kilometros': {
    'centimetros': 100000,
    'metros': 1000,
    'pulgadas': 39370.1,
    'pies': 3280.84
  },
  'pulgadas': {
    'centimetros': 2.54,
    'metros': 0.0254,
    'kilometros': 0.0000254,
    'pies': 0.0833333
  },
  'pies': {
    'centimetros': 30.48,
    'metros': 0.3048,
    'kilometros': 0.0003048,
    'pulgadas': 12
  }
};

const CONVERSION_FACTORS_EN = {
  'centimeters': {
    'meters': 0.01,
    'kilometers': 0.00001,
    'inches': 0.393701,
    'feet': 0.0328084
  },
  'meters': {
    'centimeters': 100,
    'kilometers': 0.001,
    'inches': 39.3701,
    'feet': 3.28084
  },
  'kilometers': {
    'centimeters': 100000,
    'meters': 1000,
    'inches': 39370.1,
    'feet': 3280.84
  },
  'inches': {
    'centimeters': 2.54,
    'meters': 0.0254,
    'kilometers': 0.0000254,
    'feet': 0.0833333
  },
  'feet': {
    'centimeters': 30.48,
    'meters': 0.3048,
    'kilometers': 0.0003048,
    'inches': 12
  }
};

const ConversorUnidades = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'ConversorUnidades'
    );
  },
  handle(handlerInput) {
    const { attributesManager } = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const intent = handlerInput.requestEnvelope.request.intent;
    const num = intent.slots.num.value;
    const primerDato = intent.slots.primerDato.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    const segundoDato = intent.slots.segundoDato.resolutions.resolutionsPerAuthority[0].values[0].value.name;

    // Verificar el idioma del usuario
    const locale = handlerInput.requestEnvelope.request.locale;
    let conversionFactors = CONVERSION_FACTORS_ES; // Por defecto, utilizar los factores de conversión en español

    // Si el idioma es inglés, utilizar los factores de conversión en inglés
    if (locale === 'en-US') {
      conversionFactors = CONVERSION_FACTORS_EN;
    }

    // Realizar la conversión
    const conversionFactor = conversionFactors[primerDato][segundoDato];
    const resultado = num * conversionFactor;

    const speechText = requestAttributes.t('CONVERSION_RESULT', num, primerDato, segundoDato, resultado);
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
    ConversorUnidades,
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