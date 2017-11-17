/**
 * jspsych-survey-likert
 * a jspsych plugin for measuring items on a likert scale
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['survey-likert'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-likert',
    description: '',
    parameters: {
      questions: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: undefined,
        no_function: false,
        description: ''
      },
      labels: {
        type: [jsPsych.plugins.parameterType.STRING],
        array: true,
        default: undefined,
        no_function: false,
        description: ''
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // default parameters for the trial
    trial.preamble = typeof trial.preamble === 'undefined' ? "" : trial.preamble;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // inject CSS for trial
    var node = display_element.innerHTML += '<style id="jspsych-survey-likert-css"></style>';
    var cssstr = ".jspsych-survey-likert-statement { display:block; font-size: 18px; padding-top: 30px; margin-bottom:10px; }"+
      ".jspsych-survey-likert-opts { list-style:none; width:100%; margin:0; padding:0 0 35px; display:block; font-size: 14px; line-height:1.1em; }"+
      ".jspsych-survey-likert-opt-label { line-height: 1.1em; }"+
      ".jspsych-survey-likert-opts:before { content: ''; position:relative; top:11px; /*left:9.5%;*/ display:block; background-color:#efefef; height:4px; width:100%; }"+
      ".jspsych-survey-likert-opts:last-of-type { border-bottom: 0; }"+
      ".jspsych-survey-likert-opts li { display:inline-block; /*width:19%;*/ text-align:center; vertical-align: top; }"+
      ".jspsych-survey-likert-opts li input[type=radio] { display:block; position:relative; top:0; left:50%; margin-left:-6px; }"
    display_element.querySelector('#jspsych-survey-likert-css').innerHTML = cssstr;

    // show preamble text
    display_element.innerHTML += '<div id="jspsych-survey-likert-preamble" class="jspsych-survey-likert-preamble">'+trial.preamble+'</div>';

    display_element.innerHTML += '<form id="jspsych-survey-likert-form">';

    var form_element = display_element.querySelector('#jspsych-survey-likert-form');
    // add likert scale questions
    for (var i = 0; i < trial.questions.length; i++) {
      // add question
      form_element.innerHTML += '<label class="jspsych-survey-likert-statement">' + trial.questions[i] + '</label>';

      // add options
      var width = 100 / trial.labels[i].length;
      options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
      for (var j = 0; j < trial.labels[i].length; j++) {
        options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][j] + '</label></li>';
      }
      options_string += '</ul>';
      form_element.innerHTML += options_string;
    }


var radios = display_element.querySelectorAll('input[type="radio"]');
var firstRadio=display_element.querySelector('input[type="radio"]');
firstRadio.checked='checked'
//console.log(firstRadio.checked)


document.addEventListener('keypress', function(e){
  
   if (e.keyCode==102){
   for(var i=0;i<radios.length;i++)
   {
       var radio = radios[i]

       if(radio.type=='radio')
       {
        
            if(radio.checked == true)
            {

                if(radios.length>i+1)
                {    
                    radio.checked=false;
                    var radioNext = radios[i+1];
                    radioNext.checked=true;
                    break;
                  
                 }
                 else
                 {
                     radios[0].checked=true;
                     break;
                
                  } 

               }
           }
      }


   } 
}) 



/*document.addEventListener('keypress', function(e){

  if (e.keyCode==102){
console.log(e.keyCode)
    for (var i=0; i<radios.length; i++) {
      console.log('works')
      if (radios[i].checked == true){
        console.log(radios[i])
        console.log('checked radio')
        radios[i].checked = false
        radios[i+1].checked = true
        break;
      }





    }
  }

})


document.addEventListener('keypress', function(e){

  if (e.keyCode==106){
console.log(e.keyCode)
    for (var i=0; i<radios.length; i++) {
      console.log('works')
      if (radios[i].checked == true){
        console.log(radios[i])
        console.log('checked radio')
        radios[i].checked = false
        radios[i-1].checked = true
        break;
      }





    }
  }

})
*/

document.addEventListener('keypress', function(e){
   if (e.keyCode==106){


   for(var i=0;i<radios.length;i++)
   {
       var radio = radios[i]
       if(radio.type=='radio')
       {
            if(radio.checked==true)
            {

                if(i>0)
                {
                    radio.checked==false
                    var radioPrevious = radios[i-1];
                    radioPrevious.checked=true;
                    break;
                  
                 }
                 else
                 {
                     radios[radios.length-1].checked=true;
                    break;
                  }

               }
           }
      }

   }
}) 


    
    document.addEventListener('keypress', function(e){
      if (e.keyCode==32) { 
      console.log('ready to submit')// measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      var matches = display_element.querySelectorAll('#jspsych-survey-likert-form .jspsych-survey-likert-opts');
      for(var index = 0; index < matches.length; index++){
        var id = matches[index].dataset['radioGroup'];
        var response = display_element.querySelector('input[name="' + id + '"]:checked').value;
        if (typeof response == 'undefined') {
          response = -1;
        }
        var obje = {};
        obje[matches[index].textContent] = response;
        Object.assign(question_data, obje);
      }

      // save data
      var trial_data = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trial_data);
    }});

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();