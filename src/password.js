
function encrypt(string, uuid){
  const array = string.split('');
  return array.map((letter, i) => {
    return letter.charCodeAt(0) + uuid.charCodeAt(i);
  }).join('');
}

function decrypt(string, uuid){
  const array = string.split('');
  return array.map((letter, i) => {
    return letter.charCodeAt(0) - uuid.charCodeAt(i);
  }).join('');
}

module.exports = {
  encrypt: encrypt,
  decrypt: decrypt
};
