module.exports = (phone, mask = '*****') => {
  const pattern =/\d{10}/g;
  const strippedPhone = phone.match(pattern);
  let parsedPhone = null;

  if(strippedPhone ) { //is a phone number 
    parsedPhone  = strippedPhone[0];
    parsedPhone = `+1${mask}${parsedPhone.substr(6)}`;
  }
  return parsedPhone;
}