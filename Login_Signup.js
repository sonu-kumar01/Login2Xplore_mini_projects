const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click',()=>{
  container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click',()=>{
  container.classList.remove("sign-up-mode");
});

///////////-------------GET USER REQUEST-------------//////////////////////////

function validateGetFormData() {
  var userIdVar = $("#User-SignIn").val();
  if (userIdVar === "") {
    swal("Warning !","Username is Required Value.","warning");
    $("#User-SignIn").focus();
    return "";
  }
  var passVar = $("#Pass-SignIn").val();
  if (passVar === "") {
    swal("Warning !","Password is Required Value.","warning");
    $("#Pass-SignIn").focus();
    return "";
  }
  var jsonStrObj = {
    username : userIdVar,
    password: passVar,
  };
  return JSON.stringify(jsonStrObj);
}

function createGETRequest(token, dbname, relationName, jsonObjStr) {
  var value1 = "{\n"
          + "\"token\" : \""
          + token
          + "\",\n" + "\"cmd\" : \"GET\",\n"
          + "\"dbName\": \""
          + dbname
          + "\",\n"
          + "\"rel\" : \""
          + relationName
          + "\",\n"
          + "\"jsonStr\":\n"
          + jsonObjStr
          + "\n"
          + "}";
  return value1;
}

function executeGetCommand(reqString, dbBaseUrl, apiEndPointUrl) {
  var url = dbBaseUrl + apiEndPointUrl;
  var jsonObj;
  $.post(url, reqString, function (result) {
  jsonObj = JSON.parse(result);
  }).fail(function (result) {
  var dataJsonObj = result.responseText;
  jsonObj = JSON.parse(dataJsonObj);
  });
  return jsonObj;
}

function resetSignInForm() {
  $("#User-SignIn").val("")
  $("#Pass-SignIn").val("");
  $("#User-SignIn").focus();
}
  

function getUser() {
  var jsonStr = validateGetFormData();
  if (jsonStr === "") {
    return;
  }
  var getReqStr = createGETRequest("90935402|-31948797808298075|90931769","USER", "USER-REL", jsonStr);
  jQuery.ajaxSetup({async: false});
  var resultObj = executeGetCommand(getReqStr,"http://api.login2explore.com:5577", "/api/irl");
  
  if(resultObj["status"]==200){
    var data = JSON.stringify(resultObj);
    var details = JSON.parse(data);
    var user = JSON.parse(details["data"]);
    var stringuser = "Your details grabbed from JsonPoweredDB .\n\n"+
                       " Username : "+user["username"]+"\n"+
                      "   Password : "+user["password"]+"\n"+
                      "   Email : "+user["email"];
    swal("Info !", stringuser, "info");
  }else{
    swal("Error !","Please Try Again , User Not Found    ( Case Sensitive ).","error");
  }

  jQuery.ajaxSetup({async: true});
  resetSignInForm();
}



///////////-------------SignUp USER REQUEST-------------//////////////////////////

function validateSaveFormData() {
  var userIdVar = $("#User-SignUp").val();
  if (userIdVar === "") {
    swal("Warning !","Username is Required Value","warning");
    $("#User-SignUp").focus();
    return "";
  }
  var emailVar = $("#Email-SignUp").val();
  if (passVar === "") {
    swal("Error !","Email is Required Value .","warning");
    $("#Email-SignUp").focus();
    return "";
  }
  var passVar = $("#Pass-SignUp").val();
  if (passVar === "") {
    swal("Warning !","Password is Required Value","warning");
    $("#Pass-SignUp").focus();
    return "";
  }
  var jsonStrObj = {
    username : userIdVar,
    password: passVar,
    email : emailVar,
  };
  alert(JSON.stringify(jsonStrObj));
  return JSON.stringify(jsonStrObj);
}


function resetSignUpForm() {
  $("#User-SignUp").val("")
  $("#Pass-SignUp").val("");
  $("Email-SignUp").val("");
  $("#User-SignUp").focus();
}

// This method is used to create PUT Json request.
function createPUTRequest(connToken, jsonObj, dbName, relName) {
  var putRequest = "{\n"
          + "\"token\" : \""
          + connToken
          + "\","
          + "\"dbName\": \""
          + dbName
          + "\",\n" + "\"cmd\" : \"PUT\",\n"
          + "\"rel\" : \""
          + relName + "\","
          + "\"jsonStr\": \n"
          + jsonObj
          + "\n"
          + "}";
  return putRequest;
}

function executePutCommand(reqString, dbBaseUrl, apiEndPointUrl) {
  var url = dbBaseUrl + apiEndPointUrl;
  var jsonObj;
  $.post(url, reqString, function (result) {
  jsonObj = JSON.parse(result);
  }).fail(function (result) {
  var dataJsonObj = result.responseText;
  jsonObj = JSON.parse(dataJsonObj);
  });
  return jsonObj;
}

function saveUser() {
  var jsonStr = validateSaveFormData();
  if (jsonStr === "") {
    return;
  }
  var putReqStr = createPUTRequest("90935402|-31948797808298075|90931769",jsonStr, "USER", "USER-REL");
  // alert("PUT Request: "+putReqStr);
  jQuery.ajaxSetup({async: false});
  var resultObj = executePutCommand(putReqStr,"http://api.login2explore.com:5577", "/api/iml");
  if(resultObj["status"]==200){
    swal("Registered !","Now Kindly Use Sign-In to Enter.","success");
  }else{
    swal("Error !","Please Try Again , Looks Like There was some error.","Error");
  }
  jQuery.ajaxSetup({async: true});
  resetSignUpForm();
}