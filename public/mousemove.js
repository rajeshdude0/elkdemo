var mouseMovePre = document.getElementById('mousemove');
var outputPre = document.getElementById('output');
var browserFingerPrint='';
new Fingerprint2().get(function(result, components){
  console.log(result); //a hash, representing your device fingerprint
  browserFingerPrint = result;
});

mouseMovePre.addEventListener('mousemove', function(e){

    var output = {
        browserid : browserFingerPrint,
        position: { x: e.clientX, y: e.clientY }
    }
    outputPre.innerHTML+= JSON.stringify(output).concat("\n");
});

function hashCode(str) {
  return str.split('').reduce((prevHash, currVal) =>
    ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
}
